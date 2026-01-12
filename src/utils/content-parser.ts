import type { SiteContent, Game, Category, Service, PaymentMethod, Footer, Feature } from '../types';
import fs from 'fs';
import path from 'path';

// Parse categories from categories.md
function parseCategories(): Category[] {
  const categoriesPath = path.join(process.cwd(), 'src', 'content', 'categories', 'categories.md');
  const content = fs.readFileSync(categoriesPath, 'utf-8');
  const lines = content.split('\n');
  
  const categories: Category[] = [];
  let currentCategory: Partial<Category> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('## ') && !line.includes('Configuration')) {
      // Save previous category if exists
      if (currentCategory.id && currentCategory.name && currentCategory.description && currentCategory.icon) {
        categories.push(currentCategory as Category);
      }
      currentCategory = {};
    } else if (line.startsWith('- **ID**:')) {
      currentCategory.id = line.split(':')[1].trim();
    } else if (line.startsWith('- **Name**:')) {
      currentCategory.name = line.split(':')[1].trim();
    } else if (line.startsWith('- **Description**:')) {
      currentCategory.description = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.startsWith('- **Icon**:')) {
      currentCategory.icon = line.split(':')[1].trim();
    }
  }
  
  // Save last category
  if (currentCategory.id && currentCategory.name && currentCategory.description && currentCategory.icon) {
    categories.push(currentCategory as Category);
  }
  
  return categories;
}

// Parse home features from home.md
function parseHomeFeatures() {
  const homePath = path.join(process.cwd(), 'src', 'content', 'home', 'home.md');
  const content = fs.readFileSync(homePath, 'utf-8');
  const lines = content.split('\n');
  
  const features: Feature[] = [];
  let sectionTitle = '';
  let sectionDescription = '';
  let currentFeature: Partial<Feature> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('### Section Title')) {
      i++;
      sectionTitle = lines[i].trim();
    } else if (line.startsWith('### Section Description')) {
      i++;
      sectionDescription = lines[i].trim();
    } else if (line.startsWith('#### Feature')) {
      // Save previous feature if exists
      if (currentFeature.icon && currentFeature.title && currentFeature.description) {
        features.push(currentFeature as Feature);
      }
      currentFeature = {};
    } else if (line.startsWith('- **Icon**:')) {
      currentFeature.icon = line.split(':')[1].trim();
    } else if (line.startsWith('- **Title**:')) {
      currentFeature.title = line.split(':')[1].trim();
    } else if (line.startsWith('- **Description**:')) {
      currentFeature.description = line.substring(line.indexOf(':') + 1).trim();
    }
  }
  
  // Save last feature
  if (currentFeature.icon && currentFeature.title && currentFeature.description) {
    features.push(currentFeature as Feature);
  }
  
  return {
    sectionTitle,
    sectionDescription,
    items: features
  };
}

// Parse services from services.md
function parseServices(): Service[] {
  const servicesPath = path.join(process.cwd(), 'src', 'content', 'services', 'services.md');
  const content = fs.readFileSync(servicesPath, 'utf-8');
  const lines = content.split('\n');
  
  const services: Service[] = [];
  let currentService: Partial<Service> & { description?: string[] } = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('## ') && !line.includes('Configuration')) {
      // Save previous service if exists
      if (currentService.id && currentService.title && currentService.categoryId && 
          currentService.price !== undefined && currentService.image && currentService.description) {
        services.push(currentService as Service);
      }
      currentService = { description: [] };
    } else if (line.startsWith('- **ID**:')) {
      currentService.id = line.split(':')[1].trim();
    } else if (line.startsWith('- **Title**:')) {
      currentService.title = line.split(':')[1].trim();
    } else if (line.startsWith('- **Category**:')) {
      currentService.categoryId = line.split(':')[1].trim();
    } else if (line.startsWith('- **Games**:')) {
      // Parse games array: - **Games**: game-1, game-2, game-3
      const gamesStr = line.split(':')[1].trim();
      currentService.games = gamesStr.split(',').map(g => g.trim());
    } else if (line.startsWith('- **Price**:')) {
      currentService.price = parseInt(line.split(':')[1].trim());
    } else if (line.startsWith('- **Image**:')) {
      currentService.image = line.split(':')[1].trim();
    } else if (line.startsWith('- **BarPrice**:')) {
      // Parse BarPrice object
      const barPrice: any = {};
      i++;
      while (i < lines.length && lines[i] && lines[i].trim().startsWith('-') && !lines[i].includes('**')) {
        const barLine = lines[i].trim();
        if (barLine.includes('InitValue:')) {
          barPrice.initValue = parseInt(barLine.split(':')[1].trim());
        } else if (barLine.includes('FinalValue:')) {
          barPrice.finalValue = parseInt(barLine.split(':')[1].trim());
        } else if (barLine.includes('Step:')) {
          barPrice.step = parseInt(barLine.split(':')[1].trim());
        } else if (barLine.includes('Label:')) {
          barPrice.label = barLine.split(':')[1].trim();
        }
        i++;
      }
      i--;
      if (barPrice.initValue !== undefined && barPrice.finalValue !== undefined && barPrice.step !== undefined) {
        currentService.barPrice = barPrice;
      }
    } else if (line.startsWith('- **BoxPrice**:')) {
      // Parse BoxPrice array (ahora soporta objetos con value y title)
      const boxPriceValues: any[] = [];
      i++;
      while (i < lines.length && lines[i] && lines[i].trim().startsWith('-') && !lines[i].includes('**')) {
        const boxLine = lines[i].trim();
        
        // Verificar si tiene formato con título: "- Title: 100"
        const titleMatch = boxLine.match(/^-\s*(.+?):\s*(\d+)/);
        if (titleMatch) {
          boxPriceValues.push({
            title: titleMatch[1].trim(),
            value: parseInt(titleMatch[2])
          });
        } else {
          // Formato simple solo número: "- 100"
          const match = boxLine.match(/^-\s*(\d+)/);
          if (match) {
            boxPriceValues.push({
              value: parseInt(match[1])
            });
          }
        }
        i++;
      }
      i--;
      if (boxPriceValues.length > 0) {
        currentService.boxPrice = boxPriceValues;
      }
    } else if (line.startsWith('- **AdditionalServices**:')) {
      // Parse AdditionalServices object
      const additionalServices: any = {};
      i++;
      let currentOption: any = null;
      let currentOptionKey: string | null = null;
      
      while (i < lines.length && lines[i] && lines[i].trim().startsWith('-')) {
        const optLine = lines[i].trim();
        
        // Detectar nueva opción (ej: - addOption1:)
        if (optLine.match(/^-\s+\w+:$/)) {
          // Guardar opción anterior si existe
          if (currentOptionKey && currentOption) {
            additionalServices[currentOptionKey] = currentOption;
          }
          currentOptionKey = optLine.replace(/^-\s+/, '').replace(':', '');
          currentOption = {};
        } else if (currentOption) {
          // Leer propiedades de la opción
          if (optLine.includes('Type:')) {
            currentOption.type = optLine.split(':')[1].trim();
          } else if (optLine.includes('Value:')) {
            currentOption.value = parseInt(optLine.split(':')[1].trim());
          } else if (optLine.includes('Label:')) {
            currentOption.label = optLine.split(':')[1].trim();
          }
        }
        i++;
      }
      
      // Guardar última opción
      if (currentOptionKey && currentOption) {
        additionalServices[currentOptionKey] = currentOption;
      }
      
      i--;
      if (Object.keys(additionalServices).length > 0) {
        currentService.additionalServices = additionalServices;
      }
    } else if (line.startsWith('- **CustomPrice**:')) {
      // Parse CustomPrice object
      const customPrice: any = {
        enabled: true
      };
      i++;
      
      while (i < lines.length && lines[i] && lines[i].trim().startsWith('-')) {
        const customLine = lines[i].trim();
        
        // Si encontramos otra sección (con **), salir
        if (customLine.includes('**') && !customLine.includes('CustomPrice')) {
          i--;
          break;
        }
        
        if (customLine.includes('Label:')) {
          customPrice.label = customLine.split(':')[1].trim();
        } else if (customLine.includes('Presets:')) {
          // Siguiente línea debe contener los valores preset
          i++;
          const presetValues: number[] = [];
          while (i < lines.length && lines[i] && lines[i].trim().startsWith('-') && !lines[i].includes('**') && !lines[i].includes(':')) {
            const presetLine = lines[i].trim();
            const match = presetLine.match(/^-\s*(\d+)/);
            if (match) {
              presetValues.push(parseInt(match[1]));
            }
            i++;
          }
          i--;
          if (presetValues.length > 0) {
            customPrice.presets = presetValues;
          }
        }
        i++;
      }
      i--;
      currentService.customPrice = customPrice;
    } else if (line.startsWith('- **Selectors**:')) {
      // Parse Selectors object
      const selectors: any = {};
      i++;
      
      while (i < lines.length && lines[i]) {
        const selectorLine = lines[i].trim();
        
        // Si encontramos otra sección (con **), salir
        if (selectorLine.includes('**')) {
          break;
        }
        
        // Detectar título del selector (ej: "  - Choose number of characters:")
        if (selectorLine.startsWith('-') && selectorLine.endsWith(':') && !selectorLine.match(/:\s*\d+$/)) {
          const selectorTitle = selectorLine.replace(/^-\s+/, '').replace(/:$/, '').trim();
          const options: any[] = [];
          i++;
          
          // Leer las opciones del selector
          while (i < lines.length && lines[i]) {
            const optionLine = lines[i].trim();
            
            // Si encontramos otra sección o un nuevo selector, retroceder y salir
            if (optionLine.includes('**') || (optionLine.startsWith('-') && optionLine.endsWith(':') && !optionLine.match(/:\s*\d+$/))) {
              i--;
              break;
            }
            
            // Formato: "    - 1 Character: 0"
            const match = optionLine.match(/^-\s+(.+?):\s*(\d+)\s*$/);
            if (match) {
              options.push({
                label: match[1].trim(),
                value: parseInt(match[2])
              });
              i++;
            } else if (optionLine.trim() === '') {
              i++;
              continue;
            } else {
              break;
            }
          }
          
          if (options.length > 0) {
            selectors[selectorTitle] = options;
          }
        } else {
          i++;
        }
      }
      i--;
      
      if (Object.keys(selectors).length > 0) {
        currentService.selectors = selectors;
      }
    } else if (line.startsWith('- **Description**:')) {
      // Read description points
      i++;
      while (i < lines.length && lines[i] && lines[i].trim().startsWith('-')) {
        currentService.description?.push(lines[i].trim().substring(2));
        i++;
      }
      i--;
    }
  }
  
  // Save last service
  if (currentService.id && currentService.title && currentService.categoryId && 
      currentService.price !== undefined && currentService.image && currentService.description) {
    services.push(currentService as Service);
  }
  
  return services;
}

// Parse home info from home.md
function parseHomeInfo(): {
  title: string;
  subtitle: string;
  categories: string[];
} {
  const homePath = path.join(process.cwd(), 'src', 'content', 'home', 'home.md');
  const content = fs.readFileSync(homePath, 'utf-8');
  const lines = content.split('\n');
  
  const homeInfo = {
    title: '',
    subtitle: '',
    categories: [] as string[]
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## Main Title')) {
      i++;
      if (lines[i]) homeInfo.title = lines[i].trim();
    } else if (line.startsWith('## Subtitle')) {
      i++;
      if (lines[i]) homeInfo.subtitle = lines[i].trim();
    } else if (line.startsWith('## Featured Categories')) {
      i++;
      while (i < lines.length && lines[i]?.startsWith('-')) {
        homeInfo.categories.push(lines[i].trim().substring(2));
        i++;
      }
    }
  }

  return homeInfo;
}

// Parse games from games.md
function parseGames(): Game[] {
  const gamesPath = path.join(process.cwd(), 'src', 'content', 'games', 'games.md');
  const content = fs.readFileSync(gamesPath, 'utf-8');
  const lines = content.split('\n');
  
  const games: Game[] = [];
  let currentGame: Partial<Game> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## Game') && !line.includes('Configuration')) {
      // Save previous game if exists
      if (currentGame.id && currentGame.title && currentGame.category && currentGame.image) {
        games.push(currentGame as Game);
      }
      currentGame = {};
    } else if (line.startsWith('- **ID**:')) {
      currentGame.id = line.split(':')[1].trim();
    } else if (line.startsWith('- **Title**:')) {
      currentGame.title = line.split(':')[1].trim();
    } else if (line.startsWith('- **Category**:')) {
      currentGame.category = line.split(':')[1].trim();
    } else if (line.startsWith('- **Image**:')) {
      currentGame.image = line.split(':')[1].trim();
    }
  }

  // Save last game
  if (currentGame.id && currentGame.title && currentGame.category && currentGame.image) {
    games.push(currentGame as Game);
  }

  return games;
}

// Parse footer from footer.md
function parseFooter(): Footer {
  const footerPath = path.join(process.cwd(), 'src', 'content', 'footer', 'footer.md');
  const content = fs.readFileSync(footerPath, 'utf-8');
  const lines = content.split('\n');
  
  const footer: Footer = {
    paymentMethodsTitle: '',
    copyrightText: '',
    paymentMethods: []
  };
  
  let currentSection = '';
  let currentPaymentMethod: { name?: string; type?: 'paypal' | 'card' } = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('## Payment Methods Title')) {
      currentSection = 'title';
      i++;
      if (lines[i]) footer.paymentMethodsTitle = lines[i].trim();
    } else if (line.startsWith('## Copyright Text')) {
      currentSection = 'copyright';
      i++;
      if (lines[i]) footer.copyrightText = lines[i].trim();
    } else if (line.startsWith('## Payment Method')) {
      currentSection = 'payment-method';
      currentPaymentMethod = {};
    } else if (currentSection === 'payment-method') {
      if (line.startsWith('- **Name**:')) {
        currentPaymentMethod.name = line.split(':')[1].trim();
      } else if (line.startsWith('- **Type**:')) {
        const type = line.split(':')[1].trim() as 'paypal' | 'card';
        currentPaymentMethod.type = type;
        
        if (currentPaymentMethod.name && currentPaymentMethod.type) {
          footer.paymentMethods.push({
            name: currentPaymentMethod.name,
            type: currentPaymentMethod.type
          });
          currentPaymentMethod = {};
        }
      }
    }
  }
  
  return footer;
}

// Parse accordion from accordeon.md
function parseAccordion(): import('../types').AccordionContent {
  const accordionPath = path.join(process.cwd(), 'src', 'content', 'accordeon', 'accordeon.md');
  const content = fs.readFileSync(accordionPath, 'utf-8');
  const lines = content.split('\n');
  
  const accordion: import('../types').AccordionContent = {
    title: '',
    items: []
  };
  
  let currentItem: Partial<import('../types').AccordionItem> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('## Title')) {
      i++;
      if (lines[i]) accordion.title = lines[i].trim();
    } else if (line.startsWith('### Item')) {
      // Save previous item if exists
      if (currentItem.id && currentItem.title && currentItem.content) {
        accordion.items.push(currentItem as import('../types').AccordionItem);
      }
      currentItem = {};
    } else if (line.startsWith('- **ID**:')) {
      currentItem.id = line.split(':')[1].trim();
    } else if (line.startsWith('- **Title**:')) {
      currentItem.title = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.startsWith('- **Content**:')) {
      currentItem.content = line.substring(line.indexOf(':') + 1).trim();
    }
  }
  
  // Save last item
  if (currentItem.id && currentItem.title && currentItem.content) {
    accordion.items.push(currentItem as import('../types').AccordionItem);
  }
  
  return accordion;
}

// Get all site content
export async function getSiteContent(): Promise<SiteContent> {
  const homeInfo = parseHomeInfo();
  const games = parseGames();
  const categories = parseCategories();
  const services = parseServices();
  const footer = parseFooter();
  const homeFeatures = parseHomeFeatures();
  const accordion = parseAccordion();
  
  // Cross-reference: add services to their categories
  categories.forEach(category => {
    category.services = services.filter(service => service.categoryId === category.id);
  });
  
  return {
    home: {
      ...homeInfo,
      features: homeFeatures
    },
    games,
    categories,
    services,
    paymentMethods: [], // Ya no usamos payment methods de config.md
    footer,
    accordion
  };
}

export async function getGameById(id: string): Promise<Game | undefined> {
  const content = await getSiteContent();
  return content.games.find(game => game.id === id);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const content = await getSiteContent();
  return content.categories.find(category => category.id === id);
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const content = await getSiteContent();
  return content.services.find(service => service.id === id);
}

export async function getServicesByCategory(categoryId: string): Promise<Service[]> {
  const content = await getSiteContent();
  return content.services.filter(service => service.categoryId === categoryId);
}

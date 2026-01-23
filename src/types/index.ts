export interface Game {
  id: string;
  title: string;
  image: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  services?: Service[];
}

export interface Breakpoint {
  initValue: number;
  finalValue: number;
  step: number;
}

export interface DefaultRange {
  start: number;
  end: number;
}

export interface BarPrice {
  initValue: number;
  finalValue: number;
  step: number;
  label?: string;
  mode?: 'simple' | 'breakpoints';
  progressValue?: number;
  defaultRange?: DefaultRange;
  breakpoints?: Breakpoint[];
}

// Alias para uso en database services
export type BarPriceConfig = BarPrice;

export interface AdditionalOption {
  type: string;
  value: number;
  label: string;
}

export interface CustomPrice {
  enabled: boolean;
  label?: string;
  presets?: number[];
}

// Alias para uso en database services
export type CustomPriceConfig = CustomPrice;

export interface BoxPriceItem {
  value: number;
  label?: string;
}

export interface SelectOption {
  label: string;
  value: number;
}

export interface Selectors {
  [selectorTitle: string]: SelectOption[];
}

// Alias para uso en database services
export type SelectorConfig = Selectors;

export interface BoxTitleOption {
  label: string;
  value: string;
}

export interface ServiceTitle {
  id: string;
  title: string;
  order: number;
}

export interface ServiceComponent {
  id: string;
  type: 'bar' | 'box' | 'custom' | 'selectors' | 'additional' | 'boxtitle' | 'labeltitle';
  order: number;
  data?: any;
}

export interface Service {
  id: string;
  title: string;
  description: string[];
  service_points?: string[];
  price: number;
  image: string;
  categoryId: string;
  games?: string[]; // IDs de los juegos donde está disponible este servicio
  barPrice?: BarPrice;
  boxPrice?: BoxPriceItem[];
  additionalServices?: Record<string, AdditionalOption>;
  additionalServicesTitle?: string;
  customPrice?: CustomPrice;
  selectors?: Selectors;
  boxTitles?: BoxTitleOption[];
  serviceTitles?: ServiceTitle[];
  components?: ServiceComponent[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface Footer {
  paymentMethodsTitle: string;
  copyrightText: string;
  paymentMethods: Array<{
    name: string;
    type: 'paypal' | 'card';
  }>;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface AccordionContent {
  title: string;
  items: AccordionItem[];
}

export interface SiteContent {
  home: {
    title: string;
    subtitle: string;
    categories: string[];
    features: {
      sectionTitle: string;
      sectionDescription: string;
      items: Feature[];
    };
  };
  games: Game[];
  categories: Category[];
  services: Service[];
  paymentMethods: PaymentMethod[];
  footer: Footer;
  accordion: AccordionContent;
}

export type Region = 'EU' | 'US';

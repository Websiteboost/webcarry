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

export interface BarPrice {
  initValue: number;
  finalValue: number;
  step: number;
  label?: string;
}

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

export interface BoxPriceItem {
  value: number;
  title?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string[];
  price: number;
  image: string;
  categoryId: string;
  barPrice?: BarPrice;
  boxPrice?: BoxPriceItem[];
  additionalServices?: Record<string, AdditionalOption>;
  customPrice?: CustomPrice;
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

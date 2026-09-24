export type Language = 'ar' | 'en';

export interface Nutrient {
  name_ar: string;
  name_en: string;
  amount: string;
}

export interface FAQ {
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
}

export type ProductCategory = 'all' | 'omega3' | 'beauty' | 'vitamins' | 'women';

export interface Product {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  category: ProductCategory;
  tags: ProductCategory[];
  tagline_ar: string;
  tagline_en: string;
  badge_ar?: string;
  badge_en?: string;
  price: number;
  currency: string;
  inStock: boolean;
  packSize_ar: string;
  packSize_en: string;
  supplyDays: number;
  servingBasis_ar: string;
  servingBasis_en: string;
  shortDesc_ar: string;
  shortDesc_en: string;
  longDesc_ar: string;
  longDesc_en: string;
  benefits_ar: string[];
  benefits_en: string[];
  nutrients: Nutrient[];
  usage_ar: string;
  usage_en: string;
  warnings_ar: string[];
  warnings_en: string[];
  origin_ar: string;
  origin_en: string;
  storage_ar: string;
  storage_en: string;
  faqs: FAQ[];
  accentColor: string;
  icon: string;
  image: string;
  imageThumb: string;
  searchAliases?: string[];
  isHero?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Governorate {
  id: string;
  name_ar: string;
  name_en: string;
  shippingFee: number;
  deliveryDays_ar: string;
  deliveryDays_en: string;
}

export interface OrderData {
  name: string;
  phone: string;
  whatsappPhone: string;
  governorate: string;
  address: string;
  notes: string;
}

export interface OrderResult {
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
  shipping: number;
  total: number;
}

export type ModalType = 'product' | 'cart' | 'checkout' | 'tracking' | 'quiz' | 'restock' | null;

export const APP_NAME = 'MATHO';
export const APP_TAGLINE = 'One Live. Global Market.';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', isDefault: true },
  { code: 'ko', name: '한국어', isDefault: false },
  { code: 'zh', name: '中文', isDefault: false },
  { code: 'es', name: 'Español', isDefault: false },
  { code: 'id', name: 'Bahasa Indonesia', isDefault: false },
] as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const CURRENCY = {
  CODE: 'PI',
  DECIMALS: 6,
} as const;

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  LIVE: '/live',
  MARKETPLACE: '/marketplace',
  PRODUCT: (id: string) => `/product/${id}`,
  STORE: (id: string) => `/store/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  MERCHANT: '/merchant',
  AFFILIATE: '/affiliate',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
} as const;

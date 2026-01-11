export const ROUTES = {
  HOME: '/',
  FEED: '/feed',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  PROFILE_ORDERS: '/profile/orders',
  FEED_ORDER: '/feed/:number',
  INGREDIENT: '/ingredients/:id',
  PROFILE_ORDER: '/profile/orders/:number',
  NOT_FOUND: '*'
} as const;

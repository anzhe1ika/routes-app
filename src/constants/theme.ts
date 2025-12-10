export const colors = {
  primary: '#5e3d2b',
  primaryHover: '#4a2f21',
  secondary: '#f9f4ee',
  tertiary: '#f3ece3',
  accent: '#e5d7c5',
  border: '#c0a894',
  borderLight: '#e0d5c7',
  borderDark: '#d7c7b7',
  text: '#4b2e23',
  textMuted: '#7a6a5d',
} as const;

export const ROUTES = {
  HOME: '/',
  WIZARD: '/wizard',
  ROUTES: '/routes',
  HOTELS: '/hotels',
  HOTEL_DETAILS: '/hotels/:id',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;
export const THEME_NAMES = {
  DEFAULT: 'default',
  TOTAL_BLACK: 'total-black',
  TOTAL_WHITE: 'total-white',
} as const;

export const TOTAL_BLACK_COLORS = {
  // Cores principais
  background: '#1C1C1C',
  foreground: '#FFFFFF',
  
  // Cards e elementos de UI
  card: '#242424',
  'card-foreground': '#FFFFFF',
  
  // Cores primárias (substituindo o verde)
  primary: '#404040',
  'primary-foreground': '#FFFFFF',
  
  // Cores secundárias
  secondary: '#2A2A2A',
  'secondary-foreground': '#FFFFFF',
  
  // Bordas e divisores
  border: '#333333',
  input: '#333333',
  
  // Estados e ações
  muted: '#2A2A2A',
  'muted-foreground': '#737373',
  
  accent: '#404040',
  'accent-foreground': '#FFFFFF',
  
  // Feedback e alertas
  destructive: '#3F3F3F',
  'destructive-foreground': '#FFFFFF',
  
  ring: '#404040',
  
  // Hover states
  'primary-hover': '#4A4A4A',
  'secondary-hover': '#333333',
} as const;

export type ThemeName = keyof typeof THEME_NAMES; 
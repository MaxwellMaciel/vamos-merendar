export const THEME_NAMES = {
  DEFAULT: 'DEFAULT',
  TOTAL_BLACK: 'TOTAL_BLACK',
  TOTAL_WHITE: 'TOTAL_WHITE',
} as const;

export const DEFAULT_COLORS = {
  // Cores principais
  background: '#ffffff',
  foreground: '#1a1a1a',
  
  // Cards e elementos de UI
  card: '#ffffff',
  'card-foreground': '#1a1a1a',
  
  // Cores primárias
  primary: '#2d724a',
  'primary-foreground': '#ffffff',
  'primary-hover': '#1f5c38',
  
  // Cores secundárias
  secondary: '#F37566',
  'secondary-foreground': '#ffffff',
  'secondary-hover': '#D13B2A',
  
  // Bordas e divisores
  border: '#e5e5e5',
  input: '#e5e5e5',
  
  // Estados e ações
  muted: '#f5f5f5',
  'muted-foreground': '#737373',
  
  accent: '#f5f5f5',
  'accent-foreground': '#1a1a1a',
  
  // Feedback e alertas
  destructive: '#D13B2A',
  'destructive-foreground': '#ffffff',
  
  ring: '#2d724a',
} as const;

export const TOTAL_WHITE_COLORS = {
  // Cores principais
  background: '#FFFFFF',
  foreground: '#000000',
  
  // Cards e elementos de UI
  card: '#FFFFFF',
  'card-foreground': '#000000',
  
  // Cores primárias
  primary: '#FFFFFF',
  'primary-foreground': '#000000',
  'primary-hover': '#F5F5F5',
  
  // Cores secundárias
  secondary: '#FFFFFF',
  'secondary-foreground': '#000000',
  'secondary-hover': '#F5F5F5',
  
  // Bordas e divisores
  border: '#E0E0E0',
  input: '#E0E0E0',
  
  // Estados e ações
  muted: '#FAFAFA',
  'muted-foreground': '#555555',
  
  accent: '#FAFAFA',
  'accent-foreground': '#000000',
  
  // Feedback e alertas
  destructive: '#FFFFFF',
  'destructive-foreground': '#FF0000',
  
  ring: '#E0E0E0',
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
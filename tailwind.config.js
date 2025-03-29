/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#244b2c', // Verde escuro específico
        secondary: '#6B7280', // Cor cinza para botões secundários
        border: '#E5E7EB', // Cor cinza claro para bordas
        foreground: '#111827', // Cor escura para texto principal
        muted: '#F3F4F6', // Cor cinza claro para elementos muted
        'muted-foreground': '#6B7280', // Cor cinza para texto de placeholder
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
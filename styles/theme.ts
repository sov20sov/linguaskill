/**
 * Unified Theme Configuration
 * ثيم موحد ومنظم لجميع التأثيرات الزجاجية والألوان
 */

export const glassEffect = {
  // Glass morphism effect - تأثير زجاجي موحد
  base: 'backdrop-blur-md bg-opacity-80',
  light: 'backdrop-blur-md bg-white/10 border border-white/20',
  dark: 'backdrop-blur-md bg-black/20 border border-white/10',
  primary: 'backdrop-blur-md bg-primary/10 border border-primary/20',
  
  // Glass containers - حاويات زجاجية
  container: {
    light: 'backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl',
    dark: 'backdrop-blur-lg bg-black/30 border border-white/5 shadow-xl',
    card: 'backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10',
  },
  
  // Glass buttons - أزرار زجاجية
  button: {
    primary: 'backdrop-blur-sm bg-primary/90 hover:bg-primary border border-primary/50',
    secondary: 'backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20',
    dark: 'backdrop-blur-sm bg-black/30 hover:bg-black/40 border border-white/10',
  },
  
  // Glass nav - شريط تنقل زجاجي
  nav: {
    scrolled: 'backdrop-blur-xl bg-secondary/80 dark:bg-black/80 border-b border-white/10',
    transparent: 'backdrop-blur-md bg-transparent',
  },
  
  // Glass badges/tags - شارات زجاجية
  badge: {
    light: 'backdrop-blur-sm bg-white/20 border border-white/30',
    dark: 'backdrop-blur-sm bg-black/40 border border-white/10',
    primary: 'backdrop-blur-sm bg-primary/20 border border-primary/30',
  },
};

export const colors = {
  primary: '#D6F200',
  secondary: '#111111',
  accent: '#FFFFFF',
  darkGray: '#2B2B2B',
  lightGray: '#E5E5E5',
  
  // Enhanced contrast colors - ألوان محسنة للتباين
  text: {
    primary: '#111111',
    secondary: '#FFFFFF',
    muted: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(17, 17, 17, 0.8)',
  },
  
  // Background overlays - طبقات خلفية
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    dark: 'rgba(0, 0, 0, 0.3)',
    primary: 'rgba(214, 242, 0, 0.1)',
  },
};

export const spacing = {
  section: {
    mobile: 'py-16',
    tablet: 'sm:py-20',
    desktop: 'md:py-24',
  },
  container: {
    mobile: 'px-4',
    tablet: 'sm:px-6',
    desktop: 'lg:px-8',
  },
};

export const borderRadius = {
  sm: 'rounded-sm',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
};

export const shadows = {
  glass: 'shadow-xl shadow-black/20',
  card: 'shadow-2xl shadow-black/30',
  button: 'shadow-lg shadow-primary/20',
};

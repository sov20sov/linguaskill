import { useState, useEffect } from 'react';

/**
 * Hook to track scroll position
 * تتبع موضع التمرير
 */
export const useScroll = (threshold: number = 20) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
};

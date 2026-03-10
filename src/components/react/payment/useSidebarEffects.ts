import { useState, useEffect } from 'react';

export function useSidebarEffects(isOpen: boolean, serviceId?: string) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Scroll lock + visibility animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
      document.body.style.overflow = 'hidden';
      setImageError(false);
      setImageLoading(true);
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, serviceId]);

  // Forward aside scroll to window so the logo script responds on mobile
  useEffect(() => {
    if (!isOpen) return;
    const handleAsideScroll = (e: Event) => {
      if ((e.target as HTMLElement) && window.innerWidth < 1024) {
        window.dispatchEvent(new Event('scroll'));
      }
    };
    const aside = document.querySelector('aside');
    aside?.addEventListener('scroll', handleAsideScroll);
    return () => aside?.removeEventListener('scroll', handleAsideScroll);
  }, [isOpen]);

  return { isVisible, imageError, setImageError, imageLoading, setImageLoading };
}

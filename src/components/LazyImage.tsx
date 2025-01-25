import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;  // URL des Bildes
  alt: string;  // Alt-Text für das Bild
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // Bild wird sichtbar
          observer.disconnect(); // Stoppt das Beobachten des Bildes
        }
      },
      { threshold: 0.1 } // Bild muss zu 10% im Viewport sichtbar sein
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect(); // Aufräumen beim Verlassen der Komponente
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : ''}  // Bild wird nur geladen, wenn es sichtbar wird
      alt={alt}
      style={{
        width: '100%',
        height: 'auto',
        opacity: isVisible ? 1 : 0.5, // Opazität bei Lazy Load
      }}
    />
  );
};

export default LazyImage;

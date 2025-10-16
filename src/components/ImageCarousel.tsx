'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

export default function ImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-r-none" ref={emblaRef}>
      <div className="flex">
        {images.map((image, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-48 lg:h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      
      {images.length > 1 && (
        <>
          <button 
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
            aria-label="Image précédente"
          >
            &larr;
          </button>
          <button 
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
            aria-label="Image suivante"
          >
            &rarr;
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  emblaApi?.selectedScrollSnap() === index ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

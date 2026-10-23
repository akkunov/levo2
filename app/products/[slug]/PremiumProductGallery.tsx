'use client';

import { useCallback, useState } from 'react';
import type { TouchEvent } from 'react';
import { ArrowLeft, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import type { StoreProduct } from '@/lib/api/products';
import { AddToCart } from '@/components/storefront';

type PremiumProductGalleryProps = {
    images: string[];
    name: string;
    product: StoreProduct;
    priceLabel: string;
};

export default function PremiumProductGallery({
    images,
    name,
    product,
    priceLabel,
}: PremiumProductGalleryProps) {
    const slides = images.length ? images : ['/images/product-placeholder.png'];
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const goTo = useCallback((index: number) => {
        setActiveIndex((index + slides.length) % slides.length);
    }, [slides.length]);

    const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        setTouchStart(event.changedTouches[0]?.clientX ?? null);
    };

    const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        if (touchStart === null) return;
        const touchEnd = event.changedTouches[0]?.clientX;
        if (touchEnd === undefined) return;
        const distance = touchStart - touchEnd;
        if (Math.abs(distance) > 45) goTo(activeIndex + (distance > 0 ? 1 : -1));
        setTouchStart(null);
    };

    return (
        <div className="premium-gallery">
            <div
                className="premium-gallery-main"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                aria-roledescription="карусель изображений товара"
                aria-label={`Фотографии товара ${name}`}
            >
                <Image
                    key={slides[activeIndex]}
                    src={slides[activeIndex]}
                    alt={`${name} — фото ${activeIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 640px"
                    priority={activeIndex === 0}
                    draggable={false}
                    unoptimized
                    style={{ objectFit: 'contain' }}
                />

                <span className="premium-gallery-counter">
                    {String(activeIndex + 1).padStart(2, '0')} <span>/</span> {String(slides.length).padStart(2, '0')}
                </span>
                <span className="premium-gallery-brand">LEVO / PRODUCT VIEW</span>

                {slides.length > 1 && (
                    <div className="premium-gallery-controls">
                        <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Предыдущее фото">
                            <ArrowLeft size={17} strokeWidth={1.5} />
                        </button>
                        <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Следующее фото">
                            <ArrowRight size={17} strokeWidth={1.5} />
                        </button>
                    </div>
                )}

                {slides.length > 1 && (
                    <div className="premium-gallery-progress" aria-hidden="true">
                        {slides.map((_, index) => (
                            <span key={`${index}-${slides[index]}`} className={index === activeIndex ? 'is-active' : ''} />
                        ))}
                    </div>
                )}
            </div>

            {slides.length > 1 ? (
                <div className="premium-gallery-thumbnails" aria-label="Выбрать фотографию">
                    {slides.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            className={`premium-thumbnail ${index === activeIndex ? 'is-active' : ''}`}
                            onClick={() => goTo(index)}
                            aria-label={`Показать фото ${index + 1}`}
                            aria-pressed={index === activeIndex}
                        >
                            <Image 
                                src={image} 
                                alt="" fill 
                                sizes="96px" 
                                loading="lazy" 
                                style={{ objectFit: "contain" }}
                                unoptimized
                                />
                        </button>
                    ))}
                </div>
            ) : (
                <div className="premium-gallery-single-note"><ImageIcon size={13} strokeWidth={1.5} /> ФОТОГРАФИЯ ТОВАРА</div>
            )}

            <div className="premium-gallery-purchase">
                <div className="premium-gallery-divider" aria-hidden="true" />
                <div className="premium-gallery-purchase-row">
                    <div className="premium-gallery-purchase-copy">
                        <span>ВАШ ВЫБОР LEVO</span>
                        <strong>{priceLabel}</strong>
                    </div>
                    <div className="premium-gallery-purchase-button">
                        <AddToCart product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}

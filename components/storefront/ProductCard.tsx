'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import type { StoreProduct } from '@/lib/api/products';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
    product: StoreProduct;
    activePosterId: number | null;
    onActivate: (id: number) => void;
}

export function ProductCard({
    product,
    activePosterId,
    onActivate,
}: ProductCardProps) {
    // Do not mount an alternative product photo until the visitor requests it.
    const [posterRequested, setPosterRequested] = useState(false);
    const [loadedPosterUrl, setLoadedPosterUrl] = useState<string | null>(null);
    const showPoster = activePosterId === product.id;
    const mainImage = product.images?.[0]?.url || product.image;
    const posterImage = product.image;

    const hasPoster =
        Boolean(mainImage) &&
        Boolean(posterImage) &&
        mainImage !== posterImage;

    const posterReady = hasPoster && loadedPosterUrl === posterImage;

    const requestPoster = () => {
        if (hasPoster) setPosterRequested(true);
    };

    const handleTouchStart = () => {
        if (!hasPoster) return;
        requestPoster();
        onActivate(product.id);
    };

    const content = (

        <article
            className={`product-card${posterReady ? ' has-poster-image' : ''}${showPoster ? ' is-poster-visible' : ''}`}
        >
            <div className="product-image">
                {mainImage && (
                    <Image
                        src={mainImage}
                        alt={
                            product.images?.[0]?.alt ||
                            product.name
                        }
                        fill
                        sizes="(max-width: 700px) calc(50vw - 16px), (max-width: 1440px) 33vw, 460px"
                        className="product-image-main"
                    />
                )}
                {hasPoster && posterRequested && (
                    <Image
                        src={posterImage}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="(max-width: 700px) calc(50vw - 16px), (max-width: 1440px) 33vw, 460px"
                        quality={60}
                        loading="eager"
                        onLoad={() => setLoadedPosterUrl(posterImage)}
                        className="product-image-poster"
                        style={{objectFit: 'cover'}}
                    />
                )}
                {product.tag && (
                    <span className="product-tag">
                        {product.tag}
                    </span>
                )}
                <span className="product-arrow">
                    <ArrowDownRight size={18} />
                </span>
            </div>
            <div className="product-meta">
                <span>{product.category}</span>
                <span>{product.id}</span>
            </div>
            <span className="product-title">
                {product.name}
            </span>
            <div className="price-line">
                <strong>{formatPrice(product.price)}</strong>
                {product.oldPrice != null && (
                    <del>{formatPrice(product.oldPrice)}</del>
                )}
            </div>
        </article>
    );
    if (!product.slug) {
        return (
            <div onMouseEnter={requestPoster} onFocus={requestPoster} onTouchStart={handleTouchStart}>
                {content}
            </div>
        );
    }
    return (
        <Link
            href={`/products/${product.slug}`}
            className="product-card-link"
            onMouseEnter={requestPoster}
            onFocus={requestPoster}
            onTouchStart={handleTouchStart}
        >
            {content}
        </Link>

    );

}

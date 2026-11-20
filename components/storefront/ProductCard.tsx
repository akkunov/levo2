'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDownRight } from 'lucide-react';
import type { StoreProduct } from '@/lib/api/products';
import { formatPrice } from '@/lib/format';
import { bypassVercelImageOptimizer } from '@/lib/images';

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
    const showPoster = activePosterId === product.id;
    const mainImage = product.images?.[0]?.url || product.image;
    const posterImage = product.image;

    const hasPoster =
        Boolean(mainImage) &&
        Boolean(posterImage) &&
        mainImage !== posterImage;

    const handleTouchStart = () => {
        if (hasPoster) onActivate(product.id);
    };

    const content = (

        <article
            className={`product-card${showPoster ? ' is-poster-visible' : ''}`}
        >
            <div className="product-image">
                {mainImage && (
                    <Image
                        src={mainImage}
                        unoptimized={bypassVercelImageOptimizer(mainImage)}
                        alt={
                            product.images?.[0]?.alt ||
                            product.name
                        }
                        fill
                        sizes="(max-width: 700px) calc(50vw - 16px), (max-width: 1440px) 33vw, 460px"
                        className="product-image-main"
                    />
                )}
                {hasPoster && (
                    <Image
                        src={posterImage}
                        unoptimized={bypassVercelImageOptimizer(posterImage)}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="(max-width: 700px) calc(50vw - 16px), (max-width: 1440px) 33vw, 460px"
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
            <div onTouchStart={handleTouchStart}>
                {content}
            </div>
        );
    }
    return (
        <Link
            href={`/products/${product.slug}`}
            className="product-card-link"
            onTouchStart={handleTouchStart}
        >
            {content}
        </Link>

    );

}

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/format';

type ProductHeroProps = {
    title: string;
    categoryName: string;
    subtitle?: string | null;
    image: string;
    price: number | null;
    oldPrice?: number | null;
};

export default function ProductHero({
    title,
    categoryName,
    subtitle,
    image,
    price,
    oldPrice,
}: ProductHeroProps) {
    return (
            <section className="product-hero" aria-labelledby="product-hero-title">
                <Image
                    className="product-hero-image"
                    src={image}
                    alt=""
                    fill
                    sizes="100vw"
                    fetchPriority="high"
                    aria-hidden="true"
                    priority
                />
                <div className="product-hero-shade" aria-hidden="true" />
                <div className="product-hero-content">
                    <div className="product-hero-kicker">
                        <span className="product-hero-kicker-line" />
                        <span>{categoryName}</span>
                    </div>
                    <h1 id="product-hero-title">{title}</h1>
                    {subtitle && (
                        <p className="product-hero-subtitle">{subtitle}</p>
                    )}
                </div>

                <div className="product-hero-bottom">
                    <a className="product-hero-scroll" href="#product-details">
                        <span className="product-hero-scroll-label">ЛИСТАЙТЕ, ЧТОБЫ УЗНАТЬ БОЛЬШЕ</span>
                        <span className="product-hero-scroll-line" aria-hidden="true" />
                    </a>

                    <div className="product-hero-purchase">
                        <div className="product-hero-price-block">
                            <div className="product-hero-price-line">
                                <strong>{formatPrice(price)}</strong>
                                {oldPrice != null && <del>{formatPrice(oldPrice)}</del>}
                            </div>
                            <span className="product-hero-price-note">Цена в кыргызских сомах</span>
                        </div>
                        <div className="product-hero-actions">
                            <a className="product-hero-details-link" href="#product-details" aria-label="Перейти к выбору товара">
                                Выбрать товар <ArrowUpRight size={16} strokeWidth={1.6} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
    );
}

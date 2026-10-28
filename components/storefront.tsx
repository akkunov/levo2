'use client';
import Link from 'next/link';
import {useState} from 'react';
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Check, ChevronDown,
    Sparkles
} from 'lucide-react';
import { useCatalogs } from '@/hooks/use-catalogs';
import Image from "next/image";
import {StoreProduct} from "@/lib/api/products";
import { useFeaturedProducts } from '@/hooks/use-featured-products';
import {useNewArrivals} from "@/hooks/use-new-arrivals";
import { formatPrice } from '@/lib/format';
import { useCart } from '@/components/cart/cart-context';


type ProductSpecificationsProps = {
    specs: string[];
};

export function ProductSpecifications({
                                                  specs,
                                              }: ProductSpecificationsProps) {
    const [expanded, setExpanded] = useState(false);

    const visibleSpecs = expanded ? specs : specs.slice(0, 6);
    const hasMore = specs.length > 6;

    return (
        <div className="premium-specifications-content">
            <div className="premium-specifications-heading">
                <h3>Характеристики</h3>
                <span>{specs.length} параметров</span>
            </div>

            {specs.length > 0 ? (
                <>
                    <div className="premium-spec-list">
                        {visibleSpecs.map((spec, index) => (
                            <div
                                className="premium-spec-row"
                                key={`${spec}-${index}`}
                            >
                                <span>{spec}</span>
                                <Check size={17} strokeWidth={1.5} />
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <button
                            type="button"
                            className="premium-spec-toggle"
                            onClick={() => setExpanded((current) => !current)}
                            aria-expanded={expanded}
                        >
                            {expanded ? 'Скрыть' : 'Посмотреть все характеристики'}
                            <ChevronDown
                                size={17}
                                className={expanded ? 'is-rotated' : ''}
                            />
                        </button>
                    )}
                </>
            ) : (
                <p className="premium-empty-specs">
                    Характеристики уточняются. Свяжитесь с нами, чтобы узнать
                    подробности о модели.
                </p>
            )}
        </div>
    );
}

interface ProductCardProps {
    product: StoreProduct;
    index?: number;
    activePosterId: number | null;
    onActivate: (id: number) => void;
}

export function ProductCard({
    product,
    index = 0,
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
    if (hasPoster) {
        onActivate?.(product.id);
    }
};

    const content = (

        <article
            className={`product-card${
                showPoster ? ' is-poster-visible' : ''
            }`}
            style={{
                animationDelay: `${index * 70}ms`,
            }}
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
                        unoptimized
                        sizes="(max-width: 700px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="product-image-main"
                    />

                )}
                {hasPoster && (
                    <Image
                        src={posterImage}
                        alt=""
                        aria-hidden="true"
                        fill
                        unoptimized
                        sizes="(max-width: 700px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="product-image-poster"
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
export function CatalogProductSections() {
    const {
        data: newArrivals = [],
        isPending: newPending,
        isError: newError,
    } = useNewArrivals();

    const {
        data: featuredProducts = [],
        isPending: featuredPending,
        isError: featuredError,
    } = useFeaturedProducts();

    const newIds = new Set(newArrivals.map((product) => product.id));

    const popularProducts = featuredProducts.filter(
        (product) => !newIds.has(product.id),
    );

    return (
        <>
            <section className="new-arrivals">
                <div className="section-heading-row">
                    <div>
            <span className="eyebrow">
              <Sparkles size={15} /> СВЕЖИЕ ПОСТУПЛЕНИЯ
            </span>
                        <h2>Новинки</h2>
                        <p className="new-arrivals-description">
                            Новые модели техники для вашего дома.
                        </p>
                    </div>

                    <Link href="/catalogs/new" className="text-link">
                        Все новинки <ArrowRight size={17} />
                    </Link>
                </div>

                {newPending ? (
                    <p>Загружаем новинки...</p>
                ) : newError ? (
                    <p>Не удалось загрузить новинки.</p>
                ) : (
                    <ProductGrid items={newArrivals} />
                )}
            </section>

            <section className="catalog-products">
                <div className="section-heading-row">
                    <h2>Популярное</h2>
                    <span>Подборка LEVO</span>
                </div>

                {featuredPending ? (
                    <p>Загружаем товары...</p>
                ) : featuredError ? (
                    <p>Не удалось загрузить товары.</p>
                ) : (
                    <ProductGrid items={popularProducts} />
                )}
            </section>
        </>
    );
}

export function ProductGrid({items,}: { items?: StoreProduct[]; }) {
    const [activePosterId, setActivePosterId] = useState<number | null>(null);
    const {
        data: featuredProducts = [],
        isPending,
        isError,
    } = useFeaturedProducts(items === undefined);

    const productsToShow = items ?? featuredProducts;

    if (!items && isPending) return <p>Загрузка товаров...</p>;
    if (!items && isError) return <p>Не удалось загрузить товары. Попробуйте позже.</p>;
    if (productsToShow.length === 0) return <p>Пока нет товаров для отображения.</p>;

    return (
        <div className="product-grid">
            {productsToShow.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    activePosterId={activePosterId}
                    onActivate={setActivePosterId}
                />
            ))}
        </div>
    );
}
export function CatalogSummary() {
    const { data: catalogs = [] } = useCatalogs();
    const { data: products = [] } = useFeaturedProducts();

    const parentCategories = catalogs.length

    return (
        <div className="catalog-summary">
            <span>{parentCategories} категорий</span>
            <span>{products.length} популярных товаров</span>
        </div>
    );
}

export function CategoryTiles() {
    const {
        data: categories = [],
        isPending,
        isError,
    } = useCatalogs();

    if (isPending) {
        return <p>Загрузка категорий...</p>;
    }

    if (isError) {
        return <p>Не удалось загрузить категории.</p>;
    }

    const parentCategories = categories.filter(
        (category) => category.parentId == null,
    );

    if (parentCategories.length === 0) {
        return <p>Категории пока не добавлены.</p>;
    }

    return (
        <section className="category-showcase">
            <div className="category-showcase-heading">
                <div>
                    <span className="eyebrow">КОЛЛЕКЦИИ LEVO</span>
                    <h2>
                        Техника для
                        <br />
                        <em>вашего пространства.</em>
                    </h2>
                </div>
                <p>
                    Продуманные решения для кухни,
                    <br className="desktop-break" />
                    дома и повседневной жизни.
                </p>
            </div>
            <div className="category-grid category-grid--editorial">
                {parentCategories.map((category, index) => (
                    <Link
                        key={category.id}
                        href={`/catalogs/${category.slug}`}
                        className={`category-card ${
                            index === 0 ? 'category-card--featured' : ''
                        }`}
                    >
                        <div className="category-card-image">
                            <Image
                                src={
                                    category.image ??
                                    '/images/catalog-placeholder.jpg'
                                }
                                alt={category.name}
                                fill
                                sizes={
                                    index === 0
                                        ? '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 58vw'
                                        : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw'
                                }
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="category-card-overlay" />
                        <div className="category-card-top">
              <span className="category-card-index">
                COLLECTION / {String(index + 1).padStart(2, '0')}
              </span>

                            <span className="category-card-count">
                {category.count} моделей
              </span>
                        </div>
                        <div className="category-card-bottom">
                            <div className="category-card-copy">
                                <h3>{category.name}</h3>

                                {category.description && (
                                    <p>{category.description}</p>
                                )}
                            </div>

                            <span className="category-card-arrow">
                <ArrowUpRight size={22} strokeWidth={1.6} />
              </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default function NewArrivals() {
    const {
        data: products = [],
        isPending,
        isError,
    } = useFeaturedProducts();

    return (
        <section className="new-arrivals">
            <div className="section-heading-row">
                <div>
          <span className="eyebrow">
            <Sparkles size={15} /> СВЕЖИЕ ПОСТУПЛЕНИЯ
          </span>

                    <h2>Новинки</h2>

                    <p className="new-arrivals-description">
                        Новые модели техники для вашего дома.
                    </p>
                </div>

                <Link href="/catalogs/new" className="text-link">
                    Все новинки <ArrowRight size={17} />
                </Link>
            </div>

            {isPending ? (
                <p>Загружаем новинки...</p>
            ) : isError ? (
                <p>Не удалось загрузить новинки. Попробуйте позже.</p>
            ) : products.length > 0 ? (
                <ProductGrid items={products.slice(0, 4)} />
            ) : (
                <p>Скоро здесь появятся новинки.</p>
            )}
        </section>
    );
}

export function AddToCart({product}: { product: StoreProduct }) {
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();
    return (
        <button
            type="button"
            className={`button button-dark add-cart ${added ? 'is-added' : ''}`}
            onClick={() => {
                addToCart(product);
                setAdded(true);
            }}
        >
            {added ? <><Check size={17} /> Добавлено в корзину</> : <>Добавить в корзину <ArrowRight size={17} /></>}
        </button>
    );
}
export function Breadcrumbs({items}: { items: { label: string; href?: string }[] }) {
    return (
        <div className="breadcrumbs">
            <Link href="/">Главная</Link>
            {items.map((item, i) => (
                <span key={i}>
                    <span className="crumb-sep">/</span>
                    {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
                </span>
            ))}
        </div>
    );
}
export function EditorialBanner() {
    return (
        <section className="editorial-banner">
            <Image src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=90" alt="Современный минималистичный интерьер" fill sizes="(max-width: 768px) 100vw, 100vw" loading="lazy" style={{ objectFit: "cover" }} />
            <div className="editorial-overlay" />
            <div className="editorial-content">
                <span className="eyebrow light">LEVO / DESIGN NOTES 01</span>
                <h2>
                    Технологии,<br />
                    которые не<br />
                    <em>перетягивают</em><br />
                    внимание.
                </h2>
                <Link className="text-link light-link" href="/catalogs/built-in-appliances">Открыть коллекцию <ArrowRight size={17} /></Link>
            </div>
        </section>
    );
}

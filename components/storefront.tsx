'use client';
import Link from 'next/link';
import {useState} from 'react';
import {ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Sparkles} from 'lucide-react';
import { useCatalogs } from '@/hooks/use-catalogs';
import Image from "next/image";
import {StoreProduct} from "@/lib/api/products";
import { useFeaturedProducts } from '@/hooks/use-featured-products';
import {useNewArrivals} from "@/hooks/use-new-arrivals";



function formatPrice(price: number) {
    return new Intl.NumberFormat('ru-KG', {
        style: 'currency',
        currency: 'KGS',
        maximumFractionDigits: 0,
    }).format(price);
}
type ProductGalleryProps = {
    images: string[];
    name: string;
};

export function ProductGallery({
                                           images,
                                           name,
                                       }: ProductGalleryProps) {
    const gallery = images.filter(Boolean);
    const [activeIndex, setActiveIndex] = useState(0);

    if (gallery.length === 0) {
        return (
            <div className="premium-gallery premium-gallery--empty">
                <span>LEVO</span>
                <p>Изображение скоро появится</p>
            </div>
        );
    }

    const previous = () => {
        setActiveIndex((current) =>
            current === 0 ? gallery.length - 1 : current - 1,
        );
    };

    const next = () => {
        setActiveIndex((current) =>
            current === gallery.length - 1 ? 0 : current + 1,
        );
    };

    return (
        <div className="premium-gallery">
            <div className="premium-gallery-main">
                <img
                    key={gallery[activeIndex]}
                    src={gallery[activeIndex]}
                    alt={`${name} — изображение ${activeIndex + 1}`}
                />

                <span className="premium-gallery-counter">
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(gallery.length).padStart(2, '0')}
        </span>

                {gallery.length > 1 && (
                    <div className="premium-gallery-controls">
                        <button
                            type="button"
                            onClick={previous}
                            aria-label="Предыдущее изображение"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={next}
                            aria-label="Следующее изображение"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                <span className="premium-gallery-brand">LEVO / OBJECTS FOR LIVING</span>
            </div>

            {gallery.length > 1 && (
                <div className="premium-gallery-thumbnails">
                    {gallery.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            className={
                                activeIndex === index
                                    ? 'premium-thumbnail is-active'
                                    : 'premium-thumbnail'
                            }
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Показать изображение ${index + 1}`}
                            aria-pressed={activeIndex === index}
                        >
                            <img src={image} alt="" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function ProductCard({product, index = 0,}: { product: StoreProduct; index?: number; }) {

    const content = (
        <>
            <article
                className="product-card"
                style={{ animationDelay: `${index * 70}ms` }}
            >
                <div className="product-image">
                    <img src={product.image} alt={product.name} />

                    {product.tag && (
                        <span className="product-tag">{product.tag}</span>
                    )}

                    <span className="product-arrow">
            <ArrowDownRight size={18} />
          </span>
                </div>

                <div className="product-meta">
                    <span>{product.category}</span>
                    <span>{product.id}</span>
                </div>

                <span className="product-title">{product.name}</span>

                <div className="price-line">
                    <strong>{formatPrice(product.price)}</strong>
                    {product.oldPrice != null && (
                        <del>{formatPrice(product.oldPrice)}</del>
                    )}
                </div>
            </article>
        </>
    );

    return product.slug ? (
        <Link
            href={`/products/${product.slug}`}
            className="product-card-link"
        >
            {content}
        </Link>
    ) : (
        content
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
    const {
        data: featuredProducts = [],
        isPending,
        isError,
    } = useFeaturedProducts(items === undefined);

    const productsToShow = items ?? featuredProducts;

    if (!items && isPending) {
        return <p>Загрузка товаров...</p>;
    }

    if (!items && isError) {
        return <p>Не удалось загрузить товары. Попробуйте позже.</p>;
    }

    if (productsToShow.length === 0) {
        return <p>Пока нет товаров для отображения.</p>;
    }

    return (
        <div className="product-grid">
            {productsToShow.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                />
            ))}
        </div>
    );
}
export function CatalogSummary() {
    const { data: catalogs = [] } = useCatalogs();
    const { data: products = [] } = useFeaturedProducts();

    const parentCategories = catalogs.filter(
        (category) =>
            category.slug === 'built-in-appliances' &&
            category.parentId == null,
    );

    return (
        <div className="catalog-summary">
            <span>{parentCategories.length} категорий</span>
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
    return (
        <button className={`button button-dark add-cart ${added ? 'is-added' : ''}`} onClick={() => setAdded(true)}>
            {added ? <><Check size={17} /> Добавлено в список</> : <>Добавить в корзину <ArrowRight size={17} /></>}
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
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=90" alt="Современный минималистичный интерьер" />
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

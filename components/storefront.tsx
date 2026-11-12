'use client';
import Link from 'next/link';
import {useState} from 'react';
import {
    ArrowRight,
    ArrowUpRight,
    Check,
    Sparkles
} from 'lucide-react';
import { useCatalogs } from '@/hooks/use-catalogs';
import Image from "next/image";
import {StoreProduct} from "@/lib/api/products";
import { useFeaturedProducts } from '@/hooks/use-featured-products';
import {useNewArrivals} from "@/hooks/use-new-arrivals";
import { useCart } from '@/components/cart/cart-context';
import { GridSkeleton } from '@/components/ui/CatalogSkeleton';
import { ProductCard } from '@/components/storefront/ProductCard';


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
                    <GridSkeleton count={4} variant="product" />
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
                    <GridSkeleton count={8} variant="product" />
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
        return (
            <section
                className="category-showcase"
                role="status"
                aria-label="Загрузка категорий"
            >
                <div className="category-showcase-heading">
                    <div>
          <span className="eyebrow">
            КОЛЛЕКЦИИ LEVO
          </span>
                        <h2>
                            Техника для
                            <br />
                            <em>вашего пространства.</em>
                        </h2>
                    </div>
                </div>

                <GridSkeleton
                    count={6}
                    variant="category"
                />
            </section>
        );
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
                                    '/noPoster.jpg'
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

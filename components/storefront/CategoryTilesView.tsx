import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { CatalogWithCount } from '@/types/catalog';

// Shared SEO-friendly markup. Usable by Server Components without shipping a
// React Query hook or an unnecessary client boundary to the homepage.
export function CategoryTilesView({ categories }: { categories: CatalogWithCount[] }) {
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
                                quality={65}
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

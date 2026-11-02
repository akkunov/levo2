
import './catalog-skeleton.css';


interface GridSkeletonProps {
    count?: number;
    variant?: 'product' | 'category';
}

export function GridSkeleton({
                                 count = 8,
                                 variant = 'product',
                             }: GridSkeletonProps) {
    if (variant === 'category') {
        return (
            <div
                className="category-grid category-grid--editorial"
                aria-hidden="true"
            >
                {Array.from({ length: count }, (_, index) => (
                    <div
                        key={index}
                        className={`category-card levo-category-skeleton ${
                            index === 0 ? 'category-card--featured' : ''
                        }`}
                    >
                        <div className="levo-category-skeleton__top">
                            <div className="levo-skeleton skeleton-index" />
                            <div className="levo-skeleton skeleton-count" />
                        </div>

                        <div className="levo-category-skeleton__bottom">
                            <div className="levo-skeleton skeleton-title" />
                            <div className="levo-skeleton skeleton-description" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="product-grid" aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="levo-product-skeleton">
                    <div className="levo-skeleton levo-product-skeleton__image" />

                    <div className="levo-product-skeleton__info">
                        <div className="levo-skeleton skeleton-category" />
                        <div className="levo-skeleton skeleton-product-title" />
                        <div className="levo-skeleton skeleton-price" />
                    </div>
                </div>
            ))}
        </div>
    );
}


export function CategoryHeroSkeleton() {
    return (
        <section
            className="category-hero levo-skeleton-hero"
            aria-hidden="true"
        >
            <div className="levo-skeleton-hero__content">
                <div className="levo-skeleton levo-skeleton-hero__eyebrow" />
                <div className="levo-skeleton levo-skeleton-hero__title" />
                <div className="levo-skeleton levo-skeleton-hero__title short" />
                <div className="levo-skeleton levo-skeleton-hero__description" />
                <div className="levo-skeleton levo-skeleton-hero__count" />
            </div>
        </section>
    );
}

export function CategoryPageSkeleton() {
    return (
        <main
            className="page-shell levo-category-loading"
            role="status"
            aria-label="Загрузка категории"
            aria-busy="true"
        >
            <div className="levo-skeleton levo-skeleton-breadcrumb" />

            <CategoryHeroSkeleton />

            <div className="levo-skeleton-section-heading">
                <div className="levo-skeleton levo-skeleton-section-title" />
                <div className="levo-skeleton levo-skeleton-section-caption" />
            </div>

            <GridSkeleton count={8} variant="product" />

            <span className="sr-only">
        Загружаем категорию и товары
      </span>
        </main>
    );
}

import { GridSkeleton } from '@/components/ui/CatalogSkeleton';

export default function CatalogLoading() {
    return (
        <div
            className="page-shell levo-catalog-loading"
            role="status"
            aria-label="Загрузка каталога"
        >
            <div className="levo-skeleton levo-skeleton-breadcrumb" />

            <section className="category-showcase">
                <div className="category-showcase-heading">
                    <h2>Техника для вашего пространства.</h2>
                </div>

                <GridSkeleton count={6} variant="category" />
            </section>

            <section className="catalog-products">
                <h2>Популярные товары</h2>
                <GridSkeleton count={8} variant="product" />
            </section>
        </div>
    );
}
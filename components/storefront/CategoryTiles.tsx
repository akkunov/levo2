'use client';

import { useCatalogs } from '@/hooks/use-catalogs';
import { GridSkeleton } from '@/components/ui/CatalogSkeleton';
import { CategoryTilesView } from './CategoryTilesView';

export function CategoryTiles() {
    const { data: categories = [], isPending, isError } = useCatalogs();

    if (isPending) {
        return (
            <section
                className="category-showcase"
                role="status"
                aria-label="Загрузка категорий"
            >
                <div className="category-showcase-heading">
                    <div>
                        <span className="eyebrow">КОЛЛЕКЦИИ LEVO</span>
                        <h2>Техника для<br /><em>вашего пространства.</em></h2>
                    </div>
                </div>
                <GridSkeleton count={6} variant="category" />
            </section>
        );
    }

    if (isError) return <p>Не удалось загрузить категории.</p>;

    return <CategoryTilesView categories={categories} />;
}

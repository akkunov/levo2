
import type { Metadata } from 'next';
import CategoryPageClient from './CategoryPageClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CatalogMetadata {
    name: string;
    description?: string | null;
}

async function getCategory(
    slug: string,
): Promise<CatalogMetadata | null> {
    if (!API_URL) return null;

    try {
        const response = await fetch(
            `${API_URL}/catalogs/${encodeURIComponent(slug)}`,
            { next: { revalidate: 300 } },
        );

        if (!response.ok) return null;

        return response.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);

    const title = category?.name ?? 'Категория бытовой техники';
    const description = category?.description?.trim() ||
        `Выберите бытовую технику ${title.toLocaleLowerCase('ru-RU')} в каталоге LEVO Кыргызстан.`;

    return {
        title,
        description,
        alternates: { canonical: `/catalogs/${encodeURIComponent(slug)}` },
        openGraph: {
            type: 'website',
            title,
            description,
            url: `/catalogs/${encodeURIComponent(slug)}`,
        },
    };
}

export default async function CategoryPage({
                                               params,
                                           }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return <CategoryPageClient slug={slug} />;
}

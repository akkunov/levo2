
'use client';

import { useEffect, useMemo, useState } from 'react';
import {useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    createProduct,
    updateProduct,
    fetchAdminProductById,
    type CreateProductDto,
    type UpdateProductDto,
} from '@/lib/api/admin-products';
import {
    uploadProductPoster,
    uploadProductImages,
} from '@/lib/api/admin-product-images';
import { useCatalogs } from '@/hooks/use-catalogs';
import type { ApiProduct } from '@/lib/api/products';
import ProductImageEditor from "@/components/admin/product-image-editor";

interface ProductFormProps {
    productId?: number;
}

function makeSlug(value: string) {
    const transliteration: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e',
        ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
        н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
        ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
        ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
    };

    return value
        .toLowerCase()
        .split('')
        .map((char) => transliteration[char] ?? char)
        .join('')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Не удалось сохранить товар';
}

export default function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const isEditing = typeof productId === 'number';

    const catalogsQuery = useCatalogs();

    const productQuery = useQuery({
        queryKey: ['admin', 'product', productId],
        queryFn: () => fetchAdminProductById(productId!),
        enabled: isEditing,
    });

    const product = productQuery.data;

    const [title, setTitle] = useState('');
    const [sku, setSku] = useState('');
    const [slug, setSlug] = useState('');
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [catalogId, setCatalogId] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [tag, setTag] = useState('');
    const [warranty, setWarranty] = useState('');
    const [description, setDescription] = useState('');
    const [specsText, setSpecsText] = useState('');
    const [poster, setPoster] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!product) return;

        setTitle(product.title ?? '');
        setSku(product.sku ?? '');
        setSlug(product.slug ?? '');
        setPrice(product.price == null ? '' : String(product.price));
        setOldPrice(product.oldPrice == null ? '' : String(product.oldPrice));
        setCatalogId(
            product.catalogId != null
                ? String(product.catalogId)
                : '',
        );
        setSubtitle(product.subtitle ?? '');
        setTag(product.tag ?? '');
        setWarranty(product.warranty ?? '');
        setDescription(product.description ?? '');
        setSpecsText((product.specs ?? []).join('\n'));
        setSlugManuallyEdited(true);
    }, [product]);

    const catalogs = catalogsQuery.data ?? [];

    const catalogOptions = useMemo(() => {
        const byId = new Map(catalogs.map((item) => [item.id, item]));

        return [...catalogs].sort((a, b) => {
            const aParent = a.parentId ?? 0;
            const bParent = b.parentId ?? 0;

            if (aParent !== bParent) return aParent - bParent;
            return a.name.localeCompare(b.name, 'ru');
        }).map((item) => {
            const parent = item.parentId ? byId.get(item.parentId) : undefined;

            return {
                id: item.id,
                label: parent ? `${parent.name} / ${item.name}` : item.name,
            };
        });
    }, [catalogs]);

    const saveMutation = useMutation({
        mutationFn: async (dto: CreateProductDto | UpdateProductDto) => {
            let savedProduct: ApiProduct;

            if (isEditing) {
                savedProduct = await updateProduct(
                    productId!,
                    dto as UpdateProductDto,
                );
            } else {
                savedProduct = await createProduct(dto as CreateProductDto);
            }

            if (poster) {
                await uploadProductPoster(savedProduct.id, poster);
            }

            if (galleryFiles.length > 0) {
                await uploadProductImages(savedProduct.id, galleryFiles);
            }

            return savedProduct;
        },
        onSuccess: async (savedProduct) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
                queryClient.invalidateQueries({ queryKey: ['admin', 'product'] }),
                queryClient.invalidateQueries({ queryKey: ['products'] }),
                queryClient.invalidateQueries({ queryKey: ['featured-products'] }),
                queryClient.invalidateQueries({ queryKey: ['new-arrivals'] }),
                queryClient.invalidateQueries({ queryKey: ['catalog-products'] }),
            ]);

            router.push(`/admin/products/${savedProduct.id}`);
            router.refresh();
        },
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Укажите название товара');
            return;
        }

        if (!catalogId) {
            setError('Выберите категорию товара');
            return;
        }

        if (price.trim() && (!Number.isFinite(Number(price)) || Number(price) < 0)) {
            setError('Укажите корректную цену');
            return;
        }

        if (
            oldPrice.trim() &&
            (!Number.isFinite(Number(oldPrice)) || Number(oldPrice) < 0)
        ) {
            setError('Укажите корректную старую цену');
            return;
        }

        const dto: CreateProductDto = {
            title: title.trim(),
            catalogId: Number(catalogId),
            ...(sku.trim() && { sku: sku.trim() }),
            ...(slug.trim() && { slug: slug.trim() }),
            ...(price.trim() && { price: Number(price) }),
            ...(oldPrice.trim() && { oldPrice: Number(oldPrice) }),
            ...(subtitle.trim() && { subtitle: subtitle.trim() }),
            ...(tag.trim() && { tag: tag.trim() }),
            ...(warranty.trim() && { warranty: warranty.trim() }),
            ...(description.trim() && { description: description.trim() }),
            specs: specsText
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean),
        };

        setIsSaving(true);

        try {
            await saveMutation.mutateAsync(dto);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setIsSaving(false);
        }
    }

    if (isEditing && productQuery.isLoading) {
        return <div className="admin-loading">Загрузка товара...</div>;
    }

    if (isEditing && (productQuery.isError || !product)) {
        return (
            <section className="admin-section">
                <p>Не удалось загрузить товар. Проверьте ID и доступ к API.</p>
                <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    onClick={() => router.push('/admin/products')}
                >
                    К списку товаров
                </button>
            </section>
        );
    }

    return (
        <div className="product-form-page">
            <div className="admin-page-heading">
                <div>
                    <h1>{isEditing ? 'Редактирование товара' : 'Создание товара'}</h1>
                    <p>
                        {isEditing
                            ? `Изменение данных товара${product ? `: ${product.title}` : ''}`
                            : 'Заполните информацию о новом товаре'}
                    </p>
                </div>
            </div>

            {catalogsQuery.isLoading ? (
                <div className="admin-loading">Загрузка категорий...</div>
            ) : catalogsQuery.isError ? (
                <div className="admin-section">
                    Не удалось загрузить категории. Проверьте подключение к API.
                </div>
            ) : (
                <form className="product-form" onSubmit={handleSubmit}>
                    <section className="admin-section">
                        <h2>Основная информация</h2>

                        <div className="product-form-grid">
                            <label className="product-field product-field-wide">
                                Название товара *
                                <input
                                    required
                                    value={title}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setTitle(value);
                                        if (!slugManuallyEdited) setSlug(makeSlug(value));
                                    }}
                                    placeholder="Например, Духовой шкаф Bosch"
                                />
                            </label>

                            <label className="product-field">
                                Артикул (SKU)
                                <input
                                    value={sku}
                                    onChange={(event) => setSku(event.target.value)}
                                    placeholder="Например, BOSCH-HBG"
                                />
                            </label>

                            <label className="product-field">
                                URL (slug)
                                <input
                                    value={slug}
                                    onChange={(event) => {
                                        setSlug(makeSlug(event.target.value));
                                        setSlugManuallyEdited(true);
                                    }}
                                    placeholder="duhovoy-shkaf-bosch"
                                />
                            </label>

                            <label className="product-field">
                                Категория *
                                <select
                                    required
                                    value={catalogId}
                                    onChange={(event) => setCatalogId(event.target.value)}
                                >
                                    <option value="">Выберите категорию</option>
                                    {catalogOptions.map((catalog) => (
                                        <option key={catalog.id} value={catalog.id}>
                                            {catalog.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="product-field">
                                Подзаголовок
                                <input
                                    value={subtitle}
                                    onChange={(event) => setSubtitle(event.target.value)}
                                    placeholder="Краткое описание"
                                />
                            </label>

                            <label className="product-field">
                                Цена (сом)
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
                                    placeholder="0"
                                />
                            </label>

                            <label className="product-field">
                                Старая цена (сом)
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={oldPrice}
                                    onChange={(event) => setOldPrice(event.target.value)}
                                    placeholder="0"
                                />
                            </label>

                            <label className="product-field">
                                Метка товара
                                <input
                                    value={tag}
                                    onChange={(event) => setTag(event.target.value)}
                                    placeholder="Новинка, Хит продаж..."
                                />
                            </label>

                            <label className="product-field">
                                Гарантия
                                <input
                                    value={warranty}
                                    onChange={(event) => setWarranty(event.target.value)}
                                    placeholder="Например, 2 года"
                                />
                            </label>

                            <label className="product-field product-field-wide">
                                Описание
                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    placeholder="Подробное описание товара"
                                />
                            </label>

                            <label className="product-field product-field-wide">
                                Характеристики
                                <textarea
                                    rows={6}
                                    value={specsText}
                                    onChange={(event) => setSpecsText(event.target.value)}
                                    placeholder={'Объём: 71 л\nКласс энергопотребления: A+\nЦвет: чёрный'}
                                />
                                <span className="product-field-hint">
                  Каждая характеристика — с новой строки.
                </span>
                            </label>
                        </div>
                    </section>
                    {!isEditing && (
                        <section className="admin-section">
                            <h2>Изображения</h2>

                            <label className="product-field">
                                Основное изображение
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/avif"
                                    onChange={(event) =>
                                        setPoster(event.target.files?.[0] ?? null)
                                    }
                                />
                                <span className="product-field-hint">
                Это изображение станет обложкой товара.
            </span>
                            </label>

                            <label className="product-field product-field-gallery">
                                Дополнительные фотографии
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/avif"
                                    multiple
                                    onChange={(event) =>
                                        setGalleryFiles(Array.from(event.target.files ?? []))
                                    }
                                />
                                <span className="product-field-hint">
                Можно выбрать несколько файлов.
            </span>

                                {galleryFiles.length > 0 && (
                                    <span>Выбрано файлов: {galleryFiles.length}</span>
                                )}
                            </label>
                        </section>
                    )}
                    {error && (
                        <div className="product-form-error" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="product-form-actions">
                        <button
                            type="button"
                            className="admin-button admin-button-secondary"
                            disabled={isSaving}
                            onClick={() => router.push('/admin/products')}
                        >
                            Отмена
                        </button>

                        <button
                            type="submit"
                            className="admin-button admin-button-primary"
                            disabled={isSaving || catalogs.length === 0}
                        >
                            {isSaving
                                ? 'Сохранение...'
                                : isEditing
                                    ? 'Сохранить изменения'
                                    : 'Создать товар'}
                        </button>
                    </div>
                </form>
            )}
            {isEditing && product && (
                <ProductImageEditor productId={productId!} />
            )}
        </div>
    );
}

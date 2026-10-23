
'use client';

import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

import { fetchAdminProductById } from '@/lib/api/admin-products';
import {
    deleteProductImage,
    deleteProductPoster,
    reorderProductImages,
    setProductHeroImage,
    uploadProductImages,
    uploadProductPoster,
    type UploadedProductImage,
} from '@/lib/api/admin-product-images';

interface ProductImageEditorProps {
    productId: number;
}

interface EditableProduct {
    id: number;
    image?: string | null;
    images?: UploadedProductImage[];
}

export default function ProductImageEditor({
                                               productId,
                                           }: ProductImageEditorProps) {
    const queryClient = useQueryClient();

    const galleryInputRef = useRef<HTMLInputElement>(null);
    const posterInputRef = useRef<HTMLInputElement>(null);

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [draggedImageId, setDraggedImageId] = useState<number | null>(null);
    const [dragOverImageId, setDragOverImageId] = useState<number | null>(null);

    // Отдельный ключ не позволяет обновлению изображений
    // сбрасывать несохранённые поля основной формы товара.
    const productQuery = useQuery({
        queryKey: ['admin', 'product-images', productId],
        queryFn: async () =>
            (await fetchAdminProductById(productId)) as EditableProduct,
        enabled: Number.isInteger(productId) && productId > 0,
    });

    const product = productQuery.data;

    const images = [...(product?.images ?? [])].sort(
        (a, b) => a.sortOrder - b.sortOrder,
    );

    async function refreshProduct() {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ['admin', 'product-images', productId],
            }),
            queryClient.invalidateQueries({
                queryKey: ['admin', 'products'],
            }),
            queryClient.invalidateQueries({
                queryKey: ['products'],
            }),
            queryClient.invalidateQueries({
                queryKey: ['catalog-products'],
            }),
            queryClient.invalidateQueries({
                queryKey: ['featured-products'],
            }),
            queryClient.invalidateQueries({
                queryKey: ['new-arrivals'],
            }),
        ]);
    }

    async function runAction(action: () => Promise<unknown>) {
        setBusy(true);
        setError('');
        setMessage('');

        try {
            await action();
            await refreshProduct();
            setMessage('Изменения сохранены');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Не удалось выполнить операцию',
            );
        } finally {
            setBusy(false);
        }
    }

    function handlePosterChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        void runAction(() => uploadProductPoster(productId, file));
    }

    function handleGalleryChange(event: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);
        event.target.value = '';

        if (!files.length) return;

        if (files.length > 10) {
            setError('За один раз можно загрузить не более 10 изображений');
            return;
        }

        void runAction(() => uploadProductImages(productId, files));
    }

    async function moveImage(index: number, direction: -1 | 1) {
        const targetIndex = index + direction;

        if (
            busy ||
            targetIndex < 0 ||
            targetIndex >= images.length
        ) {
            return;
        }

        const reordered = [...images];

        [reordered[index], reordered[targetIndex]] = [
            reordered[targetIndex],
            reordered[index],
        ];

        await saveImageOrder(reordered);
    }

    async function saveImageOrder(
        reordered: UploadedProductImage[],
    ) {
        await runAction(() =>
            reorderProductImages(
                productId,
                reordered.map((image, sortOrder) => ({
                    id: image.id,
                    sortOrder,
                })),
            ),
        );
    }

    async function moveImageTo(
        sourceImageId: number,
        targetImageId: number,
    ) {
        if (
            busy ||
            sourceImageId === targetImageId
        ) {
            return;
        }

        const fromIndex = images.findIndex(
            (image) => image.id === sourceImageId,
        );

        const toIndex = images.findIndex(
            (image) => image.id === targetImageId,
        );

        if (fromIndex < 0 || toIndex < 0) return;

        const reordered = [...images];
        const [movedImage] = reordered.splice(fromIndex, 1);

        reordered.splice(toIndex, 0, movedImage);

        await saveImageOrder(reordered);
    }

    function handleDragStart(
        event: DragEvent<HTMLElement>,
        imageId: number,
    ) {
        if (busy) {
            event.preventDefault();
            return;
        }

        setDraggedImageId(imageId);
        setDragOverImageId(null);

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(imageId));
    }

    function handleDragOver(
        event: DragEvent<HTMLElement>,
        imageId: number,
    ) {
        event.preventDefault();

        if (busy || draggedImageId === null) return;

        event.dataTransfer.dropEffect = 'move';

        if (dragOverImageId !== imageId) {
            setDragOverImageId(imageId);
        }
    }

    function handleDrop(
        event: DragEvent<HTMLElement>,
        targetImageId: number,
    ) {
        event.preventDefault();

        const transferredId = Number(
            event.dataTransfer.getData('text/plain'),
        );

        const sourceImageId =
            draggedImageId ??
            (Number.isInteger(transferredId) ? transferredId : null);

        setDragOverImageId(null);
        setDraggedImageId(null);

        if (sourceImageId === null || busy) return;

        void moveImageTo(sourceImageId, targetImageId);
    }

    function handleDragEnd() {
        setDraggedImageId(null);
        setDragOverImageId(null);
    }

    if (productQuery.isPending) {
        return (
            <section className="admin-section product-image-editor">
                <h2>Изображения товара</h2>
                <p className="pf-editor-busy">
                    Загрузка изображений…
                </p>
            </section>
        );
    }

    if (productQuery.isError || !product) {
        return (
            <section className="admin-section product-image-editor">
                <h2>Изображения товара</h2>

                <div className="pf-cover-empty">
                    <span>Не удалось загрузить изображения товара.</span>

                    <button
                        type="button"
                        className="admin-button"
                        onClick={() => void productQuery.refetch()}
                    >
                        Повторить
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section
            className="admin-section product-image-editor"
            aria-busy={busy}
        >
            <div className="pf-editor-heading">
                <div>
                    <span className="pf-editor-eyebrow">
                        МЕДИАФАЙЛЫ
                    </span>
                    <h2>Изображения товара</h2>
                    <p className="pf-editor-intro">
                        Управляй обложкой и фотографиями товара.
                        Перетаскивай карточки, чтобы менять порядок.
                    </p>
                </div>

                <span className="pf-editor-total">
                    {images.length} фото
                </span>
            </div>

            {error && (
                <p
                    role="alert"
                    className="pf-editor-status pf-editor-status--error"
                >
                    <span aria-hidden="true">!</span>
                    {error}
                </p>
            )}

            {message && (
                <p
                    role="status"
                    className="pf-editor-status pf-editor-status--success"
                >
                    <span aria-hidden="true">✓</span>
                    {message}
                </p>
            )}

            {/* Обложка */}
            <div className="pf-editor-block">
                <h3 className="pf-section-title">
                    Основное изображение
                </h3>

                {product.image ? (
                    <div className="pf-cover">
                        <div className="pf-cover-preview">
                            <Image
                                src={product.image}
                                alt="Обложка товара"
                                className="pf-cover-thumb"
                                width={320}
                                height={240}
                                unoptimized
                            />
                        </div>

                        <div className="pf-cover-body">
                            <span className="pf-cover-label">
                                Текущая обложка
                            </span>

                            <p className="pf-cover-description">
                                Это изображение используется как главное
                                фото товара в каталоге.
                            </p>

                            <div className="pf-cover-actions">
                                <button
                                    type="button"
                                    className="admin-button admin-button-primary"
                                    disabled={busy}
                                    onClick={() =>
                                        posterInputRef.current?.click()
                                    }
                                >
                                    <span aria-hidden="true">↻</span>
                                    Заменить обложку
                                </button>

                                <button
                                    type="button"
                                    className="admin-button admin-button-danger"
                                    disabled={busy}
                                    onClick={() =>
                                        void runAction(() =>
                                            deleteProductPoster(productId),
                                        )
                                    }
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="pf-cover-empty">
                        <div className="pf-cover-empty-icon" aria-hidden="true">
                            <svg
                                viewBox="0 0 24 24"
                                width="30"
                                height="30"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="m21 15-5-5L5 21" />
                            </svg>
                        </div>

                        <div className="pf-cover-empty-copy">
                            <strong>Обложка ещё не добавлена</strong>
                            <span>
                                Выбери главное изображение товара.
                            </span>
                        </div>

                        <button
                            type="button"
                            className="admin-button admin-button-primary"
                            disabled={busy}
                            onClick={() => posterInputRef.current?.click()}
                        >
                            + Добавить обложку
                        </button>
                    </div>
                )}

                <input
                    ref={posterInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="pf-visually-hidden"
                    onChange={handlePosterChange}
                    disabled={busy}
                />
            </div>

            {/* Галерея */}
            <div className="pf-editor-block">
                <div className="pf-gallery-head">
                    <div>
                        <h3 className="pf-section-title">
                            Галерея
                            <span className="pf-gallery-count">
                                {images.length}
                            </span>
                        </h3>
                        <p className="pf-gallery-description">
                            Перетащи фото для изменения порядка.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-button admin-button-primary"
                        disabled={busy}
                        onClick={() => galleryInputRef.current?.click()}
                    >
                        <span aria-hidden="true">+</span>
                        Добавить фотографии
                    </button>

                    <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        multiple
                        className="pf-visually-hidden"
                        onChange={handleGalleryChange}
                        disabled={busy}
                    />
                </div>

                {images.length === 0 ? (
                    <div className="pf-empty">
                        <div className="pf-empty-icon" aria-hidden="true">
                            <svg
                                viewBox="0 0 24 24"
                                width="34"
                                height="34"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="m21 15-5-5L5 21" />
                            </svg>
                        </div>

                        <strong>Галерея пока пуста</strong>
                        <span>
                            Добавь фотографии, чтобы показать товар с разных
                            ракурсов.
                        </span>

                        <button
                            type="button"
                            className="admin-button"
                            disabled={busy}
                            onClick={() => galleryInputRef.current?.click()}
                        >
                            Выбрать фотографии
                        </button>
                    </div>
                ) : (
                    <div className="pf-gallery-grid">
                        {images.map((image, index) => {
                            const isHero = product.image === image.url;
                            const isDragging =
                                draggedImageId === image.id;
                            const isDropTarget =
                                dragOverImageId === image.id &&
                                draggedImageId !== image.id;

                            const cardClassName = [
                                'pf-image-card',
                                isDragging ? 'is-dragging' : '',
                                isDropTarget ? 'is-drop-target' : '',
                            ]
                                .filter(Boolean)
                                .join(' ');

                            return (
                                <article
                                    key={image.id}
                                    className={cardClassName}
                                    draggable={!busy}
                                    onDragStart={(event) =>
                                        handleDragStart(event, image.id)
                                    }
                                    onDragOver={(event) =>
                                        handleDragOver(event, image.id)
                                    }
                                    onDrop={(event) =>
                                        handleDrop(event, image.id)
                                    }
                                    onDragEnd={handleDragEnd}
                                    aria-label={`Фото ${index + 1}`}
                                >
                                    <div className="pf-image-card-media">
                                        <Image
                                            src={image.url}
                                            alt={
                                                image.alt ??
                                                `Фотография товара ${index + 1}`
                                            }
                                            draggable={false}
                                            loading="lazy"
                                        />

                                        <span className="pf-image-order">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        {isHero && (
                                            <span className="pf-image-badge">
                                                Обложка
                                            </span>
                                        )}

                                        <span
                                            className="pf-image-drag-hint"
                                            aria-hidden="true"
                                        >
                                            ⠿
                                        </span>

                                        <div className="pf-image-actions">
                                            <button
                                                type="button"
                                                className="pf-icon-btn"
                                                disabled={busy || index === 0}
                                                aria-label="Переместить фотографию выше"
                                                title="Выше"
                                                onClick={() =>
                                                    void moveImage(index, -1)
                                                }
                                            >
                                                ↑
                                            </button>

                                            <button
                                                type="button"
                                                className="pf-icon-btn"
                                                disabled={
                                                    busy ||
                                                    index === images.length - 1
                                                }
                                                aria-label="Переместить фотографию ниже"
                                                title="Ниже"
                                                onClick={() =>
                                                    void moveImage(index, 1)
                                                }
                                            >
                                                ↓
                                            </button>

                                            {!isHero && (
                                                <button
                                                    type="button"
                                                    className="pf-icon-btn"
                                                    disabled={busy}
                                                    aria-label="Сделать обложкой"
                                                    title="Сделать обложкой"
                                                    onClick={() =>
                                                        void runAction(() =>
                                                            setProductHeroImage(
                                                                productId,
                                                                image.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    ★
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="pf-icon-btn pf-icon-btn--danger"
                                                disabled={busy}
                                                aria-label="Удалить фотографию"
                                                title="Удалить"
                                                onClick={() =>
                                                    void runAction(() =>
                                                        deleteProductImage(
                                                            productId,
                                                            image.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pf-image-card-footer">
                                        <span className="pf-image-caption">
                                            {isHero
                                                ? 'Основное фото'
                                                : `Фото ${index + 1}`}
                                        </span>
                                        <span
                                            className="pf-image-grip"
                                            aria-hidden="true"
                                        >
                                            ⠿
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {busy && (
                <p className="pf-editor-busy">
                    Сохранение изменений…
                </p>
            )}
        </section>
    );
}

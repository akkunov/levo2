'use client';

import { useMemo, useState } from 'react';
import {
    FolderTree,
    Plus,
    Pencil,
    Trash2,
    Search,
    X,
    ChevronRight,
    Folder,
} from 'lucide-react';

import { useCatalogs } from '@/hooks/use-catalogs';
import { useAdminCatalogs } from '@/hooks/use-admin-catalogs';
import type { CatalogWithCount } from '@/types/catalog';

type CatalogForm = {
    name: string;
    slug: string;
    description: string;
    image: string;
    parentId: string;
};

const EMPTY_FORM: CatalogForm = {
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '',
};

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/[^a-zа-я0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function getCatalogName(catalog: CatalogWithCount) {
    return catalog.name;
}

export default function AdminCatalogsPage() {
    const { data: catalogs = [], isLoading, error } = useCatalogs();

    const {
        createCatalog,
        updateCatalog,
        deleteCatalog,
        isCreating,
        isUpdating,
        isDeleting,
    } = useAdminCatalogs();

    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CatalogWithCount | null>(null);
    const [form, setForm] = useState<CatalogForm>(EMPTY_FORM);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [formError, setFormError] = useState('');

    const filteredCatalogs = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return catalogs;

        return catalogs.filter((catalog) => {
            const text = `${catalog.name} ${catalog.slug}`.toLowerCase();
            return text.includes(query);
        });
    }, [catalogs, search]);

    const catalogOptions = useMemo(() => {
        if (!editing) return catalogs;

        // Нельзя назначить категорию родителем самой себя.
        // Проверку всех потомков дополнительно обеспечивает сервер.
        return catalogs.filter((catalog) => catalog.id !== editing.id);
    }, [catalogs, editing]);

    function openCreate() {
        setEditing(null);
        setForm(EMPTY_FORM);
        setSlugManuallyEdited(false);
        setFormError('');
        setModalOpen(true);
    }

    function openEdit(catalog: CatalogWithCount) {
        setEditing(catalog);
        setForm({
            name: catalog.name,
            slug: catalog.slug,
            description: catalog.description ?? '',
            image: catalog.image ?? '',
            parentId: catalog.parentId ? String(catalog.parentId) : '',
        });
        setSlugManuallyEdited(true);
        setFormError('');
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditing(null);
        setForm(EMPTY_FORM);
        setFormError('');
    }

    function handleNameChange(name: string) {
        setForm((current) => ({
            ...current,
            name,
            slug: slugManuallyEdited ? current.slug : slugify(name),
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError('');

        const name = form.name.trim();
        const slug = form.slug.trim();

        if (!name || !slug) {
            setFormError('Заполни название и slug категории.');
            return;
        }

        const dto = {
            name,
            slug,
            description: form.description.trim() || undefined,
            image: form.image.trim() || undefined,
            parentId: form.parentId ? Number(form.parentId) : null,
        };

        try {
            if (editing) {
                await updateCatalog({ id: editing.id, dto });
            } else {
                await createCatalog(dto);
            }

            closeModal();
        } catch (err) {
            setFormError(
                err instanceof Error ? err.message : 'Не удалось сохранить категорию.',
            );
        }
    }

    async function handleDelete(catalog: CatalogWithCount) {
        const confirmed = window.confirm(
            `Удалить категорию «${catalog.name}»?`,
        );

        if (!confirmed) return;

        try {
            await deleteCatalog(catalog.id);
        } catch (err) {
            window.alert(
                err instanceof Error
                    ? err.message
                    : 'Не удалось удалить категорию.',
            );
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-page-heading">
                <div>
                    <h1>Категории</h1>
                    <p>Управление категориями и подкатегориями каталога LEVO</p>
                </div>

                <button
                    type="button"
                    className="admin-primary-button"
                    onClick={openCreate}
                >
                    <Plus size={18} />
                    Добавить категорию
                </button>
            </div>

            <section className="admin-section">
                <div className="catalogs-toolbar">
                    <div className="admin-search-field">
                        <Search size={18} />
                        <input
                            type="search"
                            placeholder="Найти категорию..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Поиск категорий"
                        />
                    </div>

                    <div className="catalogs-total">
                        Всего категорий: <strong>{catalogs.length}</strong>
                    </div>
                </div>

                {isLoading ? (
                    <div className="admin-empty-state">Загружаем категории...</div>
                ) : error ? (
                    <div className="admin-error">
                        Не удалось загрузить категории. Проверь доступность API.
                    </div>
                ) : filteredCatalogs.length === 0 ? (
                    <div className="admin-empty-state">
                        <FolderTree size={32} />
                        <h3>Категории не найдены</h3>
                        <p>Измени поисковый запрос или создай новую категорию.</p>
                    </div>
                ) : (
                    <div className="catalogs-list">
                        {filteredCatalogs.map((catalog) => (
                            <div className="catalog-admin-item" key={catalog.id}>
                                <div className="catalog-admin-icon">
                                    <Folder size={21} />
                                </div>

                                <div className="catalog-admin-info">
                                    <strong>{getCatalogName(catalog)}</strong>
                                    <span>
                    /{catalog.slug} · ID {catalog.id}
                  </span>
                                </div>

                                <div className="catalog-admin-count">
                                    {catalog.count ?? catalog.count ?? 0} товаров
                                </div>

                                <div className="admin-row-actions">
                                    <button
                                        type="button"
                                        className="admin-icon-button"
                                        onClick={() => openEdit(catalog)}
                                        title="Редактировать"
                                        aria-label={`Редактировать ${catalog.name}`}
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-icon-button admin-icon-button-danger"
                                        onClick={() => handleDelete(catalog)}
                                        disabled={isDeleting}
                                        title="Удалить"
                                        aria-label={`Удалить ${catalog.name}`}
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {modalOpen && (
                <div
                    className="catalog-modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <section
                        className="catalog-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="catalog-modal-title"
                    >
                        <div className="catalog-modal-heading">
                            <div>
                                <h2 id="catalog-modal-title">
                                    {editing ? 'Редактировать категорию' : 'Новая категория'}
                                </h2>
                                <p>Укажи название и параметры категории.</p>
                            </div>

                            <button
                                type="button"
                                className="admin-icon-button"
                                onClick={closeModal}
                                aria-label="Закрыть"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form className="catalog-form" onSubmit={handleSubmit}>
                            <label>
                                Название *
                                <input
                                    required
                                    value={form.name}
                                    onChange={(event) => handleNameChange(event.target.value)}
                                    placeholder="Например, Встраиваемая техника"
                                />
                            </label>

                            <label>
                                Slug *
                                <input
                                    required
                                    value={form.slug}
                                    onChange={(event) => {
                                        setSlugManuallyEdited(true);
                                        setForm((current) => ({
                                            ...current,
                                            slug: slugify(event.target.value),
                                        }));
                                    }}
                                    placeholder="built-in-appliances"
                                />
                            </label>

                            <label>
                                Родительская категория
                                <select
                                    value={form.parentId}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            parentId: event.target.value,
                                        }))
                                    }
                                >
                                    <option value="">Без родителя — основная категория</option>
                                    {catalogOptions.map((catalog) => (
                                        <option key={catalog.id} value={catalog.id}>
                                            {catalog.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Описание
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            description: event.target.value,
                                        }))
                                    }
                                    placeholder="Описание категории (необязательно)"
                                />
                            </label>

                            <label>
                                URL изображения
                                <input
                                    type="url"
                                    value={form.image}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            image: event.target.value,
                                        }))
                                    }
                                    placeholder="https://..."
                                />
                            </label>

                            {formError && <div className="admin-error">{formError}</div>}

                            <div className="catalog-form-actions">
                                <button
                                    type="button"
                                    className="admin-secondary-button"
                                    onClick={closeModal}
                                >
                                    Отмена
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-button"
                                    disabled={isCreating || isUpdating}
                                >
                                    {isCreating || isUpdating
                                        ? 'Сохранение...'
                                        : editing
                                            ? 'Сохранить изменения'
                                            : 'Создать категорию'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
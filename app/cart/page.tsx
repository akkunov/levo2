'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
    const { items, subtotal, setQuantity, removeFromCart, clearCart } = useCart();

    return (
        <section className="cart-page">
            <div className="cart-container">
                <div className="cart-breadcrumbs">
                    <Link href="/">Главная</Link>
                    <span>/</span>
                    <span>Корзина</span>
                </div>

                <div className="cart-heading">
                    <div>
                        <span className="cart-eyebrow">LEVO / ВАШ ВЫБОР</span>
                        <h1>Корзина</h1>
                        <p>{items.length === 0 ? 'Пока ничего не выбрано' : `${items.length} ${items.length === 1 ? 'позиция' : 'позиции'} в заказе`}</p>
                    </div>
                    {items.length > 0 && (
                        <button className="cart-clear" type="button" onClick={clearCart}>
                            Очистить корзину
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon"><ShoppingBag size={30} strokeWidth={1.3} /></div>
                        <h2>Корзина пока пуста</h2>
                        <p>Выберите технику, которая подойдёт вашему пространству.</p>
                        <Link href="/catalogs" className="cart-primary-button">
                            Перейти в каталог <ArrowRight size={17} />
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {items.map(({ product, quantity }) => (
                                <article className="cart-item" key={product.id}>
                                    <Link href={product.slug ? `/products/${product.slug}` : '/catalogs'} className="cart-item-image">
                                        <Image
                                            src={product.image || '/images/product-placeholder.png'}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 640px) 112px, 160px"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </Link>
                                    <div className="cart-item-info">
                                        <span className="cart-item-category">{product.category}</span>
                                        <Link href={product.slug ? `/products/${product.slug}` : '/catalogs'} className="cart-item-name">
                                            {product.name}
                                        </Link>
                                        {product.tag && <span className="cart-item-tag">{product.tag}</span>}
                                        <div className="cart-item-bottom">
                                            <div className="cart-quantity" aria-label={`Количество: ${quantity}`}>
                                                <button type="button" aria-label="Уменьшить количество" onClick={() => setQuantity(product.id, quantity - 1)}>
                                                    <Minus size={14} />
                                                </button>
                                                <span>{quantity}</span>
                                                <button type="button" aria-label="Увеличить количество" onClick={() => setQuantity(product.id, quantity + 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button className="cart-remove" type="button" onClick={() => removeFromCart(product.id)} aria-label={`Удалить ${product.name}`}>
                                                <Trash2 size={16} /><span>Удалить</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-price">
                                        <strong>{formatPrice(product.price * quantity)}</strong>
                                        {quantity > 1 && <span>{formatPrice(product.price)} / шт.</span>}
                                    </div>
                                </article>
                            ))}
                        </div>

                        <aside className="cart-summary">
                            <span className="cart-eyebrow">ВАШ ЗАКАЗ</span>
                            <h2>Итого</h2>
                            <div className="cart-summary-row">
                                <span>Товары ({items.reduce((count, item) => count + item.quantity, 0)})</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Доставка</span>
                                <span className="cart-delivery-note">Уточняется</span>
                            </div>
                            <div className="cart-summary-total">
                                <span>Общая сумма</span>
                                <strong>{formatPrice(subtotal)}</strong>
                            </div>
                            <Link href="/contacts" className="cart-primary-button cart-checkout-button">
                                Обсудить заказ <ArrowRight size={17} />
                            </Link>
                            <p className="cart-summary-note">Стоимость доставки и наличие подтвердит менеджер LEVO.</p>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
}

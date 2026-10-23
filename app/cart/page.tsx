'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, subtotal, hydrated, setQuantity, removeItem, clearCart } = useCart();

  if (!hydrated) {
    return (
      <section className="cart-page page-shell" aria-live="polite">
        <p>Загружаем корзину...</p>
      </section>
    );
  }

  return (
    <section className="cart-page page-shell">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">LEVO / YOUR SELECTION</span>
          <h1>Корзина<span>.</span></h1>
          <p>{items.length ? `Товаров в корзине: ${items.reduce((sum, item) => sum + item.quantity, 0)}` : 'Ваш выбор начинается здесь.'}</p>
        </div>
        {items.length > 0 && (
          <button className="cart-clear-button" type="button" onClick={clearCart}>
            Очистить корзину
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <span className="cart-empty-icon"><ShoppingBag size={28} strokeWidth={1.3} /></span>
          <h2>Пока здесь пусто</h2>
          <p>Добавьте понравившуюся технику — выбранные товары сохранятся в этом браузере.</p>
          <Link href="/catalogs" className="button button-dark">
            Перейти в каталог <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items" aria-label="Товары в корзине">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <Link
                  className="cart-item-image"
                  href={item.slug ? `/products/${item.slug}` : '/catalogs'}
                  aria-label={`Открыть товар ${item.name}`}
                >
                  <Image src={item.image || '/images/product-placeholder.png'} alt={item.name} fill sizes="(max-width: 640px) 120px, 180px" />
                </Link>

                <div className="cart-item-info">
                  <span className="cart-item-category">{item.category}</span>
                  <Link className="cart-item-title" href={item.slug ? `/products/${item.slug}` : '/catalogs'}>
                    {item.name}
                  </Link>
                  <strong className="cart-item-price">{formatPrice(item.price)}</strong>
                  <div className="cart-item-controls">
                    <div className="cart-quantity" aria-label={`Количество: ${item.quantity}`}>
                      <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Уменьшить количество">
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Увеличить количество">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button className="cart-remove" type="button" onClick={() => removeItem(item.id)}>
                      <Trash2 size={15} /> Удалить
                    </button>
                  </div>
                </div>

                <strong className="cart-item-total">{formatPrice(item.price * item.quantity)}</strong>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <span className="eyebrow">ВАШ ЗАКАЗ</span>
            <div className="cart-summary-row">
              <span>Товары</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Доставка</span>
              <span>Уточняется</span>
            </div>
            <div className="cart-summary-total">
              <span>Итого</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <p>Корзина хранится только в localStorage этого браузера. Заказ ещё не отправлен.</p>
            <Link href="/contacts" className="button button-dark cart-contact-button">
              Уточнить оформление <ArrowRight size={17} />
            </Link>
            <Link href="/catalogs" className="cart-continue-link">Продолжить покупки</Link>
          </aside>
        </div>
      )}
    </section>
  );
}

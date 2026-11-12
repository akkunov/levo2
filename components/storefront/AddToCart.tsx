'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { StoreProduct } from '@/lib/api/products';
import { useCart } from '@/components/cart/cart-context';

export function AddToCart({product}: { product: StoreProduct }) {
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();
    return (
        <button
            type="button"
            className={`button button-dark add-cart ${added ? 'is-added' : ''}`}
            onClick={() => {
                addToCart(product);
                setAdded(true);
            }}
        >
            {added ? <><Check size={17} /> Добавлено в корзину</> : <>Добавить в корзину <ArrowRight size={17} /></>}
        </button>
    );
}

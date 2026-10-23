'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import type { StoreProduct } from '@/lib/api/products';

const STORAGE_KEY = 'levo-cart-v1';

export interface CartItem {
    product: StoreProduct;
    quantity: number;
}

interface CartContextValue {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    addToCart: (product: StoreProduct) => void;
    setQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((item): item is CartItem =>
            Boolean(
                item &&
                typeof item === 'object' &&
                'product' in item &&
                'quantity' in item &&
                typeof item.quantity === 'number' &&
                item.quantity > 0 &&
                item.product &&
                typeof item.product.id === 'number' &&
                typeof item.product.name === 'string',
            ),
        );
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setItems(readCart());
        setHydrated(true);

        const handleStorage = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY || event.key === null) {
                setItems(readCart());
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // The cart remains usable for this tab if storage is unavailable.
        }
    }, [items, hydrated]);

    const addToCart = useCallback((product: StoreProduct) => {
        setItems((current) => {
            const existing = current.find((item) => item.product.id === product.id);
            if (existing) {
                return current.map((item) =>
                    item.product.id === product.id
                        ? { ...item, product, quantity: item.quantity + 1 }
                        : item,
                );
            }
            return [...current, { product, quantity: 1 }];
        });
    }, []);

    const setQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
            setItems((current) => current.filter((item) => item.product.id !== productId));
            return;
        }
        setItems((current) =>
            current.map((item) =>
                item.product.id === productId ? { ...item, quantity: Math.floor(quantity) } : item,
            ),
        );
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setItems((current) => current.filter((item) => item.product.id !== productId));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const value = useMemo<CartContextValue>(() => ({
        items,
        itemCount: items.reduce((total, item) => total + item.quantity, 0),
        subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
        addToCart,
        setQuantity,
        removeFromCart,
        clearCart,
    }), [items, addToCart, setQuantity, removeFromCart, clearCart]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}

'use client';
import Link from 'next/link';
import {useState} from 'react';
import {ArrowDownRight, ArrowLeft, ArrowRight, Check, ChevronDown, Menu, Search, ShoppingBag, X} from 'lucide-react';
import {categories, formatPrice, products, type Product} from '@/lib/data';




export function ProductCard({product, index = 0}: { product: Product; index?: number }) {
    return <article className="product-card" style={{animationDelay: `${index * 70}ms`}}><Link
        href={`/products/${product.slug}`} className="product-image"><img src={product.image}
                                                                          alt={product.name}/>{product.tag &&
        <span className="product-tag">{product.tag}</span>}<span className="product-arrow"><ArrowDownRight
        size={18}/></span></Link>
        <div className="product-meta"><span>{product.category}</span><span>{product.id}</span></div>
        <Link className="product-title" href={`/products/${product.slug}`}>{product.name}</Link>
        <div className="price-line"><strong>{formatPrice(product.price)}</strong>{product.oldPrice &&
            <del>{formatPrice(product.oldPrice)}</del>}</div>
    </article>;
}

export function ProductGrid({items = products}: { items?: Product[] }) {
    return <div className="product-grid">{items.map((p, i) => <ProductCard key={p.id} product={p} index={i}/>)}</div>;
}

export function CategoryTiles() {
    return <div className="category-grid">{categories.map((category, i) => <Link
        className={`category-tile tile-${i + 1}`} key={category.slug} href={`/catalogs/${category.slug}`}><img
        src={category.image} alt=""/><span className="tile-shade"/><span
        className="tile-index">0{i + 1} / {String(categories.length).padStart(2, '0')}</span><span
        className="tile-copy"><small>{category.count} моделей</small><strong>{category.name}</strong><span
        className="tile-link">Исследовать <ArrowDownRight size={18}/></span></span></Link>)}</div>;
}

export function AddToCart({product}: { product: Product }) {
    const [added, setAdded] = useState(false);
    return <button className={`button button-dark add-cart ${added ? 'is-added' : ''}`}
                   onClick={() => setAdded(true)}>{added ? <><Check size={17}/> Добавлено в список</> : <>Добавить в
        корзину <ArrowRight size={17}/></>}</button>;
}

export function Breadcrumbs({items}: { items: { label: string; href?: string }[] }) {
    return <div className="breadcrumbs"><Link href="/">Главная</Link>{items.map((item, i) => <span key={i}><span
        className="crumb-sep">/</span>{item.href ? <Link href={item.href}>{item.label}</Link> :
        <span>{item.label}</span>}</span>)}</div>;
}

export function EditorialBanner() {
    return <section className="editorial-banner"><img
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=90"
        alt="Современный минималистичный интерьер"/>
        <div className="editorial-overlay"/>
        <div className="editorial-content"><span className="eyebrow light">LEVO / DESIGN NOTES 01</span>
            <h2>Технологии,<br/>которые не<br/><em>перетягивают</em><br/>внимание.</h2><Link
                className="text-link light-link" href="/catalogs/built-in-appliances">Открыть коллекцию <ArrowRight
                size={17}/></Link></div>
    </section>;
}

import Link from 'next/link';

export function Breadcrumbs({items}: { items: { label: string; href?: string }[] }) {
    return (
        <div className="breadcrumbs">
            <Link href="/">Главная</Link>
            {items.map((item, i) => (
                <span key={i}>
                    <span className="crumb-sep">/</span>
                    {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
                </span>
            ))}
        </div>
    );
}

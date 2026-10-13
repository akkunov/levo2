import Link from 'next/link';

export default function NotFound() {
    return (
        <section className="not-found page-shell">
            <span className="eyebrow">LEVO / 404</span>
            <h1>
                Эта страница<br />
                <em>не найдена.</em>
            </h1>
            <p>Возможно, ссылка устарела или товар уже не представлен.</p>
            <Link className="button button-dark" href="/catalogs">
                Вернуться в каталог
            </Link>
        </section>
    );
}

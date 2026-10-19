'use client';

import Link from 'next/link';
import {useCatalogs} from "@/hooks/use-catalogs";

const COMPANY_LINKS = [
    { label: 'О компании', href: '/about' },
    { label: 'Доставка и оплата', href: '/delivery' },
    { label: 'Гарантия', href: '/warranty' },
    { label: 'Контакты', href: '/contacts' },
];

const CONTACT_LINKS = [
    { label: 'WhatsApp', href: 'https://wa.me/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Gmail', href: 'https://www.instagram.com/' },
];

export function Footer() {
    const { data: catalogs = [], isLoading } = useCatalogs();

    return (
        <footer className="footer">
            <div className="footer-decorations" aria-hidden="true">
                <span className="footer-decoration footer-decoration-left" />
                <span className="footer-decoration footer-decoration-right" />
            </div>
            <div className="footer-container">
                {/* Каталог */}
                <section className="footer-catalog">
                    <div className="footer-section-heading">
                        <span className="footer-eyebrow">LEVO MARKET</span>
                        <h2>Каталог</h2>
                    </div>

                    <div className="footer-catalog-grid">
                        <Link
                            href="/catalogs"
                            className="footer-link footer-all-catalogs"
                        >
                            Все товары
                            <span aria-hidden="true">↗</span>
                        </Link>

                        {isLoading ? (
                            <span className="footer-muted">
                                Загрузка каталога...
                            </span>
                        ) : (
                            catalogs.map((catalog) => (
                                <Link
                                    key={catalog.id}
                                    href={`/catalogs/${encodeURIComponent(
                                        catalog.slug,
                                    )}`}
                                    className="footer-link"
                                >
                                    {catalog.name}
                                </Link>
                            ))
                        )}
                    </div>
                </section>

                <div className="footer-divider" />

                {/* Основная часть */}
                <div className="footer-main">
                    <div className="footer-brand">
                        <Link
                            href="/"
                            className="footer-logo"
                            aria-label="LEVO — главная страница"
                        />

                        <p className="footer-description">
                            Техника для дома, которая делает жизнь
                            комфортнее.
                        </p>

                        <p className="footer-brand-caption">
                            Технологии. Комфорт. LEVO.
                        </p>
                    </div>

                    <nav
                        className="footer-column"
                        aria-label="Информация"
                    >
                        <h3>Информация</h3>

                        {COMPANY_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="footer-link"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="footer-column">
                        <h3>Связаться с нами</h3>

                        <a
                            href="tel:+996"
                            className="footer-contact-value"
                        >
                            +996
                        </a>

                        <p className="footer-muted">
                            Бишкек, Кыргызстан
                        </p>

                        <div className="footer-socials">
                            {CONTACT_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-social-link"
                                >
                                    {link.label}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>
                        © {new Date().getFullYear()} LEVO. Все права защищены.
                    </span>

                    <Link
                        href="/privacy"
                        className="footer-bottom-link"
                    >
                        Политика конфиденциальности
                    </Link>

                    <Link href="/" className="footer-back-to-top">
                        Наверх ↑
                    </Link>
                </div>
            </div>
        </footer>
    );
}
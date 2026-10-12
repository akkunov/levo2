import Link from "next/link";

export function Footer() {
    return <footer className="site-footer">
        <div className="footer-top"><Link className="wordmark footer-logo" href="/">LEVO<span>®</span></Link><p>Техника
            для пространства,<br/>в котором хочется быть.</p>
            <div className="footer-links"><Link href="/catalogs">Каталог</Link><Link href="/contacts">Контакты</Link><a
                href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} LEVO KG</span><span>Создано для повседневной жизни.</span><a
            href="mailto:hello@levo.kg">hello@levo.kg</a></div>
    </footer>;
}

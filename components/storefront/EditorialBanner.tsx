import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function EditorialBanner() {
    return (
        <section className="editorial-banner">
            <Image src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=90" alt="Современный минималистичный интерьер" fill sizes="(max-width: 768px) 100vw, 100vw" loading="lazy" style={{ objectFit: "cover" }} />
            <div className="editorial-overlay" />
            <div className="editorial-content">
                <span className="eyebrow light">LEVO / DESIGN NOTES 01</span>
                <h2>
                    Технологии,<br />
                    которые не<br />
                    <em>перетягивают</em><br />
                    внимание.
                </h2>
                <Link className="text-link light-link" href="/catalogs/built-in-appliances">Открыть коллекцию <ArrowRight size={17} /></Link>
            </div>
        </section>
    );
}

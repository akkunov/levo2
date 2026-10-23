import type { Metadata } from 'next';
import Link from 'next/link';
import {ArrowDown, ArrowRight, MoveUpRight} from 'lucide-react';
import {CategoryTiles, EditorialBanner, ProductGrid} from '@/components/storefront';
import Image from 'next/image';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        title: siteConfig.defaultTitle,
        description: siteConfig.description,
        url: '/',
        images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=90', alt: 'LEVO — техника для современного дома' }],
    },
};

export default function HomePage() {
    return <>
        <section className="hero hero-home">
          <Image className="hero-image"
               src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=90"
               alt="Светлая современная кухня с лаконичной техникой"
                 fill
                 sizes="100vw"/>
            <div className="hero-gradient"/>
            <div className="hero-kicker"><span>LEVO / HOME COLLECTION</span><span>DESIGNED FOR LIVING</span></div>
            <div className="hero-copy"><p className="eyebrow light">ТЕХНИКА ДЛЯ СОВРЕМЕННОГО ПРОСТРАНСТВА</p><h1>Больше,
                чем<br/>функция. <em>Ощущение.</em></h1><p className="hero-description">Продуманные технологии и чистый
                дизайн —<br className="desktop-only"/> для жизни в своём ритме.</p><Link href="/catalogs"
                                                                                         className="button button-light">Открыть
                каталог <ArrowRight size={17}/></Link></div>
            <a className="hero-scroll" href="#collections"><span>Листайте, чтобы открыть LEVO</span><ArrowDown
                size={16}/></a><span className="hero-counter">01 <i/> 04</span></section>
        <section className="intro section-wrap" id="collections">
            <div className="section-label"><span>01 / КОЛЛЕКЦИИ</span><span>ПРОСТРАНСТВО ВАШЕГО ВЫБОРА</span></div>
            <div className="intro-heading"><h2>Технологии,<br/>которые <em>вписываются.</em></h2><p>Не просто техника.
                Часть пространства, привычек и моментов, из которых складывается дом.</p></div>
            <CategoryTiles/>
            <div className="section-end"><span>Найдите свою коллекцию</span><Link className="text-link"
                                                                                  href="/catalogs">Все
                категории <ArrowRight size={17}/></Link></div>
        </section>
        <section className="featured-section">
            <div className="section-wrap">
                <div className="section-label"><span>02 / ВЫБОР LEVO</span><span>ПОДОБРАНО ДЛЯ ВАС</span></div>
                <div className="section-heading-row"><h2>Вещи, которые<br/><em>работают на вас.</em></h2><Link
                    className="text-link" href="/catalogs">Смотреть все <ArrowRight size={17}/></Link></div>
                <ProductGrid/></div>
        </section>
        <EditorialBanner/>
        <section className="service-strip section-wrap">
            <div><span className="service-number">01</span><h3>Помогаем выбрать</h3><p>Подскажем, какая техника подойдёт
                вашему пространству и задачам.</p></div>
            <div><span className="service-number">02</span><h3>Понятно о важном</h3><p>Характеристики без лишнего шума.
                Только то, что действительно важно.</p></div>
            <div><span className="service-number">03</span><h3>Всегда на связи</h3><p>Свяжитесь с нами, чтобы уточнить
                наличие, доставку и условия покупки.</p></div>
        </section>
        <section className="closing-cta"><span className="eyebrow">LEVO KG / YOUR HOME, YOUR RHYTHM</span><h2>Дом
            начинается<br/>с <em>ощущения.</em></h2><Link className="button button-light" href="/catalogs">Выбрать
            технику <MoveUpRight size={17}/></Link></section>
    </>;
}

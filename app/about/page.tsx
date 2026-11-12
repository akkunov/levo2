import '../styles/about.css';
import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight, Diamond, ShieldCheck, Leaf, Layers3, HeartHandshake} from 'lucide-react';
import {Reveal} from '@/components/Ui';

export const metadata: Metadata = {title: 'О компании'};

const milestones = [
    {year: '2016', title: 'Начало пути', description: 'Зарождение идеи техники для современного дома.'},
    {year: '2018', title: 'Развитие ассортимента', description: 'Новые направления бытовой техники.'},
    {year: '2021', title: 'Больше возможностей', description: 'Расширение продуктовых решений и поддержки.'},
    {year: '2024', title: 'Новый этап', description: 'Фокус на дизайне и удобстве в каждой детали.'},
    {year: '2026', title: 'LEVO сегодня', description: 'Продолжаем развивать решения для дома.'},
];

const stats = [
    {value: '10+', label: 'лет на рынке'},
    {value: '10 000+', label: 'довольных клиентов'},
    {value: '50+', label: 'сервисных центров'},
    {value: '6', label: 'категорий техники'},
];

export default function Page() {
    return <>
        <section className="about-hero"
                 style={{backgroundImage: 'linear-gradient(90deg,rgba(0,0,0,.91),rgba(0,0,0,.06)),url(/images/about/hero.webp)'}}>
            <div className="page-shell ">
                <div className="breadcrumbs light"><Link href="/">Главная</Link> / О компании</div>
                <Reveal><span className="eyebrow light">ПОЗНАКОМЬТЕСЬ С LEVO</span><h1>Техника, которая<br/>делает жизнь
                    лучше.</h1><p>Мы создаём пространство, в котором передовые технологии и эстетика становятся частью
                    повседневного комфорта.</p><a href="#mission" className="btn btn-white">Наши ценности <ArrowRight
                    size={18}/></a></Reveal></div>
        </section>
        <div className="page-shell icon-strip">
            <div><Diamond/> Премиальная эстетика</div>
            <div><ShieldCheck/> Надёжность</div>
            <div><Layers3/> Продуманные решения</div>
            <div><Leaf/> Комфорт в доме</div>
        </div>
        <section id="mission" className="page-shell section about-two"><Reveal className="about-photo"><img
            src="/images/about/detail.webp" alt="Детали современной бытовой техники"/></Reveal><Reveal className="about-copy"><span
            className="eyebrow">НАША МИССИЯ</span><h2>Технологии для<br/>лучшей жизни.</h2><p>Мы верим, что бытовая
            техника должна не просто выполнять задачи, а делать повседневную жизнь удобнее и приятнее.</p><p>В основе
            концепции LEVO — сочетание функциональности, современного дизайна и внимания к деталям.</p></Reveal>
        </section>
        <section className="page-shell about-stats-section" aria-labelledby="about-stats-heading">
            <h2 id="about-stats-heading" className="sr-only">LEVO в цифрах</h2>
            <Reveal className="about-stats-grid">
                {stats.map((item) => <div className="about-stat" key={item.label}>
                    <strong>{item.value}</strong><span>{item.label}</span></div>)}
            </Reveal>
        </section>
        <section className="page-shell section about-history" aria-labelledby="about-history-heading">
            <Reveal className="about-history-intro"><span className="eyebrow">НАША ИСТОРИЯ</span><h2
                id="about-history-heading">Путь LEVO</h2><p>От первых решений до современной линейки бытовой техники. Мы
                стремимся соединить эстетику и удобство в каждом доме.</p></Reveal>
            <Reveal className="about-timeline">
                {milestones.map((item) => <div className="about-milestone" key={item.year}><span
                    className="about-milestone-dot" aria-hidden="true"/>
                    <time>{item.year}</time>
                    <h3>{item.title}</h3><p>{item.description}</p></div>)}
            </Reveal>
        </section>
        <section className="statement-section" >
            <div className="page-shell"><span className="eyebrow">ФИЛОСОФИЯ БРЕНДА</span><h2>Красота в простоте.<br/>Удобство
                в каждой детали.</h2></div>
        </section>
        <section className="page-shell section">
            <div className="section-heading">
                <div><span className="eyebrow">ТО, ЧТО НАС ВДОХНОВЛЯЕТ</span><h2>Наши ценности</h2></div>
            </div>
            <div className="value-grid">
                <div className="value-card"><Diamond/><h3>Эстетика</h3><p>Чистые формы, продуманные поверхности и
                    дизайн, который не теряет актуальности.</p></div>
                <div className="value-card"><Layers3/><h3>Инновации</h3><p>Современные технические решения для
                    ежедневных задач.</p></div>
                <div className="value-card"><ShieldCheck/><h3>Надёжность</h3><p>Внимание к конструкции, функциональности
                    и удобству эксплуатации.</p></div>
                <div className="value-card"><HeartHandshake/><h3>Забота</h3><p>Стремление сделать выбор и использование
                    бытовой техники проще.</p></div>
            </div>
        </section>
        <section className="about-feature"
                 style={{backgroundImage: 'linear-gradient(90deg,rgba(0,0,0,.1),rgba(0,0,0,.86)),url(/images/about/story.webp)'}}>
            <div className="page-shell">
                <div><span className="eyebrow light">СЕГОДНЯ</span><h2>Современные решения<br/>для вашего дома.</h2>
                    <p>Откройте технику, которая гармонично впишется в ваше пространство.</p><Link
                        className="button button-light" href="/catalogs">Перейти в каталог <ArrowRight size={18}/></Link>
                </div>
            </div>
        </section>
    </>
}

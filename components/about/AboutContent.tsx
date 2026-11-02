'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight, ArrowUpRight, Gem, ShieldCheck,
  House, Leaf, Zap, Layers3, Headset, HeartHandshake,
} from 'lucide-react';
import type { ReactNode } from 'react';
import s from './about.module.css';

type RevealProps = { children: ReactNode; className?: string; delay?: number };

const IMAGES = {
  hero: '/images/about/hero.webp',
  detail: '/images/about/detail.webp',
  story: '/images/about/story.webp',
  home: '/images/about/home2.webp',
};

function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const strengths = [
  { Icon: Gem, title: 'Продуманный дизайн', description: 'Эстетика, которая гармонично дополняет интерьер.' },
  { Icon: ShieldCheck, title: 'Надёжность', description: 'Внимание к материалам и удобству эксплуатации.' },
  { Icon: House, title: 'Комфорт дома', description: 'Техника для повседневных задач и привычного ритма жизни.' },
  { Icon: Leaf, title: 'Практичные технологии', description: 'Функции, которые действительно полезны каждый день.' },
];

const values = [
  { Icon: Zap, title: 'Инновации', description: 'Выбираем технологии, которые делают домашние дела проще.' },
  { Icon: Layers3, title: 'Качество', description: 'Уделяем внимание деталям, эргономике и функциональности.' },
  { Icon: Headset, title: 'Поддержка', description: 'Помогаем находить информацию о сервисе и эксплуатации.' },
  { Icon: HeartHandshake, title: 'Забота о клиентах', description: 'Строим опыт взаимодействия вокруг потребностей человека.' },
];

export default function AboutContent() {
  return (
    <main className={s.page}>
      {/* Header/Footer используются из общего app/layout.tsx проекта. */}
      <section className={s.hero} aria-labelledby="about-heading">
        <Image
          src={IMAGES.hero}
          alt="Современная кухня с бытовой техникой в тёмном интерьере"
          fill priority sizes="100vw" className={s.heroImage}
        />
        <div className={s.heroOverlay} />
        <div className={`${s.container} ${s.heroContent}`}>
          <nav className={s.breadcrumbs} aria-label="Хлебные крошки">
            <Link href="/">Главная</Link><span aria-hidden="true">/</span><span aria-current="page">О компании</span>
          </nav>
          <Reveal>
            <p className={s.eyebrow}>ЗНАКОМСТВО С БРЕНДОМ</p>
            <h1 id="about-heading">О компании</h1>
            <p className={s.heroSubtitle}>LEVO — техника, которая делает жизнь лучше</p>
            <p className={s.heroDescription}>
              Современные решения для дома, в которых функциональность,
              выразительный дизайн и повседневный комфорт дополняют друг друга.
            </p>
            <a href="#mission" className={s.lightButton}>
              Наша философия <ArrowRight size={17} strokeWidth={1.7}/>
            </a>
          </Reveal>
        </div>
        <div className={s.heroIndex}>01 <span/> LEVO / ABOUT</div>
      </section>

      <section className={s.strengths} aria-label="Принципы LEVO">
        <div className={`${s.container} ${s.strengthsGrid}`}>
          {strengths.map(({ Icon, title }, i) => (
            <Reveal className={s.strength} key={title} delay={i * 0.06}>
              <Icon size={27} strokeWidth={1.2} aria-hidden="true" />
              <span>{title}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="mission" className={`${s.container} ${s.mission}`}>
        <Reveal className={s.missionImageWrap}>
          <Image src={IMAGES.detail} alt="Детали современной кухонной техники" fill sizes="(max-width: 760px) 100vw, 50vw" className={s.coverImage} />
          <span className={s.imageLabel}>LEVO / DESIGN</span>
        </Reveal>
        <Reveal className={s.missionBody} delay={0.12}>
          <p className={s.eyebrow}>НАША МИССИЯ</p>
          <h2>Технологии для <em>лучшей жизни</em></h2>
          <p>
            Мы верим, что бытовая техника должна не просто выполнять свои функции,
            а естественно вписываться в пространство дома и делать повседневные дела удобнее.
          </p>
          <p>
            LEVO объединяет лаконичный дизайн, понятное управление и полезные
            возможности, чтобы в доме оставалось больше времени для главного.
          </p>
          <Link href="/catalogs" className={s.textLink}>Исследовать коллекции <ArrowUpRight size={18}/></Link>
        </Reveal>
      </section>

      <section className={s.statement}>
        <div className={s.container}>
          <Reveal>
            <p className={s.eyebrow}>НАШ ПОДХОД</p>
            <h2>Хороший дизайн — это когда <em>каждая деталь имеет значение.</em></h2>
          </Reveal>
        </div>
      </section>

      <section className={`${s.container} ${s.story}`}>
        <Reveal className={s.storyContent}>
          <p className={s.eyebrow}>ФИЛОСОФИЯ БРЕНДА</p>
          <h2>Простые решения.<br /><em>Большой комфорт.</em></h2>
          <p>
            Наш подход начинается с понятного вопроса: как сделать домашние
            задачи удобнее? Ответ — в продуманной функциональности, аккуратном
            исполнении и технике, которую приятно использовать каждый день.
          </p>
          <p>
            Мы смотрим на дом как на единое пространство, где вещи должны
            сочетаться между собой и помогать человеку, а не отвлекать его.
          </p>
        </Reveal>
        <Reveal className={s.storyImageWrap} delay={0.1}>
          <Image src={IMAGES.story} alt="Кухня с интегрированной бытовой техникой" fill sizes="(max-width: 760px) 100vw, 50vw" className={s.coverImage}/>
        </Reveal>
      </section>

      <section className={s.valuesSection}>
        <div className={s.container}>
          <Reveal className={s.valuesTitle}>
            <p className={s.eyebrow}>ТО, ЧТО ДЛЯ НАС ВАЖНО</p>
            <h2>Наши ценности</h2>
          </Reveal>
          <div className={s.valuesGrid}>
            {values.map(({ Icon, title, description }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <div className={s.valueCard}>
                  <Icon size={28} strokeWidth={1.3} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={s.finalBanner}>
        <Image src={IMAGES.home} alt="Современный интерьер дома с техникой" fill sizes="100vw" className={s.coverImage}/>
        <div className={s.finalOverlay}/>
        <div className={`${s.container} ${s.finalContent}`}>
          <Reveal>
            <p className={s.eyebrow}>LEVO / ДЛЯ ВАШЕГО ДОМА</p>
            <h2>Современные решения<br />для вашего дома</h2>
            <p>Откройте технику, в которой сочетаются комфорт, стиль и функциональность.</p>
            <Link href="/catalogs" className={s.lightButton}>Перейти в каталог <ArrowRight size={17}/></Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

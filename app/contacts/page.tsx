import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowDownRight, Mail, MapPin, Phone} from 'lucide-react';
import {Breadcrumbs} from '@/components/storefront';

export const metadata: Metadata = {title: 'Контакты'};
export default function ContactsPage() {
    return <div className="page-shell contacts-page"><Breadcrumbs items={[{label: 'Контакты'}]}/>
        <div className="page-heading"><span className="eyebrow">LEVO / CONTACT</span><h1>Давайте<br/><em>будем на
            связи.</em></h1><p>Поможем с выбором техники, ответим на вопросы о наличии и покупке.</p></div>
        <div className="contacts-layout">
            <div className="contacts-main"><span className="eyebrow">МЫ ГОТОВЫ ПОМОЧЬ</span><a className="contact-line"
                                                                                               href="tel:+996000000000"><span><Phone/><small>Телефон</small><strong>Укажите номер LEVO</strong></span><ArrowDownRight/></a><a
                className="contact-line"
                href="mailto:hello@levo.kg"><span><Mail/><small>Электронная почта</small><strong>hello@levo.kg</strong></span><ArrowDownRight/></a>
                <div className="contact-line"><span><MapPin/><small>Шоурум / магазин</small><strong>Уточните актуальный адрес</strong></span><ArrowDownRight/>
                </div>
                <p className="contact-note">Перед публикацией замените демонстрационные контактные данные на актуальные
                    данные LEVO KG.</p></div>
            <div className="contacts-image"><img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                alt="Интерьер современного дома"/>
                <div><span className="eyebrow light">LEVO KG</span><h2>Ваш дом.<br/>Ваш ритм.</h2><Link href="/catalogs"
                                                                                                        className="text-link light-link">Перейти
                    в каталог <ArrowDownRight size={17}/></Link></div>
            </div>
        </div>
    </div>;
}

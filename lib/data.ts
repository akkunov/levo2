export type Category = { name: string; slug: string; description: string; image: string; count: number };
export type Product = {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    oldPrice?: number;
    description: string;
    image: string;
    tag?: string;
    specs: string[]
};
const img = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
export const categories: Category[] = [
    {
        name: 'Встраиваемая техника',
        slug: 'built-in-appliances',
        description: 'Точная геометрия. Чистые линии. Технологии, которые становятся частью пространства.',
        image: img('photo-1600607687939-ce8a6c25118c'),
        count: 42
    },
    {
        name: 'Холодильники',
        slug: 'refrigerators',
        description: 'Продуманный холод и пространство для каждого продукта.',
        image: img('photo-1600585154340-be6161a56a0c'),
        count: 28
    },
    {
        name: 'Стиральные машины',
        slug: 'washing-machines',
        description: 'Забота о тканях, тишина и безупречный результат.',
        image: img('photo-1626806787461-102c1bfaaea1'),
        count: 19
    },
    {
        name: 'Кондиционеры',
        slug: 'air-conditioners',
        description: 'Комфортный климат в любое время года.',
        image: img('photo-1631545806609-7f7e6b8c4b2a'),
        count: 16
    },
    {
        name: 'Морозильники',
        slug: 'freezers',
        description: 'Больше места для запасов. Меньше компромиссов.',
        image: img('photo-1584568694244-14fbdf83bd30'),
        count: 11
    },
    {
        name: 'Посудомоечные машины',
        slug: 'dishwashers',
        description: 'Чистота без лишних усилий и шума.',
        image: img('photo-1556911220-e15b29be8c8f'),
        count: 14
    }
];
export const categorySlugByName = Object.fromEntries(
    categories.map((category) => [category.name, category.slug]),
) as Record<string, string>;

export const featuredCategorySlugs = ['built-in-appliances', 'refrigerators'] as const;

// Keep the data model centralized for future app-level usage without creating unused exports.

export const featuredCategoryLinks = featuredCategorySlugs.map((slug) => {
    const category = categories.find((item) => item.slug === slug);

    return {
        href: `/catalogs/${slug}`,
        label: category?.name ?? slug,
    };
});

export const products: Product[] = [
    {
        id: 'LV-OV-01',
        name: 'Духовой шкаф LEVO Series 7',
        slug: 'oven-series-7',
        category: 'Встраиваемая техника',
        price: 58900,
        oldPrice: 64900,
        description: 'Сдержанный дизайн, точный контроль температуры и равномерное приготовление для повседневных ритуалов.',
        image: img('photo-1600566753086-00f18fb6b3ea', 1000),
        tag: 'Выбор LEVO',
        specs: ['Объём 72 л', 'Класс энергоэффективности A+', 'Сенсорное управление']
    },
    {
        id: 'LV-HB-02',
        name: 'Индукционная панель LEVO Pure',
        slug: 'induction-pure',
        category: 'Встраиваемая техника',
        price: 42900,
        description: 'Минималистичная стеклокерамическая поверхность и точный нагрев в каждой зоне.',
        image: img('photo-1556911220-bff31c812dba', 1000),
        specs: ['4 зоны нагрева', 'Сенсорное управление', 'Защита от детей']
    },
    {
        id: 'LV-RF-03',
        name: 'Холодильник LEVO Space 400',
        slug: 'refrigerator-space-400',
        category: 'Холодильники',
        price: 79900,
        oldPrice: 84900,
        description: 'Вместительное хранение, лаконичный фасад и продуманная организация пространства.',
        image: img('photo-1584568694244-14fbdf83bd30', 1000),
        tag: 'Специальная цена',
        specs: ['Общий объём 400 л', 'No Frost', 'Зона свежести']
    },
    {
        id: 'LV-WM-04',
        name: 'Стиральная машина LEVO Care 8',
        slug: 'washing-machine-care-8',
        category: 'Стиральные машины',
        price: 46900,
        description: 'Деликатный уход за тканями с программами для современного ритма жизни.',
        image: img('photo-1626806787461-102c1bfaaea1', 1000),
        specs: ['Загрузка 8 кг', 'Инверторный двигатель', '15 программ']
    },
    {
        id: 'LV-AC-05',
        name: 'Кондиционер LEVO Air 12',
        slug: 'air-conditioner-air-12',
        category: 'Кондиционеры',
        price: 35900,
        description: 'Комфортная температура и спокойная работа для спальни или гостиной.',
        image: img('a-person-holding-a-remote-control-in-front-of-a-wall-mounted-air-conditioner-3iLFQj2bXq0', 1000),
        specs: ['Мощность 12 000 BTU', 'Инвертор', 'Режим сна']
    },
    {
        id: 'LV-DW-06',
        name: 'Посудомоечная машина LEVO Quiet',
        slug: 'dishwasher-quiet',
        category: 'Посудомоечные машины',
        price: 51900,
        description: 'Чистая посуда и почти незаметная работа в открытой кухне.',
        image: img('photo-1556911220-e15b29be8c8f', 1000),
        specs: ['14 комплектов', '6 программ', 'Отложенный старт']
    }
];
export const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price) + ' сом';

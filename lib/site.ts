export const siteConfig = {
    name: 'LEVO KG',
    url: 'https://levo.kg',
    description:
        'Бытовая техника LEVO в Кыргызстане. Продуманный дизайн, технологии и комфорт на каждый день.',
    email: 'hello@levo.kg',
    phone: '+996 000 000 000',
    defaultTitle: 'LEVO — техника для жизни',
} as const;

export const defaultMetadata = {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
};


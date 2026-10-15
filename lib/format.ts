export function formatPrice(value: number | null | undefined): string {
    if (value == null) return 'Цена уточняется';

    return new Intl.NumberFormat('ru-KG', {
        style: 'currency',
        currency: 'KGS',
        maximumFractionDigits: 0,
    }).format(value);
}


# LEVO frontend: архитектура и CSS

## Текущие границы проекта

- `app/` — маршруты, metadata и server-side data loading.
- `components/storefront/` — декомпозированные компоненты витрины: `ProductCard`, `ProductGrid`, `ProductSpecifications`, `AddToCart`, `CategoryTiles`, `CatalogSummary`, `CatalogProductSections`, `Breadcrumbs`, `EditorialBanner`. Компоненты с интерактивностью имеют `use client`; остальные не расширяют клиентскую границу.
- `components/admin/`, `components/cart/`, `components/theme/` — функциональные домены.
- `hooks/` — клиентские React Query hooks и UI-состояние.
- `lib/api/` — HTTP-запросы к отдельному NestJS API. Не смешивать fetch, преобразование API DTO и визуализацию.
- `lib/seo/` — schema.org, метаданные и структурированные данные.
- `types/` — общие контракты.

## Организация стилей

- `app/styles/00-tokens.css` — переменные светлой и тёмной темы, цветовая палитра, размеры, отступы.
- `app/styles/01-base.css` — глобальный reset, типографика, базовые контролы и общие accessible utilities.
- `app/styles/01-header.css` и `app/styles/footer.css` — общие шапка/подвал.
- `app/styles/02-home.css`, `03-catalog.css`, `04-product.css` — исторические стили витрины. Они пока остаются глобальными, поскольку селекторы пересекаются с общими компонентами. Переносить только после проверки скриншотов и CSS Coverage.
- `app/styles/05-admin.css`, `admin.css`, `product-form.css` — импортируются в `app/admin/layout.tsx`.
- `app/styles/cart.css` — импортируется на странице корзины.
- `app/styles/about.css` — импортируется на странице «О нас».
- Новые независимые компоненты со сложной разметкой должны использовать `*.module.css` или осмысленно переиспользовать глобальные токены и классы.

### Правила

1. Использовать переменные `--ink`, `--muted`, `--paper`, `--surface`, `--line`, `--accent`, `--page`, `--space-*` из `01-base.css`. Проверять оба значения `data-theme`.
2. Не добавлять новые `@import` в глобальный файл для стилистики одной страницы.
3. Не переопределять общие селекторы десятками правил в других CSS-файлах. Если нужен вариант — добавить модификатор с документированным именем или CSS Module.
4. Не использовать `!important` для борьбы с порядком импорта без реальной необходимости.
5. Дублирование одинакового селектора в медиазапросах может быть оправданным. Не удалять такие правила автоматическим скриптом.
6. Удалять CSS **только** после `npm run audit:css`, инспекции фактического DOM, проверки CSS Coverage и визуального сравнения мобильного/десктопного UI.
7. После изменения порядка импорта проверить `npm run build` в production-режиме: CSS chunking может изменить каскад.
8. Отдельно проверять WCAG-контраст, focus-visible, prefers-reduced-motion и CLS.

## План продолжения

1. **Performance baseline** — сохранить Lighthouse trace и Network waterfall для `/`, `/catalogs`, `/products/[slug]`; зафиксировать LCP element, TTFB, переданные КБ, блокирующие CSS, JS.
2. **Images** — протестировать оптимизацию Next Image на реальных R2 URL, правильный `sizes` и отсутствие лишней загрузки hover poster. Затем ограничить `remotePatterns` только известными HTTPS CDN.
3. **CSS** — запустить `npm run audit:css`, вручную подтвердить неиспользуемые селекторы; убрать старые дубли `footer` из base только после сравнения свойств и responsive-проверки.
4. **Components** — базовое разбиение `components/storefront.tsx` уже сделано. Следующий шаг: по мере необходимости сгруппировать компоненты по `categories/`, `products/`, `shared/`, без гигантских barrel-импортов.
5. **Data** — начальный контент главной страницы получать на сервере и передавать клиенту в качестве initial data там, где оправдано; серверные fetch использовать с осознанной политикой cache/revalidate.
6. **Security** — отдельно проаудировать localStorage JWT, XSS и RBAC API; переносить авторизацию на cookies только вместе с NestJS backend.
7. **Checks** — добавить полноценную ESLint 9 конфигурацию, CI и route smoke tests после фиксации текущего baseline.

## Проверка изменений

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
npm run audit:css
```

Для оценки экономии CSS/JS сравнивать **production build** и Lighthouse до/после. Сборка и фактическое ускорение требуют исполнения тестов, а не выводятся из размера исходных CSS-файлов.

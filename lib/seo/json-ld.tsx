
import type { ReactElement } from 'react';

type JsonLdValue = Record<string, unknown>;

interface JsonLdProps {
    data: JsonLdValue | JsonLdValue[];
}

export function JsonLd({
                           data,
                       }: JsonLdProps): ReactElement {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(
                    /</g,
                    '\\u003c',
                ),
            }}
        />
    );
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

export function createBreadcrumbs(
    items: BreadcrumbItem[],
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Run the production TS helper in Node without pulling in an extra test runner.
const source = readFileSync('lib/images.ts', 'utf8');
const output = ts.transpileModule(source, {
    compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
    },
}).outputText;
const {
    normalizeImageUrl,
    normalizeCatalogImages,
    normalizeProductImages,
    bypassVercelImageOptimizer,
} = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);

const r2 = 'https://pub-70284751a4884f90bf14b3714880cdef.r2.dev/uploads/75467350-7da3-4ef7-b3f4-0d0c0c490fba-IMG_6782.jpeg';
const first = `https://levo.kg/_next/image?url=${encodeURIComponent(r2)}&w=1920&q=75`;
const second = `https://levo.kg/_next/image?url=${encodeURIComponent(first)}&w=448&q=75`;
const third = `https://levo.kg/_next/image?url=${encodeURIComponent(second)}&w=640&q=75`;

for (const input of [r2, first, second, third]) {
    assert.equal(normalizeImageUrl(input), r2);
    assert.equal(bypassVercelImageOptimizer(input), true);
}

// In particular, match the double-encoded real-world production failure.
assert.equal(normalizeImageUrl(
    'https://levo.kg/_next/image?url=https%3A%2F%2Flevo.kg%2F_next%2Fimage%3Furl%3Dhttps%253A%252F%252Fpub-70284751a4884f90bf14b3714880cdef.r2.dev%252Fuploads%252F75467350-7da3-4ef7-b3f4-0d0c0c490fba-IMG_6782.jpeg%26w%3D1920%26q%3D75&w=448&q=75',
), r2);

// Legacy local /_next/image links also decode to their original local assets.
assert.equal(normalizeImageUrl('/_next/image?url=%2Fimages%2Fhome%2Fhero.webp&w=750&q=75'), '/images/home/hero.webp');
assert.equal(bypassVercelImageOptimizer('/images/home/hero.webp'), false);
assert.equal(normalizeImageUrl('/noPoster.jpg'), '/noPoster.jpg');
assert.equal(normalizeImageUrl('https://images.unsplash.com/image.jpg'), 'https://images.unsplash.com/image.jpg');
assert.equal(normalizeImageUrl(null), '');

// Do not silently unwrap arbitrary hosts or open redirects.
const untrusted = `https://attacker.example/_next/image?url=${encodeURIComponent(r2)}&w=448`;
const unsafeTarget = 'https://levo.kg/_next/image?url=https%3A%2F%2Fevil.example%2Fimage.jpg&w=448';
assert.equal(normalizeImageUrl(untrusted), untrusted);
assert.equal(normalizeImageUrl(unsafeTarget), unsafeTarget);

const catalog = normalizeCatalogImages({
    id: 1, image: first, children: [{ id: 2, image: second, children: [] }],
});
assert.equal(catalog.image, r2);
assert.equal(catalog.children[0].image, r2);

const product = normalizeProductImages({
    id: 10, image: second, images: [{ id: 22, url: first }],
});
assert.equal(product.image, r2);
assert.equal(product.images[0].url, r2);

console.log('Image URL normalization tests passed (nested R2, local, API data and untrusted URLs).');

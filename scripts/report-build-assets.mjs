/**
 * Inspect client asset sizes from a production Next.js build.
 * This is reporting only: "unused JS" requires Chrome coverage / runtime traces.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const root = '.next';
const manifestPath = join(root, 'app-build-manifest.json');
if (!existsSync(manifestPath)) {
  console.log('[assets] Next.js app-build-manifest.json not found; skipping.');
  process.exit(0);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const pages = manifest.pages ?? {};
const assets = new Set(Object.values(pages).flat().filter(file => file.endsWith('.js') || file.endsWith('.css')));
const rows = [];
for (const file of assets) {
  const path = join(root, file.replace(/^\//, ''));
  if (!existsSync(path) || !statSync(path).isFile()) continue;
  const content = readFileSync(path);
  rows.push({
    name: file,
    type: file.endsWith('.css') ? 'css' : 'js',
    bytes: content.byteLength,
    gzip: gzipSync(content).byteLength,
  });
}
for (const type of ['css', 'js']) {
  const list = rows.filter(row => row.type === type);
  const bytes = list.reduce((sum, row) => sum + row.bytes, 0);
  const gzip = list.reduce((sum, row) => sum + row.gzip, 0);
  console.log(`[assets] ${type}: ${list.length} unique chunks, ${(bytes / 1024).toFixed(1)} KiB raw, ${(gzip / 1024).toFixed(1)} KiB gzip`);
}
console.log('[assets] Largest emitted assets (not equal to loaded-on-homepage):');
for (const row of rows.sort((a, b) => b.gzip - a.gzip).slice(0, 10)) {
  console.log(`[assets] ${(row.gzip / 1024).toFixed(1)} KiB gzip - ${row.name}`);
}

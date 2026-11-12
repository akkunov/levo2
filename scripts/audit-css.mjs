#!/usr/bin/env node
/**
 * Conservative CSS inventory for LEVO.
 * Reports potential dead classes and cross-file selector duplication.
 * It NEVER edits styles. Dynamic classes, pseudo-states and third-party
 * markup require manual review before removing any selector.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const roots = ['app', 'components', 'hooks', 'lib', 'types'];
const sourceFile = /\.(?:[cm]?js|jsx|tsx?|mdx)$/;
const cssFile = /\.css$/;
const ignored = new Set(['node_modules', '.next', '.git', 'dist', 'out']);

function walk(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory() && !ignored.has(entry.name)) {
      files.push(...walk(file));
    } else if (entry.isFile()) {
      files.push(file);
    }
  }
  return files;
}

const files = roots.flatMap((dir) => walk(path.join(root, dir)));
const sources = files.filter((file) => sourceFile.test(file));
const styles = files.filter((file) => cssFile.test(file));
const sourceText = sources.map((file) => readFileSync(file, 'utf8')).join('\n');
const foundClasses = new Map();
const duplicateSelectors = new Map();

for (const file of styles) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of css.matchAll(/([^{}]+)\{/g)) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith('@') || /^(?:from|to|\d+(?:\.\d+)?%)$/i.test(raw)) continue;
    for (const selector of raw.split(',').map((part) => part.trim())) {
      if (!selector || selector.includes('@')) continue;
      const locations = duplicateSelectors.get(selector) ?? new Set();
      locations.add(rel);
      duplicateSelectors.set(selector, locations);
      for (const item of selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
        const name = item[1];
        const references = foundClasses.get(name) ?? new Set();
        references.add(rel);
        foundClasses.set(name, references);
      }
    }
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&');
}
const possibleUnused = [...foundClasses]
  .filter(([name]) => {
    const regex = new RegExp('(^|[^a-zA-Z0-9_-])' + escapeRegExp(name) + '($|[^a-zA-Z0-9_-])');
    return !regex.test(sourceText);
  })
  .sort(([a], [b]) => a.localeCompare(b));
const duplicated = [...duplicateSelectors]
  .filter(([, paths]) => paths.size > 1)
  .filter(([selector]) => !/^(?:from|to|\d+(?:\.\d+)?%)$/.test(selector))
  .sort(([a], [b]) => a.localeCompare(b));

console.log('CSS audit — read-only, heuristic report');
console.log('TS/JS sources:', sources.length, '| CSS files:', styles.length);
console.log('\nPotentially unused class names:', possibleUnused.length);
for (const [name, locations] of possibleUnused.slice(0, 100)) {
  console.log('  .' + name + ' — ' + [...locations].join(', '));
}
if (possibleUnused.length > 100) console.log('  ... additional results omitted');
console.log('\nSelectors present in multiple CSS files:', duplicated.length);
for (const [name, locations] of duplicated.slice(0, 100)) {
  console.log('  ' + name + ' — ' + [...locations].join(', '));
}
if (duplicated.length > 100) console.log('  ... additional results omitted');
console.log('\nReview every result manually; CSS modules, dynamic classes and');
console.log('responsive overrides may appear unused or duplicated by design.');

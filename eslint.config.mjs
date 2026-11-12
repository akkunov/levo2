import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Next.js 15 uses the legacy presets through FlatCompat with ESLint 9.
// Switch to eslint-config-next flat exports only when upgrading to Next.js 16+.
const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'dist/**', 'build/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;

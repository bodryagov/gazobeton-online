import { defineConfig } from 'eslint/config';
import nextPlugin from '@next/eslint-plugin-next';
import nextTypescript from 'eslint-config-next/typescript';

const nextRecommendedRules = nextPlugin.configs['recommended'].rules ?? {};
const nextCoreWebVitalsRules = nextPlugin.configs['core-web-vitals'].rules ?? {};

export default defineConfig([
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**'],
  },
  ...nextTypescript,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextRecommendedRules,
      ...nextCoreWebVitalsRules,
    },
  },
]);


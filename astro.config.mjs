// @ts-check
import { defineConfig } from 'astro/config';

// On GitHub Pages the deploy workflow passes SITE and BASE_PATH from
// actions/configure-pages, so this works for both a user site
// (<user>.github.io, base "/") and a project site (<user>.github.io/<repo>).
export default defineConfig({
  site: process.env.SITE || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'ignore',
});

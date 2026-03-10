---
name: tailwindcss-v4
description: Tailwind CSS v4 patterns and migration guide. Use when writing utility classes, configuring themes, or working with CSS in any project using Tailwind v4. Critical breaking changes from v3.
metadata:
  author: custom
  version: "1.0.0"
---

# Tailwind CSS v4 Best Practices

Tailwind v4 is a major rewrite with significant breaking changes from v3. This project uses `@tailwindcss/vite` as the Vite plugin (not PostCSS).

## Setup (v4 differs from v3)

### Installation in Vite/Astro projects

```js
// vite.config.js / astro.config.mjs
import tailwindcss from '@tailwindcss/vite';

export default {
  vite: {
    plugins: [tailwindcss()]
  }
}
```

### CSS Entry Point

```css
/* ✅ v4: single import, no directives needed */
@import 'tailwindcss';

/* ❌ v3 syntax — does NOT work in v4 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Theme Configuration — `@theme` (CSS-based, no config file)

In v4, the theme is configured in CSS using the `@theme` directive. There is **no `tailwind.config.js`** for theme values.

```css
@import 'tailwindcss';

@theme {
  /* Custom colors become utilities: bg-brand-primary, text-brand-primary, etc. */
  --color-brand-primary: #6b21a8;
  --color-brand-accent: #ec4899;

  /* Custom fonts */
  --font-sans: 'Inter', sans-serif;

  /* Custom spacing */
  --spacing-18: 4.5rem;

  /* Custom breakpoints */
  --breakpoint-xs: 30rem;
}
```

### Accessing theme values in CSS

```css
.my-component {
  /* ✅ Use CSS variables directly — they're auto-generated from @theme */
  color: var(--color-brand-primary);
  padding: var(--spacing-18);
}
```

### Customizing with `@theme inline`

Use `@theme inline` to define values that should NOT generate utility classes:

```css
@theme inline {
  --color-background: oklch(0.15 0.05 280);
}
```

## Utility Class Changes from v3

### Colors

```html
<!-- ✅ v4: same syntax, but now uses CSS vars internally -->
<div class="bg-purple-500 text-white">

<!-- Custom colors from @theme work as utilities -->
<div class="bg-brand-primary text-brand-accent">
```

### Gradients

```html
<!-- ✅ v4 syntax -->
<div class="bg-linear-to-r from-purple-500 to-pink-500">

<!-- ❌ v3 syntax — changed in v4 -->
<div class="bg-gradient-to-r from-purple-500 to-pink-500">
```

### Arbitrary Values (same as v3)

```html
<div class="w-[320px] text-[#ff0000] top-[calc(100vh-4rem)]">
```

### Important modifier

```html
<!-- ✅ v4: use ! prefix instead of ! suffix -->
<div class="!bg-red-500">

<!-- ❌ v3 syntax -->
<div class="bg-red-500!">
```

## Content Detection (No Config Needed)

v4 automatically detects template files — you do NOT need a `content` array:

```css
/* ✅ v4: just import, no content configuration needed */
@import 'tailwindcss';

/* ❌ v3 tailwind.config.js — not needed in v4 */
// content: ['./src/**/*.{astro,tsx,ts,html}']
```

## Dark Mode

v4 uses CSS `prefers-color-scheme` by default. To use class-based dark mode:

```css
@import 'tailwindcss';

@config {
  darkMode: 'class';
}
```

Or with CSS variables for theme switching:

```css
@theme {
  --color-bg: #ffffff;
  --color-text: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #ffffff;
  }
}
```

## Custom Utilities with `@utility`

Define custom utilities (replaces `@layer utilities` from v3):

```css
/* ✅ v4: @utility directive */
@utility neon-text {
  text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
}

/* Can use Tailwind values */
@utility glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## Custom Variants with `@variant`

```css
/* Define a custom variant */
@variant hocus (&:hover, &:focus);

/* Use in HTML */
/* <button class="hocus:bg-blue-500"> */
```

## `@apply` (still works, but use sparingly)

```css
/* ✅ Still valid in v4 */
.btn-primary {
  @apply px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600;
}

/* But prefer @utility for reusable utilities */
@utility btn-primary {
  @apply px-4 py-2 bg-purple-500 text-white rounded-md;
}
```

## Responsive Design (same breakpoints, same syntax)

```html
<!-- Mobile-first, same as v3 -->
<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">

<!-- Custom breakpoints from @theme -->
<div class="w-full xs:w-auto">
```

## Removed / Changed v3 Features

| v3 | v4 equivalent |
|----|---------------|
| `tailwind.config.js` theme | `@theme` in CSS |
| `@tailwind base/components/utilities` | `@import 'tailwindcss'` |
| `@layer utilities {}` | `@utility {}` |
| `@layer components {}` | `@utility {}` or `@layer components {}` |
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `content: [...]` in config | Automatic detection |
| `darkMode: 'media'` | Default behavior |
| `plugins: []` in config | `@plugin` in CSS |

## Common Pitfalls

- **Don't** use `tailwind.config.js` to extend theme — use `@theme` in CSS instead
- **Don't** use `@tailwind` directives — use `@import 'tailwindcss'`
- **Don't** use `bg-gradient-to-*` — it's now `bg-linear-to-*`
- When using the `@tailwindcss/vite` plugin, PostCSS config is NOT needed
- JIT is always on in v4 — no need to configure it

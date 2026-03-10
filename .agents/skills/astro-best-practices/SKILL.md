---
name: astro-best-practices
description: Astro 5 best practices for server-rendered sites with React islands, file-based routing, and Vercel deployment. Use when writing or reviewing Astro components, pages, layouts, or API routes.
metadata:
  author: custom
  version: "1.0.0"
---

# Astro 5 Best Practices

Guidelines for building performant, maintainable sites with Astro 5. This project uses `output: 'server'` (SSR) with the Vercel adapter and React islands.

## Core Architecture Principles

### Astro Components vs React Components

**Use `.astro` files for:**
- Static or server-rendered markup (layouts, headers, footers, SEO)
- Anything that doesn't need client interactivity
- Data fetching at request time (Astro components are async by default)
- Composing islands via `<slot />`

**Use React components for:**
- Interactive UI (state, events, animations)
- Components that need `useState`, `useEffect`, or event handlers

```astro
---
// ✅ Fetch data in the Astro frontmatter — runs server-side, zero client JS
import { getServiceById } from '../lib/services';
const service = await getServiceById(Astro.params.id);
---
<ReactComponent service={service} client:load />
```

### Islands Architecture — `client:*` Directives

Only use `client:*` when the component truly needs interactivity:

| Directive | When to use |
|-----------|-------------|
| `client:load` | Hydrate immediately — for above-the-fold interactive UI |
| `client:idle` | Hydrate when browser is idle — for below-the-fold UI |
| `client:visible` | Hydrate when element enters viewport — for off-screen UI |
| `client:media="(query)"` | Hydrate only when media query matches |
| `client:only="react"` | Skip SSR entirely — for components that need `window` |

```astro
<!-- ✅ Correct: interactive sidebar hydrates immediately -->
<PaymentSidebar service={service} client:load />

<!-- ✅ Correct: footer newsletter hydrates when visible -->
<NewsletterForm client:visible />

<!-- ❌ Wrong: static list doesn't need hydration -->
<ServiceList items={items} client:load />
```

### Data Fetching in Astro Pages

Fetch all data in frontmatter. Never import server-only code into React components.

```astro
---
// ✅ All DB calls happen here (server-side)
import { getServicesByGame } from '../../lib/services';
import { getPaymentConfig } from '../../lib/services/payment';

const [services, paymentConfig] = await Promise.all([
  getServicesByGame(Astro.params.id),
  getPaymentConfig(),
]);
---
```

Always use `Promise.all()` for independent parallel fetches — never `await` sequentially.

## File Structure & Routing

### Page Routing

- `src/pages/index.astro` → `/`
- `src/pages/game/[id].astro` → `/game/:id` (dynamic)
- `src/pages/game/[id].astro` — use `Astro.params.id` for the dynamic segment
- API routes: `src/pages/api/[...path].ts` → export `GET`, `POST`, etc.

```astro
---
// Dynamic route: validate the param exists
const { id } = Astro.params;
if (!id) return Astro.redirect('/');
---
```

### Layouts

Use a single layout component with `<slot />`:

```astro
---
// src/layouts/MainLayout.astro
interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
---
<html lang="en">
  <head>
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Performance Rules

### No Unnecessary `client:*`

Every `client:*` directive adds JavaScript to the bundle. Audit regularly:
- Static text → `.astro` component, no directive
- Interactive elements → `client:load` or `client:visible`

### Inline Styles for Critical CSS

For above-the-fold styles, prefer Tailwind classes. Avoid `<style>` blocks in Astro components unless necessary — use the global CSS file instead.

### Image Optimization

Use Astro's built-in `<Image>` component for local images:

```astro
import { Image } from 'astro:assets';
import heroImg from '../assets/hero.png';

<Image src={heroImg} alt="Hero" width={800} height={400} />
```

For remote images (from DB/CMS), use plain `<img>` with `loading="lazy"` and explicit `width`/`height`.

## SSR-Specific Patterns (output: 'server')

### Reading Request Data

```astro
---
// Headers, cookies, URL params
const cookie = Astro.cookies.get('session')?.value;
const url = Astro.url;
const searchParam = url.searchParams.get('q');
---
```

### Redirects

```astro
---
const session = Astro.cookies.get('session');
if (!session) {
  return Astro.redirect('/login');
}
---
```

### Response Headers

```astro
---
Astro.response.headers.set('Cache-Control', 'no-store');
---
```

## Passing Props to React Islands

Pass only serializable data (no functions, no class instances):

```astro
---
const service = await getServiceById(id); // plain object from DB
---

<!-- ✅ Correct: plain serializable props -->
<PaymentSidebar service={service} paymentDisclaimer={config.disclaimer} client:load />

<!-- ❌ Wrong: passing a DB connection or class instance -->
<Component db={dbConnection} client:load />
```

## TypeScript in Astro

Define `Props` interface in every component:

```astro
---
interface Props {
  title: string;
  items: string[];
  optional?: boolean;
}
const { title, items, optional = false } = Astro.props;
---
```

Use `import type` for type-only imports to avoid bundling runtime code:

```astro
---
import type { Service } from '../types';
---
```

## Error Handling

For data fetching errors, return a redirect or render an error state:

```astro
---
const service = await getServiceById(id).catch(() => null);
if (!service) return Astro.redirect('/404');
---
```

## Common Anti-Patterns to Avoid

- **Never** `import` from `'../../lib/db'` inside a React component — DB code must stay in `.astro` frontmatter or API routes
- **Never** use `document` or `window` in `.astro` frontmatter — it runs server-side
- **Never** use `fetch('/api/...')` from `.astro` to load its own data — fetch directly from the service
- **Avoid** deeply nested component trees with many `client:load` — consolidate interactive regions

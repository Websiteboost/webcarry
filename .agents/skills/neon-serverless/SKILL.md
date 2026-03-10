---
name: neon-serverless
description: Neon serverless PostgreSQL patterns using @neondatabase/serverless. Use when writing database queries, migrations, or data access code for Neon databases in serverless/edge environments.
metadata:
  author: custom
  version: "1.0.0"
---

# Neon Serverless PostgreSQL Best Practices

Guidelines for `@neondatabase/serverless` — the Neon driver for serverless and edge environments. This project uses the tagged template literal API (`sql`) via `src/lib/db.ts`.

## Setup

```ts
// src/lib/db.ts
import { neon } from '@neondatabase/serverless';

if (!import.meta.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const sql = neon(import.meta.env.DATABASE_URL);
```

## Query Patterns

### Basic SELECT

```ts
// ✅ Parameterized queries — ALWAYS use template literals, never string concatenation
const rows = await sql`
  SELECT id, title, price
  FROM services
  WHERE category_id = ${categoryId}
  ORDER BY display_order ASC
`;
```

### INSERT with RETURNING

```ts
const [newRow] = await sql`
  INSERT INTO services (title, price, category_id)
  VALUES (${title}, ${price}, ${categoryId})
  RETURNING id, title, created_at
`;
```

### UPDATE

```ts
await sql`
  UPDATE services
  SET title = ${title}, updated_at = NOW()
  WHERE id = ${id}
`;
```

### DELETE

```ts
await sql`
  DELETE FROM service_prices
  WHERE service_id = ${serviceId}
    AND type = ${type}
`;
```

## Security — Preventing SQL Injection

**ALWAYS** use template literal interpolation — never string concatenation or template string without the `sql` tag:

```ts
// ✅ CORRECT — parameterized, safe
const rows = await sql`SELECT * FROM services WHERE id = ${userId}`;

// ❌ NEVER DO THIS — SQL injection vulnerability
const rows = await sql([`SELECT * FROM services WHERE id = ${userId}`] as any);
// ❌ NEVER DO THIS
const query = `SELECT * FROM services WHERE id = '${userId}'`;
const rows = await sql([query] as any);
```

The `sql` tagged template literal automatically parameterizes all interpolated values.

## TypeScript Typing

Cast results to interfaces that match your SELECT columns:

```ts
interface ServiceRow {
  id: string;
  title: string;
  category_id: string;
  price: number;
  display_order: number;
  required: boolean;
  created_at: Date;
}

const rows = await sql`
  SELECT id, title, category_id, price, display_order, required, created_at
  FROM services
  ORDER BY display_order ASC
` as ServiceRow[];
```

Only include columns in the interface that you actually SELECT — don't select `*` and then ignore columns.

## Performance Patterns

### Parallel Queries

```ts
// ✅ Run independent queries in parallel
const [services, config] = await Promise.all([
  sql`SELECT * FROM services WHERE category_id = ${categoryId}`,
  sql`SELECT * FROM site_config WHERE id = 1 LIMIT 1`,
]);
```

### Avoid N+1 Queries

```ts
// ❌ N+1 pattern — one query per service
const services = await sql`SELECT * FROM services`;
for (const service of services) {
  service.prices = await sql`SELECT * FROM service_prices WHERE service_id = ${service.id}`;
}

// ✅ Use JOIN or fetch all related records in one query
const prices = await sql`
  SELECT sp.*
  FROM service_prices sp
  WHERE sp.service_id = ANY(${serviceIds})
  ORDER BY sp.service_id, sp.display_order ASC
`;
// Then group by service_id in JS
```

### Use LIMIT on Single-Row Queries

```ts
// ✅ Always LIMIT 1 when expecting one row
const [config] = await sql`
  SELECT payment_disclaimer
  FROM site_config
  WHERE id = 1
  LIMIT 1
`;
```

## Transactions

For operations that must succeed or fail together:

```ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Use transaction() for atomicity
await sql.transaction(async (tx) => {
  await tx`INSERT INTO orders (user_id, total) VALUES (${userId}, ${total})`;
  await tx`UPDATE inventory SET stock = stock - 1 WHERE id = ${itemId}`;
});
```

## JSONB Columns

Neon automatically parses JSONB columns into JavaScript objects:

```ts
interface ServicePriceRow {
  id: string;
  type: string;
  config: Record<string, any>; // JSONB is auto-parsed
  display_order: number;
  required: boolean;
}

const prices = await sql`
  SELECT id, type, config, display_order, required
  FROM service_prices
  WHERE service_id = ${serviceId}
  ORDER BY display_order ASC, created_at ASC
` as ServicePriceRow[];

// config is already a JS object, no JSON.parse() needed
const label = prices[0].config.label;
```

## Array Columns

PostgreSQL arrays (TEXT[], INTEGER[]) are returned as JS arrays:

```ts
interface ServiceRow {
  description: string[];  // TEXT[] column → string[]
  service_points: string[] | null;
}
```

## Error Handling

```ts
export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const rows = await sql`
      SELECT * FROM services WHERE id = ${id} LIMIT 1
    ` as ServiceRow[];
    
    return rows.length > 0 ? buildService(rows[0]) : null;
  } catch (error) {
    console.error(`Failed to fetch service ${id}:`, error);
    throw new Error(`Database error: ${error instanceof Error ? error.message : 'unknown'}`);
  }
}
```

## Environment Variables

```ts
// In Astro SSR: use import.meta.env
const sql = neon(import.meta.env.DATABASE_URL);

// In Node.js / API routes without Vite: use process.env
const sql = neon(process.env.DATABASE_URL!);
```

Never hardcode connection strings. Never log or expose `DATABASE_URL`.

## Common Anti-Patterns

- **Never** use `neon()` inside a React component — the `@neondatabase/serverless` package is server-only
- **Never** use string concatenation for query parameters — always use tagged template interpolation
- **Never** select `*` in production queries — list columns explicitly for clarity and to avoid breaking changes
- **Avoid** creating a new `neon()` instance per request — create it once at module level (as done in `src/lib/db.ts`)
- **Avoid** sequential `await` for independent queries — use `Promise.all()`

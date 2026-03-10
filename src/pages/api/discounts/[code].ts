import type { APIRoute } from 'astro';
import { sql } from '../../../lib/db';

// Only allow safe characters in the code before hitting the DB
const SAFE_CODE_RE = /^[A-Z0-9_\-]{1,50}$/;

export const GET: APIRoute = async ({ params }) => {
  const raw = params.code ?? '';
  const code = raw.trim().toUpperCase();

  if (!SAFE_CODE_RE.test(code)) {
    return new Response(
      JSON.stringify({ error: 'Invalid discount code format.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const rows = await sql`
      SELECT code, discount_type, discount_value, expires_at
      FROM discount_codes
      WHERE code = ${code}
        AND active = true
        AND (expires_at IS NULL OR expires_at > NOW())
      LIMIT 1
    `;

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired discount code.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const row = rows[0];
    return new Response(
      JSON.stringify({
        code: row.code,
        discount_type: row.discount_type,
        discount_value: Number(row.discount_value),
        expires_at: row.expires_at ?? null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[discount endpoint]', err);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

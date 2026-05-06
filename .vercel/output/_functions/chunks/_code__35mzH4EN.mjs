import { s as sql } from './db_B9rpJ2n0.mjs';

const SAFE_CODE_RE = /^[A-Z0-9_\-]{1,50}$/;
const GET = async ({ params }) => {
  const raw = params.code ?? "";
  const code = raw.trim().toUpperCase();
  if (!SAFE_CODE_RE.test(code)) {
    return new Response(
      JSON.stringify({ error: "Invalid discount code format." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
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
        JSON.stringify({ error: "Invalid or expired discount code." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const row = rows[0];
    return new Response(
      JSON.stringify({
        code: row.code,
        discount_type: row.discount_type,
        discount_value: Number(row.discount_value),
        expires_at: row.expires_at ?? null
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[discount endpoint]", err);
    return new Response(
      JSON.stringify({ error: "Server error. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

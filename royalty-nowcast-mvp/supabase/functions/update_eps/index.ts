import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async () => {
  try {
    // TODO: query earnings_reports grouped by platform (source), territory, ledger
    // eps = sum(gross_sek - fees_sek) / nullif(sum(units),0)
    // Apply shrinkage toward platform-level EU median when N < 5000 units
    // Upsert into eps_estimates with valid_from = today

    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500 });
  }
});
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    // TODO: Read file from storage bucket 'imports' (path provided in payload)
    // TODO: Detect format (CSV/PDF) and parse to normalized rows matching Statement_Normalized.csv
    // TODO: Insert rows into earnings_reports

    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500 });
  }
});
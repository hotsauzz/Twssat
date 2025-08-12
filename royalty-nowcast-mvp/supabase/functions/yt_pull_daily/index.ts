import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    // TODO: Authenticate using service role or JWT
    // TODO: Fetch connected channel IDs per artist from DB (artists.youtube_channel_id)
    // TODO: For each, call YouTube Analytics API for last 14 days by country
    // TODO: Map video->ISRC using mapping table (to be implemented)
    // TODO: Upsert into plays(date, 'youtube', territory, isrc, streams)

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
});
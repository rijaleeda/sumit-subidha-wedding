import { desc } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../../db";
import { rsvps } from "../../../../db/schema";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-admin-email",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request) {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const email = request.headers.get("x-admin-email")?.trim().toLowerCase() ?? "";
  const allowedEmails = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (!env.ADMIN_PASSWORD || supplied !== env.ADMIN_PASSWORD || !allowedEmails.includes(email)) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  const responses = await getDb().select().from(rsvps).orderBy(desc(rsvps.createdAt), desc(rsvps.id));
  return Response.json({ responses }, { headers: { ...corsHeaders, "Cache-Control": "no-store" } });
}

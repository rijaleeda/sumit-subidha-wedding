import { desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../../db";
import { rsvps } from "../../../../db/schema";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-admin-email",
  "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
};

function isAuthorized(request: Request) {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const email = request.headers.get("x-admin-email")?.trim().toLowerCase() ?? "";
  const allowedEmails = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(env.ADMIN_PASSWORD && supplied === env.ADMIN_PASSWORD && allowedEmails.includes(email));
}

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  const responses = await getDb().select().from(rsvps).orderBy(desc(rsvps.createdAt), desc(rsvps.id));
  return Response.json({ responses }, { headers: { ...corsHeaders, "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  try {
    const body = await request.json() as Record<string, unknown>;
    const id = Number(body.id);
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const attendance = body.attendance === "decline" ? "decline" : "accept";
    const count = (value: unknown, minimum = 0) => {
      const number = Number(value);
      return Number.isFinite(number) ? Math.min(10, Math.max(minimum, Math.floor(number))) : minimum;
    };
    if (!Number.isInteger(id) || id < 1 || !name) {
      return Response.json({ error: "Valid attendee and name are required" }, { status: 400, headers: corsHeaders });
    }
    const adults = attendance === "accept" ? count(body.adults, 1) : 0;
    const children = attendance === "accept" ? count(body.children) : 0;
    const infants = attendance === "accept" ? count(body.infants) : 0;
    const note = typeof body.note === "string" ? body.note.trim().slice(0, 1000) : "";
    await getDb().update(rsvps).set({
      name, attendance, adults, children, infants,
      guests: adults + children + infants,
      note,
    }).where(eq(rsvps.id, id));
    return Response.json({ ok: true }, { headers: corsHeaders });
  } catch {
    return Response.json({ error: "Unable to update attendee" }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Valid attendee is required" }, { status: 400, headers: corsHeaders });
  }
  try {
    await getDb().delete(rsvps).where(eq(rsvps.id, id));
    return Response.json({ ok: true }, { headers: corsHeaders });
  } catch {
    return Response.json({ error: "Unable to delete attendee" }, { status: 500, headers: corsHeaders });
  }
}

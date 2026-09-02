import { getDb } from "../../../db";
import { rsvps } from "../../../db/schema";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try { const body = await request.json() as {name?:unknown;attendance?:unknown;adults?:unknown;children?:unknown;infants?:unknown;note?:unknown}; const name=typeof body.name==="string"?body.name.trim().slice(0,120):""; const attendance=body.attendance==="decline"?"decline":"accept"; const count=(value:unknown,min=0)=>{const n=Number(value);return Number.isFinite(n)?Math.min(10,Math.max(min,Math.floor(n))):min}; const adults=attendance==="accept"?count(body.adults,1):0; const children=attendance==="accept"?count(body.children):0; const infants=attendance==="accept"?count(body.infants):0; const guests=adults+children+infants; const note=typeof body.note==="string"?body.note.trim().slice(0,1000):""; if(!name)return Response.json({error:"Name is required"},{status:400,headers:corsHeaders}); await getDb().insert(rsvps).values({name,attendance,guests,adults,children,infants,note}); return Response.json({ok:true},{status:201,headers:corsHeaders}); } catch { return Response.json({error:"Unable to save RSVP"},{status:500,headers:corsHeaders}); }
}

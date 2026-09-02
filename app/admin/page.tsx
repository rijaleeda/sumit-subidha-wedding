import { desc, eq, sql } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { requireChatGPTUser } from "../chatgpt-auth";
import { getDb } from "../../db";
import { rsvps } from "../../db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  if (!env.ADMIN_EMAIL || user.email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) {
    return <main className="min-h-screen bg-[#f7f3ea] p-8 text-[#2b2925]"><div className="mx-auto max-w-xl border border-[#cdbb91] bg-white p-8 text-center"><h1 className="font-serif text-3xl text-[#781d18]">Access denied</h1><p className="mt-3 text-base text-[#625a50]">This dashboard is available only to the wedding organizer.</p></div></main>;
  }

  const db = getDb();
  const [responses, attendingCount, totals] = await Promise.all([
    db.select().from(rsvps).orderBy(desc(rsvps.createdAt), desc(rsvps.id)),
    db.select({ count: sql<number>`count(*)` }).from(rsvps).where(eq(rsvps.attendance, "accept")),
    db.select({ adults: sql<number>`coalesce(sum(${rsvps.adults}), 0)`, children: sql<number>`coalesce(sum(${rsvps.children}), 0)`, infants: sql<number>`coalesce(sum(${rsvps.infants}), 0)` }).from(rsvps).where(eq(rsvps.attendance, "accept")),
  ]);
  const declined = responses.filter((item) => item.attendance === "decline").length;
  const summary = totals[0] ?? { adults: 0, children: 0, infants: 0 };

  return <main className="min-h-screen bg-[#f3eee4] px-4 py-8 text-[#2b2925] sm:px-8">
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-col gap-2 border-b border-[#cdbb91] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.24em] text-[#927033]">Sumit &amp; Subidha</p><h1 className="mt-2 font-serif text-4xl font-normal text-[#781d18]">RSVP Dashboard</h1></div><p className="text-sm text-[#70685d]">Signed in as {user.email}</p></header>

      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Summary label="Responses" value={responses.length}/><Summary label="Attending" value={attendingCount[0]?.count ?? 0}/><Summary label="Adults" value={summary.adults}/><Summary label="Children" value={summary.children}/><Summary label="Infants" value={summary.infants}/><Summary label="Declined" value={declined}/>
      </section>

      <section className="overflow-hidden border border-[#cdbb91] bg-[#fffdf8]">
        <div className="border-b border-[#ded3bd] px-5 py-4"><h2 className="font-serif text-2xl font-normal text-[#681d19]">Guest responses</h2></div>
        {responses.length === 0 ? <div className="px-6 py-14 text-center text-base text-[#70685d]">No RSVPs yet.</div> : <div className="overflow-x-auto"><Table><TableHeader><TableRow className="border-[#ded3bd] bg-[#f5f0e6]"><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead className="text-center">Adults</TableHead><TableHead className="text-center">Children</TableHead><TableHead className="text-center">Infants</TableHead><TableHead>Note</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{responses.map((response) => <TableRow key={response.id} className="border-[#e7decc]"><TableCell className="font-medium">{response.name}</TableCell><TableCell><span className={response.attendance === "accept" ? "text-[#47704b]" : "text-[#8b3c38]"}>{response.attendance === "accept" ? "Attending" : "Declined"}</span></TableCell><TableCell className="text-center">{response.adults}</TableCell><TableCell className="text-center">{response.children}</TableCell><TableCell className="text-center">{response.infants}</TableCell><TableCell className="max-w-xs whitespace-normal text-[#625c53]">{response.note || "—"}</TableCell><TableCell className="whitespace-nowrap text-[#70685d]">{new Date(response.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell></TableRow>)}</TableBody></Table></div>}
      </section>
    </div>
  </main>;
}

function Summary({ label, value }: { label: string; value: number }) {
  return <div className="border border-[#d5c6a7] bg-[#fffdf8] p-4"><p className="text-xs uppercase tracking-[.14em] text-[#70685d]">{label}</p><p className="mt-2 font-serif text-3xl text-[#781d18]">{value}</p></div>;
}

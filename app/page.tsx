"use client";
import { FormEvent, useState } from "react";
import { Heart } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Home() {
  const [attendance,setAttendance]=useState("accept");
  const [status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
  async function submitRsvp(event:FormEvent<HTMLFormElement>){event.preventDefault();setStatus("sending");const form=event.currentTarget;const data=new FormData(form);try{const response=await fetch("/api/rsvp",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:data.get("name"),attendance,adults:data.get("adults"),children:data.get("children"),infants:data.get("infants"),note:data.get("note")})});if(!response.ok)throw new Error();setStatus("success");form.reset()}catch{setStatus("error")}}
  return <main className="invitation-page">
    <section className="invitation-copy" aria-labelledby="couple-names">
      <p className="ganesh">श्री गणेशाय नमः</p><p className="family-line">Together with their families</p>
      <h1 id="couple-names"><em>Sumit</em><span>&amp;</span><em>Subidha</em></h1>
      <p className="invite-line">invite you to celebrate their wedding</p><div className="ornament" aria-hidden="true"><span/>◆<span/></div>
      <p className="date">December 12, 2026</p><p className="location">Houston, Texas</p>
    </section>
    <section className="rsvp-card" id="rsvp" aria-labelledby="rsvp-title">
      {status==="success"?<div className="success"><Heart aria-hidden="true"/><h2 id="rsvp-title">Thank you</h2><p>Your response has been received.</p><button onClick={()=>setStatus("idle")}>Submit another response</button></div>:<>
        <div className="form-heading"><p>Kindly respond</p><h2 id="rsvp-title">RSVP</h2></div>
        <form onSubmit={submitRsvp}><label>Full name<input name="name" required autoComplete="name" placeholder="Your name"/></label><fieldset><legend>Will you be attending?</legend><RadioGroup className="attendance" value={attendance} onValueChange={setAttendance}><label><RadioGroupItem value="accept"/>Joyfully accept</label><label><RadioGroupItem value="decline"/>Regretfully decline</label></RadioGroup></fieldset>{attendance==="accept"&&<fieldset className="guest-counts"><legend>Number attending</legend><div className="guest-grid"><label>Adults<input name="adults" aria-label="Number of adults" type="number" inputMode="numeric" min="1" max="10" defaultValue="1"/></label><label>Children<input name="children" aria-label="Number of children" type="number" inputMode="numeric" min="0" max="10" defaultValue="0"/></label><label>Infants <span>(under 2)</span><input name="infants" aria-label="Number of infants under 2" type="number" inputMode="numeric" min="0" max="10" defaultValue="0"/></label></div></fieldset>}<label>Note <span>(optional)</span><textarea name="note" rows={3} placeholder="Well wishes or questions…"/></label><button className="submit" disabled={status==="sending"}>{status==="sending"?"Sending…":"Send RSVP"}</button>{status==="error"&&<p className="error">We could not save your response. Please try again.</p>}</form>
      </>}
    </section>
  </main>
}

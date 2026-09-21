"use client";
import { FormEvent, useState } from "react";
import { Heart } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Home() {
  const [attendance,setAttendance]=useState("accept");
  const [status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
  async function submitRsvp(event:FormEvent<HTMLFormElement>){event.preventDefault();setStatus("sending");const form=event.currentTarget;const data=new FormData(form);try{const response=await fetch("/api/rsvp",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:data.get("name"),attendance,adults:data.get("adults"),children:data.get("children"),infants:data.get("infants"),note:data.get("note")})});if(!response.ok)throw new Error();setStatus("success");form.reset()}catch{setStatus("error")}}
  return <>
    <header className="site-header">
      <a className="site-mark" href="#home" aria-label="Sumit and Subidha wedding home">S <span>&amp;</span> S</a>
      <nav aria-label="Wedding website navigation">
        <a href="#home">Home</a><a href="#rsvp">RSVP</a><a href="#registry">Registry</a><a href="#travel">Travel</a>
      </nav>
    </header>
    <main className="invitation-page">
    <section className="invitation-copy" id="home" aria-labelledby="couple-names">
      <p className="ganesh">श्री गणेशाय नमः</p><p className="family-line">Together with their families</p>
      <h1 id="couple-names"><em>Sumit</em><span>&amp;</span><em>Subidha</em></h1>
      <p className="invite-line">invite you to celebrate their wedding</p><div className="ornament" aria-hidden="true"><span/>◆<span/></div>
      <p className="date">December 12, 2026</p>
      <p className="venue">Rosa Villa</p>
      <a className="address" href="https://www.google.com/maps/search/?api=1&query=Rosa+Villa%2C+1282+County+Rd+381+S%2C+Cleveland%2C+TX+77328" target="_blank" rel="noopener noreferrer">1282 County Rd 381 S, Cleveland, TX 77328</a>
      <div className="event-actions"><a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sumit%20%26%20Subidha%20Wedding&dates=20261212%2F20261213&location=Rosa%20Villa%2C%201282%20County%20Rd%20381%20S%2C%20Cleveland%2C%20TX%2077328&details=Wedding%20celebration%20for%20Sumit%20and%20Subidha" target="_blank" rel="noopener noreferrer">Add to calendar</a><a href="https://www.google.com/maps/search/?api=1&query=Rosa+Villa%2C+1282+County+Rd+381+S%2C+Cleveland%2C+TX+77328" target="_blank" rel="noopener noreferrer">Open in Maps</a></div>
    </section>
    <section className="rsvp-card" id="rsvp" aria-labelledby="rsvp-title">
      {status==="success"?<div className="success"><Heart aria-hidden="true"/><h2 id="rsvp-title">Thank you</h2><p>Your response has been received.</p><button onClick={()=>setStatus("idle")}>Submit another response</button></div>:<>
        <div className="form-heading"><p>Kindly respond</p><h2 id="rsvp-title">RSVP</h2></div>
        <form onSubmit={submitRsvp}><label>Full name<input name="name" required autoComplete="name" placeholder="Your name"/></label><fieldset><legend>Will you be attending?</legend><RadioGroup className="attendance" value={attendance} onValueChange={setAttendance}><label><RadioGroupItem value="accept"/>Joyfully accept</label><label><RadioGroupItem value="decline"/>Regretfully decline</label></RadioGroup></fieldset>{attendance==="accept"&&<fieldset className="guest-counts"><legend>Number attending</legend><div className="guest-grid"><label>Adults<input name="adults" aria-label="Number of adults" type="number" inputMode="numeric" min="1" max="10" defaultValue="1"/></label><label>Children<input name="children" aria-label="Number of children" type="number" inputMode="numeric" min="0" max="10" defaultValue="0"/></label><label>Infants <span>(under 2)</span><input name="infants" aria-label="Number of infants under 2" type="number" inputMode="numeric" min="0" max="10" defaultValue="0"/></label></div></fieldset>}<label>Note <span>(optional)</span><textarea name="note" rows={3} placeholder="Well wishes or questions…"/></label><button className="submit" disabled={status==="sending"}>{status==="sending"?"Sending…":"Send RSVP"}</button>{status==="error"&&<p className="error">We could not save your response. Please try again.</p>}</form>
      </>}
    </section>
    <section className="registry-card" id="registry" aria-labelledby="registry-title">
      <p className="registry-kicker">With love</p>
      <h2 id="registry-title">Wedding Registry</h2>
      <p>Your presence is the greatest gift. For those who wish to celebrate with a gift, we have created an Amazon wedding registry.</p>
      <a href="https://www.amazon.com/wedding/guest-view/2KATNO8WJ1CN5" target="_blank" rel="noopener noreferrer">View Our Registry</a>
    </section>
    <section className="travel-card" id="travel" aria-labelledby="travel-title">
      <div className="section-heading"><p>Plan your visit</p><h2 id="travel-title">Travel &amp; Stay</h2><span>Helpful places for our out-of-town guests</span></div>
      <div className="travel-group">
        <div className="travel-group-heading"><h3>Nearby hotels</h3><a href="https://www.google.com/maps/search/?api=1&query=hotels+near+Rosa+Villa%2C+1282+County+Rd+381+S%2C+Cleveland%2C+TX+77328" target="_blank" rel="noopener noreferrer">See all nearby</a></div>
        <article className="travel-item"><div><h4>Holiday Inn Express &amp; Suites Cleveland</h4><p>600 Hwy 59 South, Cleveland, TX 77327</p></div><a href="https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Express+%26+Suites+Cleveland%2C+600+Hwy+59+South%2C+Cleveland%2C+TX+77327" target="_blank" rel="noopener noreferrer">Directions</a></article>
        <article className="travel-item"><div><h4>Best Western Cleveland Inn &amp; Suites</h4><p>708 Highway 59 S, Cleveland, TX 77328</p></div><a href="https://www.google.com/maps/search/?api=1&query=Best+Western+Cleveland+Inn+%26+Suites%2C+708+Highway+59+S%2C+Cleveland%2C+TX+77328" target="_blank" rel="noopener noreferrer">Directions</a></article>
        <article className="travel-item"><div><h4>Houston CityPlace Marriott</h4><p>Springwoods Village, Spring</p></div><a href="https://www.marriott.com/en-us/hotels/houns-houston-cityplace-marriott-at-springwoods-village/overview/" target="_blank" rel="noopener noreferrer">View hotel</a></article>
        <article className="travel-item"><div><h4>SpringHill Suites Houston The Woodlands</h4><p>The Woodlands</p></div><a href="https://www.marriott.com/en-us/hotels/houln-springhill-suites-houston-the-woodlands/overview/" target="_blank" rel="noopener noreferrer">View hotel</a></article>
        <article className="travel-item"><div><h4>Courtyard Houston Kingwood</h4><p>Kingwood</p></div><a href="https://www.marriott.com/en-us/hotels/houkw-courtyard-houston-kingwood/overview/" target="_blank" rel="noopener noreferrer">View hotel</a></article>
        <article className="travel-item"><div><h4>TownePlace Suites Conroe</h4><p>Conroe</p></div><a href="https://www.marriott.com/en-us/hotels/houto-towneplace-suites-conroe/overview/" target="_blank" rel="noopener noreferrer">View hotel</a></article>
      </div>
      <div className="travel-group attractions">
        <div className="travel-group-heading"><h3>Explore nearby</h3></div>
        <article className="travel-item"><div><h4>Sam Houston National Forest</h4><p>Wooded trails, scenic drives, and peaceful East Texas nature.</p></div><a href="https://www.google.com/maps/search/?api=1&query=Sam+Houston+National+Forest" target="_blank" rel="noopener noreferrer">Explore</a></article>
        <article className="travel-item"><div><h4>Double Lake Recreation Area</h4><p>A lakeside destination for hiking, fishing, and picnicking.</p></div><a href="https://www.google.com/maps/search/?api=1&query=Double+Lake+Recreation+Area%2C+TX" target="_blank" rel="noopener noreferrer">Explore</a></article>
        <article className="travel-item"><div><h4>NASA Johnson Space Center</h4><p>Explore Houston&apos;s connection to human spaceflight.</p></div><a href="https://www.nasa.gov/johnson/" target="_blank" rel="noopener noreferrer">Visit site</a></article>
        <article className="travel-item"><div><h4>Hermann Park</h4><p>Gardens, trails, and cultural attractions in central Houston.</p></div><a href="https://hermannpark.org/" target="_blank" rel="noopener noreferrer">Visit site</a></article>
        <article className="travel-item"><div><h4>Kemah Boardwalk</h4><p>Waterfront dining, rides, and family entertainment.</p></div><a href="https://www.kemahboardwalk.com/" target="_blank" rel="noopener noreferrer">Visit site</a></article>
      </div>
    </section>
  </main>
  </>
}

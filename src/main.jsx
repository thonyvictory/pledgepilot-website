import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, ArrowUpRight, Target, Megaphone, Users, BarChart3, Search,
  Mail, Menu, X, Rocket, CheckCircle2, Globe2, Lightbulb, Clapperboard,
  MonitorSmartphone, FileText, ChevronDown,
  MessageCircle, Send, ExternalLink, ShieldCheck, Layers, PlayCircle
} from "lucide-react";
import "./styles.css";

const services = [
  {icon:Target,title:"Pre-Launch Strategy & Validation",desc:"Prepare your project with clear positioning, audience research, funding-goal assessment and a practical pre-launch plan.",items:["Funding goal & budget planning","Platform selection: Kickstarter or Indiegogo","Audience research & validation","Pre-launch landing pages & lead generation","Reward tier and pricing strategy","Early-bird and pre-launch marketing"]},
  {icon:FileText,title:"Campaign Page Creation & Optimization",desc:"Present your project with clear storytelling, persuasive copy and a campaign page designed to communicate value.",items:["Campaign storytelling & copywriting","Campaign page structure & design","Title and description optimization","Audience research & targeting","Campaign SEO optimization","Infographics, GIFs and promotional graphics"]},
  {icon:Megaphone,title:"Launch Marketing & Campaign Management",desc:"Coordinate promotional activity around your launch and support your live campaign with audience-focused marketing.",items:["Launch-day marketing coordination","Press release and media outreach","Influencer collaboration","Paid advertising management","Direct outreach and targeted promotion","Email marketing and community engagement","Campaign updates and performance monitoring"]},
  {icon:Users,title:"Backer Audience & Email List Building",desc:"Build a relevant, permission-based audience and create a communication path that helps interested people follow your project.",items:["Backer audience research","Target audience identification","Lead generation and landing pages","Email capture and segmentation","Lead nurturing campaigns","Pre-launch email communication"]},
  {icon:Clapperboard,title:"Professional Crowdfunding Video Production",desc:"Explain your idea through clear, engaging video content built around your project, product and audience.",items:["Video concept development","Scriptwriting and storyboarding","Crowdfunding storytelling","Product presentation videos","Promotional and short-form content","Editing and post-production"]},
  {icon:MonitorSmartphone,title:"Crowdfunding Website & Landing Page Design",desc:"Give your project a focused online presence with responsive pages that introduce the idea and encourage meaningful action.",items:["Crowdfunding website design","Campaign and pre-launch landing pages","Lead capture pages","Product and project presentation","Call-to-action optimization","Mobile-responsive layouts"]},
  {icon:FileText,title:"Grant Funding Research & Proposal Development",desc:"Identify relevant grant opportunities and prepare clear, well-organized proposal materials. Grant decisions remain with funders.",items:["Grant opportunity research","Funding opportunity identification","Eligibility assessment","Project positioning","Grant proposal writing","Application preparation and review","Budget narrative and supporting documents"]}
];

const steps = [
  ["01","Discovery & Project Assessment","We learn about your project, objectives, funding goals, target audience and current campaign stage."],
  ["02","Research & Strategic Planning","We assess the audience, relevant competitors and opportunities, then shape a practical marketing strategy."],
  ["03","Campaign Preparation","We develop campaign messaging, promotional materials and the audience-building foundations needed for launch."],
  ["04","Marketing & Promotion","We execute the agreed activities across relevant channels, which may include email, advertising, press outreach and community engagement."],
  ["05","Monitoring & Optimization","We monitor activity and engagement, review performance data and make adjustments where appropriate."],
  ["06","Reporting & Continued Support","We share progress updates, review results and identify opportunities to improve visibility and campaign momentum."]
];

const faqs = [
  ["Which crowdfunding platforms does PledgePilot specialize in?","We specialize in Kickstarter and Indiegogo."],
  ["Can you help before my campaign launches?","Yes. Support can include audience research, pre-launch strategy, landing pages, lead generation, reward planning and campaign preparation."],
  ["Can you support a campaign that is already live?","Yes. We can assess the campaign's current position and recommend relevant marketing and audience-engagement support."],
  ["Do you guarantee a funding result?","No. Crowdfunding outcomes depend on many factors, including the project, audience, offer, timing and market response. We focus on strategy and marketing execution, not guaranteed funding."],
  ["Are advertising costs included in your service fees?","No. Professional service fees and promotional expenses such as advertising or sponsored placements are discussed separately."],
  ["Do you help with grant proposals?","We provide grant opportunity research and proposal-development support. Funding decisions are made by the grant provider."]
];

const socials = [
  {name:"TikTok",href:"https://www.tiktok.com/@pledgepilot",label:"TikTok"},
  {name:"X",href:"https://x.com/PledgePilot",label:"X"},
  {name:"Instagram",href:"https://www.instagram.com/pledgepilot/",label:"Instagram"},
  {name:"Facebook",href:"https://web.facebook.com/profile.php?id=61594922333588",label:"Facebook"}
];

function SocialIcon({name}) {
  if (name === "TikTok") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.6 7.2a6.8 6.8 0 0 1-4.2-1.5v8.1a5.8 5.8 0 1 1-5-5.7v3a2.8 2.8 0 1 0 2 2.7V2.5h3a3.9 3.9 0 0 0 4.2 3.8z"/></svg>;
  if (name === "Instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.8" r="1.2" fill="currentColor"/></svg>;
  if (name === "Facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8z"/></svg>;
  return <span className="x-icon">𝕏</span>;
}

function App(){
  const [page,setPage] = useState(window.location.hash.replace("#","") || "home");
  const [menuOpen,setMenuOpen] = useState(false);
  const [faqOpen,setFaqOpen] = useState(0);
  const [campaigns,setCampaigns] = useState([]);
  const [query,setQuery] = useState("");
  const [visible,setVisible] = useState(12);
  const [selectedImage,setSelectedImage] = useState(null);
  const [form,setForm] = useState({name:"",email:"",link:"",stage:"",message:""});
  const [newsletter,setNewsletter] = useState("");
  const [newsletterStatus,setNewsletterStatus] = useState("");
  const [newsletterLoading,setNewsletterLoading] = useState(false);
  const [contactStatus,setContactStatus] = useState("");
  const [contactLoading,setContactLoading] = useState(false);

  useEffect(()=>{
    const sync=()=>setPage(window.location.hash.replace("#","") || "home");
    window.addEventListener("hashchange",sync);
    fetch("/campaigns.json").then(r=>r.json()).then(setCampaigns).catch(()=>{});
    return ()=>window.removeEventListener("hashchange",sync);
  },[]);

  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});setMenuOpen(false)},[page]);

  const go=(p)=>{window.location.hash=p};

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return campaigns;
    const aliases={
      game:["game","games","gaming","tabletop","video game","video games","board game","board games","gaming hardware"],
      tech:["technology","tech","gadgets","electronics","hardware","software"],
      art:["art","illustration","design","creative","comics","graphic novel"],
      fashion:["fashion","apparel","clothing","wearables"],
      film:["film","movie","cinema","video"],
      music:["music","audio","instrument"]
    };
    const normalized=(q==="games"||q==="gaming")?"game":q;
    const terms=aliases[normalized]||[q];
    return campaigns.filter(c=>{
      const category=String(c.category||"").toLowerCase();
      return terms.some(term=>category.includes(term) || term.includes(category));
    });
  },[campaigns,query]);

  const money=(value,currency)=>new Intl.NumberFormat("en-US",{style:"currency",currency,maximumFractionDigits:0}).format(value);

  const submitContact = async (e) => {
    e.preventDefault();
    setContactStatus("");
    setContactLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send enquiry.");
      }

      setContactStatus("success");
      setForm({name:"",email:"",link:"",stage:"",message:""});
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setContactStatus("error");
    } finally {
      setContactLoading(false);
    }
  };

  // Newsletter subscription: sends the email address to the Cloudflare Pages Function.
  const submitNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterStatus("");
    setNewsletterLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletter })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to complete your subscription.");
      }

      setNewsletterStatus(result.alreadySubscribed ? "already" : "success");
      setNewsletter("");
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
      setNewsletterStatus("error");
    } finally {
      setNewsletterLoading(false);
    }
  };

  const Header=()=> <header className="header"><div className="container nav-wrap">
    <a className="brand" href="#home" onClick={()=>setPage("home")} aria-label="PledgePilot home"><img src="/images/pledgepilot-logo.png" alt=""/><span className="brand-copy"><strong><span>Pledge</span><span>Pilot</span></strong><small>ELEVATE YOUR SUCCESS</small></span></a>
    <button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen?<X/>:<Menu/>}</button>
    <nav className={menuOpen?"nav open":"nav"}>
      {["home","services","pricing","portfolio","process","about","contact"].map(p=><a key={p} className={page===p?"active":""} href={"#"+p}>{p==="home"?"Home":p[0].toUpperCase()+p.slice(1)}</a>)}
      <a className="nav-cta" href="#contact">Get Started <ArrowUpRight size={16}/></a>
    </nav>
  </div></header>;

  const Footer=()=> <footer className="footer"><div className="container footer-grid">
    <div className="footer-brand"><img src="/images/pledgepilot-logo.png" alt="PledgePilot"/><p>Strategic crowdfunding marketing for creators and businesses worldwide.</p><div className="social-row">{socials.map(s=><a href={s.href} key={s.name} target="_blank" rel="noreferrer" aria-label={s.label}><SocialIcon name={s.name}/></a>)}</div></div>
    <div><h4>Explore</h4><a href="#about">About PledgePilot</a><a href="#services">Services</a><a href="#pricing">Pricing</a><a href="#portfolio">Portfolio</a><a href="#process">Our Process</a></div>
    <div><h4>Specialist Platforms</h4><a href="https://www.kickstarter.com/" target="_blank" rel="noreferrer">Kickstarter <ExternalLink size={13}/></a><a href="https://www.indiegogo.com/" target="_blank" rel="noreferrer">Indiegogo <ExternalLink size={13}/></a><h4 className="footer-subhead">Contact</h4><a href="mailto:contact@pledgepilot.online"><Mail size={15}/> contact@pledgepilot.online</a><a href="https://wa.me/15709271401" target="_blank" rel="noreferrer"><MessageCircle size={15}/> +1 570-927-1401</a></div>
    <div><h4>Start a Conversation</h4><p>Tell us where your project is today and what kind of support you need.</p><a className="footer-link-cta" href="#contact">Contact our team <ArrowRight size={15}/></a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} PledgePilot. All rights reserved.</span><span>Serving creators and businesses worldwide.</span></div></footer>;

  const PageIntro=({eyebrow,title,desc})=><section className="page-intro"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div></section>;

  const Newsletter=()=> <section className="newsletter"><div className="container newsletter-inner">
    <div>
      <span className="eyebrow">THE PLEDGEPILOT BRIEF</span>
      <h2>Stay ahead of your <em>next campaign.</em></h2>
      <p>Get practical crowdfunding insights, campaign strategies and marketing updates delivered to your inbox.</p>
    </div>
    <form onSubmit={submitNewsletter}>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email address"
        value={newsletter}
        onChange={e=>setNewsletter(e.target.value)}
        disabled={newsletterLoading}
      />
      <button className="btn btn-primary" type="submit" disabled={newsletterLoading}>
        {newsletterLoading ? "Subscribing..." : "Subscribe"}
        {!newsletterLoading && <ArrowRight size={16}/>}
      </button>

      {newsletterStatus === "success" && <small role="status" style={{display:"block",color:"#15803d",marginTop:"10px"}}>You're subscribed. Please check your inbox for a welcome email.</small>}
      {newsletterStatus === "already" && <small role="status" style={{display:"block",color:"#1764df",marginTop:"10px"}}>This email is already subscribed to PledgePilot updates.</small>}
      {newsletterStatus === "error" && <small role="alert" style={{display:"block",color:"#b91c1c",marginTop:"10px"}}>We couldn't complete your subscription. Please check your email address and try again.</small>}

      <small>By subscribing, you agree to receive email updates. You can unsubscribe from future newsletters at any time.</small>
    </form>
  </div></section>;

  const Services=()=> <><PageIntro eyebrow="OUR SERVICES" title={<>Practical support for your <em>crowdfunding goals.</em></>} desc="From early-stage planning to campaign promotion and grant proposal development, explore the services PledgePilot can provide."/><section className="section"><div className="container service-detail-grid">{services.map((s,i)=><article className="service-detail" key={s.title}><div className="service-icon"><s.icon/></div><span className="service-number">SERVICE 0{i+1}</span><h2>{s.title}</h2><p>{s.desc}</p><ul>{s.items.map(x=><li key={x}><CheckCircle2/>{x}</li>)}</ul><a className="text-link" href="#contact">Discuss this service <ArrowRight size={15}/></a></article>)}</div></section><div className="simple-cta"><div className="container"><h2>Not sure which service you need?</h2><p>Tell us about your project and we'll discuss a suitable next step.</p><a className="btn btn-primary" href="#contact">Talk to our team <ArrowRight size={16}/></a></div></div></>;

  const Pricing=()=> <><PageIntro eyebrow="PRICING" title={<>A service structure shaped around <em>your campaign.</em></>} desc="We tailor our recommendations to your campaign stage, objectives, scope of work and the level of support required."/><section className="section"><div className="container pricing-content"><article><span className="eyebrow">FLEXIBLE CAMPAIGN SUPPORT</span><h2>How our pricing works</h2><p>Every crowdfunding campaign has different goals, requirements and marketing needs. Some creators are preparing for launch, while others already have active campaigns that require additional visibility, audience engagement or ongoing marketing support.</p><p>At PledgePilot, we structure our pricing around your campaign's current stage, the services you require, the scope of work involved and the level of support needed. Rather than offering fixed packages that may not suit every project, we first assess your campaign to understand its needs and recommend an appropriate service structure and budget.</p><p>Once we understand your requirements, we will provide a tailored proposal outlining the recommended services, scope of work and associated costs.</p><h2>Marketing budget: service fees and promotional costs</h2><p>Our professional service fees cover the work, expertise and marketing support provided by PledgePilot. Promotional expenses, such as paid advertising, sponsored placements and other third-party marketing costs, are treated separately.</p><p>Where paid advertising or additional promotional activities are required, the associated budget is generally funded separately by the client. We will discuss these requirements beforehand so you understand how much is allocated to our services and how much is intended for promotional activities.</p><h2>No one-size-fits-all pricing</h2><p>Your project's category, funding objectives, target audience, current campaign performance and remaining campaign timeline can all influence the marketing support you need. Our recommendations are based on your specific requirements rather than a predetermined package.</p><a className="btn btn-primary" href="#contact">Request a campaign assessment <ArrowRight size={16}/></a></article><aside className="pricing-aside"><div className="aside-icon"><Target/></div><h3>A proposal shaped around your needs.</h3><p>We'll first understand your project, then outline the recommended services, scope and costs.</p><div className="aside-rule"></div><span><CheckCircle2/> Clear deliverables</span><span><CheckCircle2/> Transparent cost breakdown</span><span><CheckCircle2/> Promotional budget discussed separately</span></aside></div></section></>;

  const Portfolio=()=> <><PageIntro eyebrow="PORTFOLIO" title={<>Projects we've helped <em>bring to the audience.</em></>} desc="A selection of crowdfunding campaigns PledgePilot has supported through marketing and campaign management."/><section className="section analytics-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">MARKETING PERFORMANCE & ANALYTICS</span><h2>Performance snapshots.</h2><p>A visual selection of campaign marketing and audience analytics.</p></div></div><div className="analytics-grid">{[{src:"/images/email-analytics.jpg",alt:"Email campaign performance analytics"},{src:"/images/community-analytics.jpg",alt:"Crowdfunding backer community analytics"},{src:"/images/facebook-ads-analytics-temp.jpg",alt:"Facebook advertising analytics"}].map((im,i)=><button className="analytics-image" key={im.src} onClick={()=>setSelectedImage(im)}><img src={im.src} alt={im.alt}/><span>View image <ArrowUpRight size={15}/></span></button>)}</div><p className="privacy-note"><ShieldCheck size={15}/> Analytics images are presented as supplied. Replace or redact any sensitive or provisional information before public launch.</p></div></section><section className="section campaigns-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">FEATURED CROWDFUNDING CAMPAIGNS</span><h2>One gallery. <em>Many ideas.</em></h2><p>Explore selected crowdfunding projects across product, technology, creative and community-led categories.</p></div></div><div className="search-bar"><Search/><input placeholder="Search campaigns by category..." value={query} onChange={e=>{setQuery(e.target.value);setVisible(12)}}/></div><div className="campaign-grid">{filtered.slice(0,visible).map((c)=><article className="campaign-card" key={c.url}><div className="campaign-cover">{c.coverImage?<img src={c.coverImage} alt={`${c.title} campaign cover`} loading="lazy" referrerPolicy="no-referrer"/>:<div className="cover-mark" aria-label="Campaign cover image pending">PP</div>}<span>{c.coverImage?"Featured campaign":"Cover image pending"}</span></div><div className="campaign-info"><span className="campaign-platform">{c.platform.toUpperCase()} · {c.category.toUpperCase()}</span><h3>{c.title}</h3><div className="campaign-metrics"><div><small>Raised</small><b>{money(c.amountRaised,c.raisedCurrency)}</b></div><div><small>Goal</small><b>{money(c.fundingGoal,c.fundingCurrency)}</b></div><div><small>Backers</small><b>{Number(c.backers).toLocaleString("en-US")}</b></div></div><a href={c.url} target="_blank" rel="noreferrer">View original campaign <ArrowUpRight size={15}/></a></div></article>)}</div>{filtered.length===0&&<div className="empty-results"><Search/><h3>No campaigns found in that category</h3><p>Try a broader category such as games, technology, art or fashion.</p></div>}{visible<filtered.length&&<div className="load-more"><button className="btn btn-secondary" onClick={()=>setVisible(v=>v+12)}>Load more campaigns <ArrowRight size={16}/></button></div>}</div></section>{selectedImage&&<div className="lightbox" onClick={()=>setSelectedImage(null)}><button aria-label="Close image"><X/></button><img src={selectedImage.src} alt={selectedImage.alt}/></div>}</>;

  const Process=()=> <><PageIntro eyebrow="OUR PROCESS" title={<>A considered approach to <em>campaign growth.</em></>} desc="Every project is different. Our process gives the work structure while keeping the strategy responsive to your goals."/><section className="section"><div className="container process-detail">{steps.map(s=><div className="process-row" key={s[0]}><span className="process-index">{s[0]}</span><div><h2>{s[1]}</h2><p>{s[2]}</p></div><CheckCircle2/></div>)}</div></section><div className="simple-cta"><div className="container"><h2>Let's discuss your project.</h2><p>Start with a conversation about your goals and current stage.</p><a className="btn btn-primary" href="#contact">Start your project <ArrowRight size={16}/></a></div></div></>;

  const About=()=> <><PageIntro eyebrow="ABOUT PLEDGEPILOT" title={<>Helping promising ideas find their <em>relevant audience.</em></>} desc="PledgePilot is an international crowdfunding marketing agency serving creators, entrepreneurs and businesses worldwide."/><section className="section"><div className="container about-content"><div><span className="eyebrow">OUR APPROACH</span><h2>Strategy before noise.<br/><em>Purpose behind every action.</em></h2></div><div><p>We believe a strong crowdfunding campaign needs more than a compelling idea. It needs a clear story, a defined audience, thoughtful preparation and coordinated promotion.</p><p>Our work brings together research, campaign positioning, audience development and marketing execution. We support creators at different stages — from exploring crowdfunding for the first time to improving the visibility of an active campaign.</p><p>Our specialist platform focus is Kickstarter and Indiegogo. We work with clients internationally and tailor our recommendations to each project's needs.</p><a className="btn btn-primary" href="#contact">Talk with PledgePilot <ArrowRight size={16}/></a></div></div></section></>;

  const Contact=()=> <><PageIntro eyebrow="CONTACT" title={<>Let's talk about <em>what you're building.</em></>} desc="Whether you're exploring crowdfunding, preparing to launch or managing a live campaign, tell us what support you need."/><section className="section contact-section"><div className="container contact-grid"><div className="contact-info"><span className="eyebrow">GET IN TOUCH</span><h2>Start with a <em>conversation.</em></h2><p>Share a few details about your project. Our team can review your enquiry and discuss a suitable next step.</p><a href="mailto:contact@pledgepilot.online"><Mail/>contact@pledgepilot.online</a><a href="https://wa.me/15709271401" target="_blank" rel="noreferrer"><MessageCircle/>+1 570-927-1401</a><div className="contact-socials">{socials.map(s=><a href={s.href} key={s.name} target="_blank" rel="noreferrer"><SocialIcon name={s.name}/>{s.label}<ArrowUpRight size={13}/></a>)}</div><div className="contact-platforms"><span>PLATFORM SPECIALISTS</span><b>Kickstarter</b><b>Indiegogo</b></div></div><form className="contact-form" onSubmit={submitContact}><h3>Tell us about your project</h3><p>Fields marked with * are required.</p><label>Creator name *<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label><label>Email address *<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>Project link<input type="url" value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="https://"/></label><label>Campaign stage *<select required value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}><option value="">Select your campaign stage</option><option>Planning a Campaign</option><option>Preparing for Launch</option><option>Pre-Launch</option><option>Campaign Is Live</option><option>Campaign Nearing Completion</option><option>Relaunching a Campaign</option></select></label><label>Briefly describe what you need *<textarea required rows="5" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us about your project and the support you're looking for..."/></label><button className="btn btn-primary" type="submit" disabled={contactLoading}>{contactLoading ? "Sending..." : "Send enquiry"} {!contactLoading && <ArrowRight size={16}/>}</button>
    {contactStatus === "success" && <p role="status" style={{color:"green"}}>Your enquiry has been received successfully. Please check your email for confirmation.</p>}
    {contactStatus === "error" && <p role="alert" style={{color:"red"}}>We couldn't send your enquiry. Please try again.</p>}
    <small>Your information will be sent securely to the PledgePilot team.</small></form></div></section></>;

  const pageContent={home:Home(),services:Services(),pricing:Pricing(),portfolio:Portfolio(),process:Process(),about:About(),contact:Contact()};
  return <>{Header()}{pageContent[page]||Home()}{Footer()}</>;
}

createRoot(document.getElementById("root")).render(<App/>);

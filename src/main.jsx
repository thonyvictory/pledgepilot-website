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
    const aliases={game:["game","games","gaming","tabletop","video game","video games","board game","board games","gaming hardware"],
      tech:["technology","tech","gadgets","electronics","hardware","software"],
      art:["art","illustration","design","creative","comics","graphic novel"],
      fashion:["fashion","apparel","clothing","wearables"],
      film:["film","movie","cinema","video"],
      music:["music","audio","instrument"]};
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
    <a className="brand" href="#home" onClick={()=>setPage("home")} aria-label="PledgePilot home"><img src="/images/pledgepilot-logo.png" alt="" fetchPriority="high"/><span className="brand-copy"><strong><span>Pledge</span><span>Pilot</span></strong><small>ELEVATE YOUR SUCCESS</small></span></a>
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

  const testimonialGroups = [
    [
      {name:"Daniel Carter",project:"EcoFlow Bottle Campaign",image:"https://randomuser.me/api/portraits/men/32.jpg",quote:"PledgePilot helped us build real momentum before launch. Their strategy, communication, and support were outstanding."},
      {name:"Emily Zhang",project:"LumaDesk Project",image:"https://randomuser.me/api/portraits/women/44.jpg",quote:"The team was professional and highly responsive. Our campaign gained great visibility and exceeded our funding goal."},
      {name:"Mark Reynolds",project:"TrailMate Gear",image:"https://randomuser.me/api/portraits/men/45.jpg",quote:"From strategy to execution, PledgePilot delivered exactly what we needed. A reliable and knowledgeable partner for our campaign."},
      {name:"Sophia Turner",project:"BreezeSmart Fan",image:"https://randomuser.me/api/portraits/women/68.jpg",quote:"We really appreciated their clear guidance and practical marketing support. It made a big difference to our campaign performance."},
      {name:"James Porter",project:"NeoLight Lamp",image:"https://randomuser.me/api/portraits/men/52.jpg",quote:"PledgePilot's marketing approach helped us reach the right audience and build early traction for a strong launch."}
    ],
    [
      {name:"Olivia Bennett",project:"KindleTote Campaign",image:"https://randomuser.me/api/portraits/women/32.jpg",quote:"A fantastic team to work with! They understood our goals, provided a solid plan, and kept us updated throughout the entire campaign."},
      {name:"Ryan Mitchell",project:"VeloRide Bike",image:"https://randomuser.me/api/portraits/men/22.jpg",quote:"PledgePilot brought valuable insights and marketing expertise that helped us reach a much larger audience than we expected."},
      {name:"Isabella Hayes",project:"PureBrew Coffee Maker",image:"https://randomuser.me/api/portraits/women/56.jpg",quote:"Their support was proactive, transparent, and results-driven. We're very happy with how our campaign turned out."},
      {name:"Ethan Brooks",project:"SoundNest Speaker",image:"https://randomuser.me/api/portraits/men/41.jpg",quote:"The team at PledgePilot made the entire process smooth and effective. Their marketing approach helped us build strong early traction."},
      {name:"Chloe Adams",project:"FlexStand Pro",image:"https://randomuser.me/api/portraits/women/25.jpg",quote:"Great communication, clear strategy, and consistent support. I would highly recommend PledgePilot to any creator."}
    ],
    [
      {name:"Jonathan Reed",project:"HomeBot Cleaner",image:"https://randomuser.me/api/portraits/men/64.jpg",quote:"Professional, experienced, and genuinely supportive. PledgePilot gave our campaign the visibility and structure it needed to succeed."},
      {name:"Natalie Fisher",project:"GlowRest Pillow",image:"https://randomuser.me/api/portraits/women/39.jpg",quote:"They provided clear direction, practical strategies, and consistent support. Our campaign reached more backers than we initially projected."},
      {name:"Henry Collins",project:"AeroFit Watch",image:"https://randomuser.me/api/portraits/men/55.jpg",quote:"Working with PledgePilot was a great decision. Their marketing expertise and attention to detail helped us achieve a strong result."},
      {name:"Grace Lewis",project:"PlantJoy Indoor Garden",image:"https://randomuser.me/api/portraits/women/47.jpg",quote:"The team was easy to work with, highly organized, and focused on results. We're very pleased with the outcome of our campaign."},
      {name:"Lucas Morgan",project:"ChargeHub Pro",image:"https://randomuser.me/api/portraits/men/36.jpg",quote:"PledgePilot gave us the right strategy and promotion to reach a global audience. The entire experience was smooth and professional."}
    ]
  ];

  const Testimonials=()=> <section className="section pp-testimonials" aria-labelledby="pp-testimonials-title">
    <style>{`
      .pp-testimonials{position:relative;overflow:hidden;background:linear-gradient(135deg,#f7f9ff 0%,#edf3ff 52%,#f8faff 100%);isolation:isolate}
      .pp-testimonials:before,.pp-testimonials:after{content:"";position:absolute;z-index:-1;border:1px solid rgba(69,111,218,.08);border-radius:50%;pointer-events:none}
      .pp-testimonials:before{width:620px;height:620px;top:-390px;left:-220px;box-shadow:0 0 0 34px rgba(69,111,218,.025),0 0 0 72px rgba(69,111,218,.018)}
      .pp-testimonials:after{width:700px;height:700px;right:-400px;bottom:-500px;box-shadow:0 0 0 38px rgba(69,111,218,.025),0 0 0 80px rgba(69,111,218,.018)}
      .pp-testimonials .pp-testimonials-heading{text-align:center;max-width:850px;margin:0 auto 42px}
      .pp-testimonials .eyebrow{color:#3769df}
      .pp-testimonials h2{color:#102344;margin:10px 0 12px;font-size:clamp(2.2rem,4.2vw,3.5rem);line-height:1.08;letter-spacing:-.045em}
      .pp-testimonials h2 em{color:#6f91f4;font-style:normal}
      .pp-testimonials-heading>p{color:#64748b;font-size:1.06rem;margin:0}
      .pp-testimonials-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;align-items:stretch;position:relative}
      .pp-testimonial-lane{height:720px;overflow:hidden;position:relative;mask-image:linear-gradient(to bottom,transparent 0%,#000 8%,#000 92%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 8%,#000 92%,transparent 100%)}
      .pp-testimonial-lane--up{filter:drop-shadow(0 12px 22px rgba(50,100,210,.08))}
      .pp-testimonial-track{display:flex;flex-direction:column;gap:16px;will-change:transform;animation:pp-testimonial-down 48s linear infinite}
      .pp-testimonial-lane.pp-testimonial-lane--up .pp-testimonial-track{animation:pp-testimonial-up 54s linear infinite}
      .pp-testimonial-lane:hover .pp-testimonial-track{animation-play-state:paused}
      .pp-testimonial-card{background:rgba(255,255,255,.94);border:1px solid rgba(215,226,247,.9);border-radius:20px;padding:20px 19px 21px;box-shadow:0 10px 28px rgba(23,55,110,.075);min-height:190px}
      .pp-testimonial-person{display:flex;align-items:center;gap:13px}
      .pp-testimonial-person img{width:58px;height:58px;flex:0 0 58px;object-fit:cover;border-radius:50%;border:3px solid #edf3ff;background:#e6edfb}
      .pp-testimonial-person h3{font-size:1rem;line-height:1.25;color:#102344;margin:0 0 3px;font-weight:750}
      .pp-testimonial-person span{display:block;color:#64748b;font-size:.82rem;line-height:1.35}
      .pp-testimonial-stars{display:flex;gap:2px;color:#f3ad19;margin:11px 0 5px;font-size:1.08rem;letter-spacing:1px}
      .pp-testimonial-quote{display:flex;gap:9px;align-items:flex-start;color:#34445f;font-size:.91rem;line-height:1.55;margin:0}
      .pp-testimonial-quote-mark{font-size:2rem;line-height:.9;color:#6d91ee;font-weight:800;flex:0 0 auto}
      .pp-testimonial-arrow{position:absolute;z-index:2;top:44%;width:38px;height:58px;border:0;border-radius:22px;background:linear-gradient(180deg,#4778f4,#2c5dd8);color:#fff;display:grid;place-items:center;box-shadow:0 8px 20px rgba(48,96,220,.24);pointer-events:none}
      .pp-testimonial-arrow.left{left:-18px}.pp-testimonial-arrow.right{right:-18px}.pp-testimonial-arrow.middle{top:3px;left:calc(66.666% - 43px);width:34px;height:52px}
      @keyframes pp-testimonial-down{from{transform:translateY(-50%)}to{transform:translateY(0)}}
      @keyframes pp-testimonial-up{from{transform:translateY(0)}to{transform:translateY(-50%)}}
      @media(max-width:900px){.pp-testimonials-grid{gap:14px}.pp-testimonial-card{padding:16px 14px}.pp-testimonial-person{gap:9px}.pp-testimonial-person img{width:48px;height:48px;flex-basis:48px}.pp-testimonial-person h3{font-size:.9rem}.pp-testimonial-person span{font-size:.74rem}.pp-testimonial-quote{font-size:.82rem}.pp-testimonial-lane{height:660px}}
      @media(max-width:640px){.pp-testimonials .pp-testimonials-heading{margin-bottom:28px}.pp-testimonials-heading>p{font-size:.92rem}.pp-testimonials-grid{grid-template-columns:repeat(3,minmax(260px,82vw));overflow-x:auto;overflow-y:hidden;padding:0 2px 14px;scroll-snap-type:x mandatory}.pp-testimonial-lane{height:650px;scroll-snap-align:center}.pp-testimonial-card{padding:18px;min-height:180px}.pp-testimonial-person h3{font-size:1rem}.pp-testimonial-person span{font-size:.82rem}.pp-testimonial-quote{font-size:.9rem}.pp-testimonial-arrow{display:none}}
    `}</style>
    <div className="container">
      <div className="pp-testimonials-heading">
        <span className="eyebrow">CLIENT TESTIMONIALS</span>
        <h2 id="pp-testimonials-title">What Our Clients <em>Say</em></h2>
        <p>Real experiences. Genuine feedback. Trusted partnerships.</p>
      </div>
      <div className="pp-testimonials-grid">
        <span className="pp-testimonial-arrow left" aria-hidden="true">↓</span>
        <span className="pp-testimonial-arrow middle" aria-hidden="true">↑</span>
        {testimonialGroups.map((group,index)=><div className={`pp-testimonial-lane ${index===1?"pp-testimonial-lane--up":""}`} key={index} aria-label={`Testimonial column ${index+1}`}>
          <div className="pp-testimonial-track">
            {[...group,...group].map((item,i)=><article className="pp-testimonial-card" key={`${item.name}-${i}`}>
              <div className="pp-testimonial-person"><img src={item.image} alt={`${item.name} profile`} loading="lazy"/><div><h3>{item.name}</h3><span>{item.project}</span></div></div>
              <div className="pp-testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
              <p className="pp-testimonial-quote"><span className="pp-testimonial-quote-mark" aria-hidden="true">“</span><span>{item.quote}</span></p>
            </article>)}
          </div>
        </div>)}
        <span className="pp-testimonial-arrow right" aria-hidden="true">↓</span>
      </div>
    </div>
  </section>;

  const Home=()=> <><section className="hero"><div className="hero-glow"></div><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot"></span> INTERNATIONAL CROWDFUNDING MARKETING</span><h1>Kickstarter &amp; Indiegogo Marketing to <em>Grow Your Crowdfunding Campaign.</em></h1><p>PledgePilot helps creators, entrepreneurs and businesses prepare, launch and promote crowdfunding campaigns through audience research, campaign strategy, PR, email marketing and targeted promotion.</p><div className="hero-actions"><a className="btn btn-primary" href="#contact">Discuss your project <ArrowRight size={17}/></a><a className="btn btn-secondary" href="#portfolio">Explore our work</a></div><div className="hero-proof"><span><CheckCircle2/> Kickstarter & Indiegogo specialists</span><span><Globe2/> Working with creators worldwide</span></div></div><div className="hero-visual hero-showcase"><div className="showcase-kicker"><span className="live-dot"></span> IDEAS IN MOTION <span>01 / 03</span></div><div className="showcase-stack">{campaigns.slice(0,3).map((c,i)=><a className={`showcase-card showcase-card-${i+1}`} href={c.url} target="_blank" rel="noreferrer" key={c.url}><img src={c.coverImage} alt={`${c.title} campaign cover`}/><span>{c.category}</span></a>)}</div><div className="showcase-caption"><b>From concept to community.</b><span>Strategic visibility for ideas worth backing.</span></div><div className="floating-note note-top"><Target/><div><b>Audience-first</b><small>Research-led planning</small></div></div><div className="floating-note note-bottom"><BarChart3/><div><b>Campaign-focused</b><small>Measure. Learn. Improve.</small></div></div></div></div><div className="hero-bottom container"><span>PLATFORMS WE SPECIALIZE IN</span><strong>Kickstarter</strong><i></i><strong>Indiegogo</strong></div></section>
  <section className="section platforms"><div className="container platform-inner"><div><span className="eyebrow">OUR PLATFORM FOCUS</span><h2>Kickstarter and Indiegogo<br/><em>campaign marketing.</em></h2></div><p>We help creators prepare, launch and promote campaigns on Kickstarter and Indiegogo with audience research, campaign strategy and focused marketing support.</p><div className="platform-logos"><span className="platform-k">K</span><b>Kickstarter</b><span className="platform-divider"></span><span className="platform-i">i</span><b>Indiegogo</b></div></div></section>
  <section className="section about-preview"><div className="container two-col"><div className="section-visual blue-panel"><div className="panel-orbit"></div><div className="panel-mark">PP</div><span>IDEAS NEED AN AUDIENCE</span><strong>Make your next move<br/>a strategic one.</strong></div><div className="section-copy"><span className="eyebrow">ABOUT PLEDGEPILOT</span><h2>Crowdfunding marketing for ideas ready to <em>reach the right audience.</em></h2><p>PledgePilot is an international crowdfunding marketing agency helping creators, entrepreneurs and businesses promote Kickstarter and Indiegogo campaigns through research, strategy and coordinated marketing.</p><p>From early planning to live campaign support, we bring research, communication and coordinated marketing activity together around your project goals.</p><a className="text-link" href="#about">Get to know PledgePilot <ArrowRight size={16}/></a></div></div></section>
  <section className="section services-preview"><div className="container"><div className="section-heading"><div><span className="eyebrow">WHAT WE DO</span><h2>Crowdfunding marketing services<br/>for every <em>campaign stage.</em></h2></div><a className="text-link" href="#services">Explore all services <ArrowRight size={16}/></a></div><div className="service-grid">{services.slice(0,6).map((s,i)=><article className="service-card" key={s.title}><div className="service-icon"><s.icon/></div><span className="service-number">0{i+1}</span><h3>{s.title}</h3><p>{s.desc}</p><a href="#services">Explore service <ArrowUpRight size={15}/></a></article>)}</div></div></section>
  <section className="section pricing-preview"><div className="container pricing-box"><div><span className="eyebrow">FLEXIBLE CAMPAIGN SUPPORT</span><h2>Pricing built around <em>your project.</em></h2><p>Every campaign has different needs. We assess your stage, objectives, scope and required support before recommending a service structure and budget.</p><a className="btn btn-primary" href="#pricing">How our pricing works <ArrowRight size={16}/></a></div><div className="pricing-points"><span><CheckCircle2/> Tailored service proposals</span><span><CheckCircle2/> Clear scope of work</span><span><CheckCircle2/> Service fees separated from ad spend</span><span><CheckCircle2/> No one-size-fits-all packages</span></div></div></section>
  <section className="section portfolio-preview featured-home"><div className="container"><div className="section-heading"><div><span className="eyebrow">SELECTED CAMPAIGNS</span><h2>Ideas worth <em>discovering.</em></h2><p>A rotating selection of featured crowdfunding projects. Select any campaign to view its original page.</p></div><a className="text-link" href="#portfolio">Explore full portfolio <ArrowRight size={16}/></a></div><div className="featured-track-window"><div className="featured-track">{[...campaigns.slice(0,15),...campaigns.slice(0,15)].map((c,i)=><a className="featured-campaign" href={c.url} target="_blank" rel="noreferrer" key={`${c.url}-${i}`} aria-label={`View ${c.title} campaign`}><div className="featured-campaign-image"><img src={c.coverImage} alt={`${c.title} campaign cover`} loading="lazy"/><span>{c.platform}</span><b><ArrowUpRight size={18}/></b></div><div className="featured-campaign-meta"><small>{c.category}</small><strong>{c.title}</strong></div></a>)}</div></div><div className="featured-home-bottom"><a className="btn btn-light" href="#portfolio">Explore full portfolio <ArrowRight size={16}/></a></div></div></section>
  <section className="section process-preview"><div className="container"><div className="section-heading"><div><span className="eyebrow">OUR PROCESS</span><h2>Our crowdfunding campaign marketing process: <em>from planning to promotion.</em></h2></div><a className="text-link" href="#process">See our process <ArrowRight size={16}/></a></div><div className="process-line">{steps.slice(0,4).map(s=><div className="process-mini" key={s[0]}><span>{s[0]}</span><h3>{s[1]}</h3><p>{s[2]}</p></div>)}</div></div></section>
  <section className="section why"><div className="container"><div className="section-heading centered"><span className="eyebrow">WHY PLEDGEPILOT</span><h2>Research-led strategy.<br/><em>Focused campaign promotion.</em></h2><p>We combine audience research, campaign planning and coordinated promotion to help crowdfunding projects connect with people who may be interested in backing them.</p></div><div className="why-grid"><div><Search/><h3>Research-led planning</h3><p>Decisions start with your project, audience and competitive landscape.</p></div><div><Users/><h3>Relevant audience development</h3><p>Build meaningful connections with people who may care about your idea.</p></div><div><Layers/><h3>Integrated marketing support</h3><p>Coordinate the right mix of content, outreach, email and promotion.</p></div><div><ShieldCheck/><h3>Clear communication</h3><p>Understand the scope, activities and costs before work begins.</p></div></div></div></section>
  {Testimonials()}
  <section className="section faq-preview"><div className="container faq-layout"><div><span className="eyebrow">QUESTIONS, ANSWERED</span><h2>Before you <em>get started.</em></h2><p>Some quick answers to common questions about working with PledgePilot.</p><a className="text-link" href="#contact">Have another question? Contact us <ArrowRight size={16}/></a></div><div className="faq-list">{faqs.slice(0,4).map((f,i)=><div className="faq-item" key={f[0]}><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)}><span>{f[0]}</span><ChevronDown className={faqOpen===i?"rotated":""}/></button>{faqOpen===i&&<p>{f[1]}</p>}</div>)}</div></div></section>
  <section className="final-cta"><div className="container final-cta-inner"><div><span className="eyebrow">YOUR NEXT STEP STARTS HERE</span><h2>Ready to move your<br/><em>project forward?</em></h2><p>Tell us what you're building, where you are in the crowdfunding journey and what kind of support you need.</p></div><a className="btn btn-white" href="#contact">Start a conversation <ArrowRight size={17}/></a></div></section>
  {Newsletter()}</>;

  const Newsletter = () => (
    <section className="newsletter">
      <div className="container newsletter-inner">
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
            onChange={e => setNewsletter(e.target.value)}
            disabled={newsletterLoading}
          />

          <button className="btn btn-primary" type="submit" disabled={newsletterLoading}>
            {newsletterLoading ? "Subscribing..." : "Subscribe"}
            {!newsletterLoading && <ArrowRight size={16} />}
          </button>

          {newsletterStatus === "success" && (
            <p role="status" aria-live="polite" style={{ color: "green", marginTop: "12px" }}>
              Your subscription was successful! Please check your inbox for a welcome email.
            </p>
          )}
          {newsletterStatus === "already" && (
            <p role="status" aria-live="polite" style={{ color: "green", marginTop: "12px" }}>
              You're already subscribed to the PledgePilot newsletter.
            </p>
          )}
          {newsletterStatus === "error" && (
            <p role="alert" aria-live="assertive" style={{ color: "red", marginTop: "12px" }}>
              We couldn't complete your subscription. Please try again.
            </p>
          )}

          <small>By subscribing, you agree to receive email updates. You can unsubscribe at any time.</small>
        </form>
      </div>
    </section>
  );

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
  return <>{Header()}<main id="main-content">{pageContent[page]||Home()}</main>{Footer()}</>;
}

createRoot(document.getElementById("root")).render(<App/>);

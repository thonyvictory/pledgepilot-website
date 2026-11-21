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

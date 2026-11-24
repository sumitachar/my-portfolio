export const personalInfo = {
  name: "Sumit Achar",
  role: "Full-Stack Developer & Tech Partner",
  tagline: "Idea to launch for startups & businesses",
  bio: "I help startups and businesses turn ideas into working products: websites, web and mobile apps, e-commerce stores, SaaS platforms and ERP/CRM systems. I manage your project end to end and work with a trusted network of developers and designers, so one point of contact covers everything you need. My own core stack is React, Next.js, NestJS, Express.js, TypeScript and PostgreSQL, with 3+ years of building production apps.",
  email: "sumitachar1997@gmail.com",
  location: "Kolkata, West Bengal, India",
  available: true,
  availability: "Available for freelance & contract projects · Remote, worldwide",
  currentWork: "Building a construction ERP @ Rajwada Infotech",
  coreStack: ["React", "Next.js", "TypeScript", "NestJS", "PostgreSQL"],
};

export const stats = [
  {
    value: 3,
    suffix: "+",
    label: "Years Building",
  },
  {
    value: 20,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    value: 30,
    suffix: "%",
    label: "Faster Page Loads",
  },
  {
    value: 1,
    suffix: "",
    label: "Point of Contact",
  },
];

export const services = [
  { title: "Business websites & landing pages", text: "Fast, SEO-ready sites that explain what you do and turn visitors into enquiries.", tags: ["Landing pages", "SEO", "CMS / blog", "Analytics"] },
  { title: "Web apps, SaaS & MVPs", text: "From first prototype to a production product your users can sign up for and pay for.", tags: ["Auth & roles", "Subscriptions", "Dashboards", "REST APIs"] },
  { title: "Mobile apps", text: "Android and iOS apps, delivered with my network of mobile developers and designers.", tags: ["Android", "iOS", "Push notifications", "Store launch"] },
  { title: "E-commerce stores", text: "Online stores with catalogues, carts, payments and an admin you can run yourself.", tags: ["Catalogue", "Checkout & payments", "Orders", "Inventory"] },
  { title: "Dashboards & data visualization", text: "Admin panels, analytics and real-time charts that make your data easy to act on.", tags: ["Real-time charts", "Data tables", "Exports", "Role-based access"] },
  { title: "ERP, CRM & business systems", text: "Inventory, billing, CRM and ERP tools built around how your team already works.", tags: ["Inventory", "Billing", "CRM", "Reports"] },
  { title: "Secure APIs & integrations", text: "REST APIs with JWT auth, role-based access and integrations with the tools you use.", tags: ["REST", "JWT auth", "Payments", "Webhooks"] },
  { title: "Speed fixes, redesigns & support", text: "Performance audits, redesigns, maintenance and ongoing support after launch.", tags: ["Performance audit", "Redesign", "Maintenance", "New features"] },
];

export const process = [
  { title: "Clear scope & timeline", text: "We agree on what gets built, by when and for how much before any code is written." },
  { title: "Regular updates & demos", text: "You see working progress every step of the way, so there are no surprises." },
  { title: "Code you fully own", text: "Clean, documented code and full handover. No lock-in." },
  { title: "Measurable results", text: "I track what matters: on one production platform I cut page load time by ~30%." },
];

export const skills = [
  { name: "React.js", level: 95, color: "#61DAFB" },
  { name: "Next.js", level: 90, color: "#FFFFFF" },
  { name: "TypeScript", level: 88, color: "#3178C6" },
  { name: "JavaScript", level: 92, color: "#F7DF1E" },
  { name: "Tailwind CSS", level: 95, color: "#38BDF8" },
  { name: "Redux Toolkit", level: 80, color: "#764ABC" },
  { name: "Node.js", level: 82, color: "#68A063" },
  { name: "NestJS", level: 80, color: "#E0234E" },
  { name: "Express.js", level: 80, color: "#FFFFFF" },
  { name: "PostgreSQL", level: 80, color: "#336791" },
  { name: "REST APIs & JWT Auth", level: 88, color: "#22C55E" },
  { name: "Data Visualization", level: 85, color: "#F97316" },
];

export const stackLayers = [
  { layer: "Frontend", note: "Interfaces people enjoy using", items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Redux Toolkit"] },
  { layer: "Backend", note: "APIs and business logic", items: ["Node.js", "NestJS", "Express.js", "REST APIs", "JWT auth"] },
  { layer: "Data", note: "Storage, reporting and charts", items: ["PostgreSQL", "Chart.js", "Recharts", "Data tables"] },
  { layer: "Craft", note: "How it ships", items: ["Performance", "Responsive & accessible", "Reusable components", "Git"] },
];

export const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "📘" },
  { name: "JavaScript", icon: "🟨" },
  { name: "Tailwind", icon: "💨" },
  { name: "Redux", icon: "🟣" },
  { name: "Node.js", icon: "🟢" },
  { name: "NestJS", icon: "🔴" },
  { name: "Express.js", icon: "🚂" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Git", icon: "🔧" },
];

// Project screenshots: drop an image named after a project's slug into src/assets/projects/
// (e.g. construction-erp.png) and it shows up on that card automatically.
const shots = import.meta.glob("../assets/projects/*.{jpg,jpeg,png,webp}", { eager: true, import: "default" });
const shot = (slug) => {
  const key = Object.keys(shots).find((k) => k.split("/").pop().replace(/\.[^.]+$/, "") === slug);
  return key ? shots[key] : undefined;
};

const graphite = "from-[#232326] to-[#141416]";

export const projects = [
  {
    id: 1,
    slug: "animora",
    title: "Animora Probiotic",
    description:
      "Product website for an aquaculture probiotics manufacturer: product catalogue, quote requests and order tracking, built for SEO and speed.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    category: "Business website",
    live: "https://animoraprobiotic.com",
  },
  {
    id: 3,
    slug: "andarmahal",
    title: "Andarmahal Interiors",
    description:
      "Interior designer site with scroll-driven storytelling, three languages (English, Bengali, Hindi), a cost calculator and an enquiry flow.",
    tags: ["React.js", "Laravel"],
    category: "Business website",
    live: "https://andarmahal.in",
  },
  {
    id: 4,
    slug: "techtheta",
    title: "Techtheta IT Solution",
    description:
      "Corporate website for an IT services company, presenting CRM, ERP, AI and mobile services with lead-generation and quote flows.",
    tags: ["Next.js", "Tailwind CSS"],
    category: "Corporate website",
    live: "https://techthetaitsolution.com",
  },
  {
    id: 5,
    slug: "construction-erp",
    title: "Construction ERP Platform",
    description:
      "ERP for civil construction companies: React dashboards, Express.js REST APIs and a PostgreSQL data model covering projects, resources and operations.",
    tags: ["React.js", "Express.js", "PostgreSQL"],
    category: "ERP · In progress",
    private: true,
  },
  {
    id: 2,
    slug: "medical-store",
    title: "Medical Store Management System",
    description:
      "Inventory, billing and pharmacy management system with real-time stock management.",
    tags: ["React.js", "NestJS", "PostgreSQL"],
    category: "Business system",
    private: true,
  },
  {
    id: 6,
    slug: "stock-analytics",
    title: "Stock Market Analytics Dashboard",
    description:
      "Real-time stock metrics dashboard with Chart.js, drag-and-drop table ordering, filters and lazy-loaded large datasets.",
    tags: ["React.js", "Chart.js", "Data Viz"],
    category: "Dashboard",
    private: true,
  },
  {
    id: 7,
    slug: "economic-portal",
    title: "Economic Data Portal",
    description:
      "Admin dashboard to upload, analyse and visualise economic indicators, with role-based access and cached APIs for faster responses.",
    tags: ["React.js", "RBAC", "API Caching"],
    category: "Data platform",
    private: true,
  },
].map((p) => ({ gradient: graphite, github: "#", live: "#", featured: true, ...p, image: shot(p.slug) }));

export const experience = [
  {
    role: "Software Engineer",
    company: "Rajwada Infotech",
    period: "Sep 2026 - Present",
    description:
      "Building an ERP platform for civil construction companies. Working across the full stack: React interfaces and dashboards, REST APIs in Express.js, and PostgreSQL database design and queries.",
    highlights: [
      "Construction ERP",
      "React.js Dashboards",
      "Express.js REST APIs",
      "PostgreSQL Design",
    ],
  },

  {
    role: "Full Stack Engineer",
    company: "Techtheta IT Solution",
    period: "Apr 2025 - Aug 2026",
    description:
      "Developed scalable web applications with React.js, Next.js, TypeScript, NestJS and PostgreSQL. Designed REST APIs with secure JWT authentication, built dashboards and data visualization, and improved performance with lazy loading and reusable architecture.",
    highlights: [
      "NestJS + PostgreSQL",
      "JWT Auth & Authorization",
      "Data Visualization",
      "Reusable Architecture",
    ],
  },

  {
    role: "Software Engineer",
    company: "Techtheta IT Solution",
    period: "Dec 2023 - Apr 2025",
    description:
      "Built a family wellness platform with Next.js, TypeScript and Tailwind CSS. Created reusable UI component libraries, JWT authentication, personalised dashboards and Recharts analytics, and cut page load time by ~30%.",
    highlights: [
      "Family Wellness Platform",
      "UI Component Library",
      "Recharts Analytics",
      "~30% Faster Page Loads",
    ],
  },

  {
    role: "Junior Software Engineer",
    company: "FeedSense AI Pvt. Ltd.",
    period: "Sep 2022 - Aug 2023",
    description:
      "Built a stock market analytics platform with real-time Chart.js dashboards and drag-and-drop data tables, plus an economic data portal with role-based access and cached APIs.",
    highlights: [
      "Stock Market Analytics",
      "Chart.js Dashboards",
      "Role-based Access",
      "API Caching",
    ],
  },
];

export const trustPoints = [
  { title: "Free estimate in 24h", text: "Scope, timeline and cost, no obligation" },
  { title: "Clear scope up front", text: "Agreed before any code is written" },
  { title: "Regular demos", text: "See working progress, no surprises" },
  { title: "You own the code", text: "Clean, documented, fully handed over" },
];

export const processSteps = [
  { step: "01", title: "Free consultation", text: "Tell me about your business and goals by chat, call or email. I ask the right questions so nothing important is missed.", time: "Day 1" },
  { step: "02", title: "Clear proposal", text: "You get a written scope, timeline and cost. We agree on everything before work starts.", time: "Within 24–48h" },
  { step: "03", title: "Design & build", text: "I build in short milestones and share regular demos, so you can give feedback early.", time: "Milestone by milestone" },
  { step: "04", title: "Launch & support", text: "I deploy, hand over all code and docs, and stay available for fixes, improvements and support.", time: "Launch day & beyond" },
];

export const faqs = [
  {
    q: "How much does a project cost?",
    a: "It depends on scope. A business website costs far less than a SaaS platform or ERP. Share your requirements through the project assistant or the contact form and you'll get a clear quote with scope and timeline within 24 hours, free and with no obligation.",
  },
  {
    q: "How long will my project take?",
    a: "Smaller websites and landing pages can often be delivered in a few weeks; web apps, e-commerce stores and business systems take longer. You'll get a realistic timeline with milestones in your proposal before anything starts.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes. I'm based in Kolkata and work remotely with clients worldwide, with regular updates over email, chat or video calls.",
  },
  {
    q: "Can you build mobile apps and designs too?",
    a: "Yes. My own core stack is React, Next.js, NestJS, Express.js, TypeScript and PostgreSQL. For mobile apps and design I work with a trusted network of developers and designers, and I manage the whole project, so you still have one point of contact.",
  },
  {
    q: "Will I own the code?",
    a: "Yes. You get clean, documented code and full ownership of everything built for your project. No lock-in.",
  },
  {
    q: "What happens after launch?",
    a: "I can stay on for maintenance, speed fixes, new features and ongoing support, so your product keeps running smoothly as your business grows.",
  },
];

export const navLinks = [
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "Process", id: "process" },
  { label: "About", id: "about" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

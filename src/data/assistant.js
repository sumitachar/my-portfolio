import { personalInfo } from './portfolio';

export const SERVICE_OPTIONS = [
  'Website / landing page',
  'Web app / SaaS / MVP',
  'Mobile app',
  'E-commerce store',
  'Dashboard / analytics',
  'ERP / CRM / business system',
  'APIs & integrations',
  'Redesign, speed fix or support',
  'Something else',
];

const COMMON = ['User login & accounts', 'Admin dashboard', 'Mobile-friendly design', 'Notifications (email / SMS)'];

export const FEATURE_OPTIONS = {
  'Website / landing page': ['Contact / enquiry form', 'SEO setup', 'Blog / CMS', 'Multi-language', 'WhatsApp chat button', 'Animations & premium design', 'Analytics setup'],
  'Web app / SaaS / MVP': [...COMMON, 'Subscriptions & payments', 'Roles & permissions', 'Reports & analytics', 'Third-party integrations'],
  'Mobile app': ['Android', 'iOS', ...COMMON, 'Payments', 'Maps & location', 'Chat / messaging'],
  'E-commerce store': ['Product catalogue', 'Cart & checkout', 'Payment gateway', 'Order management', 'Inventory', 'Coupons & offers', 'Customer accounts'],
  'Dashboard / analytics': ['Charts & KPIs', 'Real-time data', 'Data tables & filters', 'Export to Excel / PDF', 'Roles & permissions', 'Data import'],
  'ERP / CRM / business system': ['Inventory', 'Billing & invoices', 'Customer management', 'Staff & roles', 'Reports', 'Purchase orders', 'Project tracking'],
  'APIs & integrations': ['REST API', 'JWT authentication', 'Payment gateway', 'Third-party APIs', 'Webhooks', 'Database design'],
  'Redesign, speed fix or support': ['Faster page loads', 'New modern design', 'Bug fixes', 'Monthly maintenance', 'New features', 'SEO improvements'],
  default: [...COMMON, 'Payments', 'Reports & analytics', 'Third-party integrations'],
};

export const DESIGN_OPTIONS = ['I have designs (Figma etc.)', 'I have an existing site / app', 'Starting from scratch'];

export const BUDGET_OPTIONS = ['Under $500', '$500 – $2,000', '$2,000 – $5,000', '$5,000+', 'Not sure yet, advise me'];

export const TIMELINE_OPTIONS = ['ASAP (under 2 weeks)', 'Within a month', '1–3 months', 'Flexible'];

export const MENU_OPTIONS = ['Start a project', 'How much does it cost?', 'How long does it take?', 'How do you work?', 'What tech do you use?'];

/** Keyword-matched answers for questions typed (or tapped) in the chat. */
export const FAQ_ANSWERS = [
  {
    label: 'How much does it cost?',
    keywords: ['cost', 'price', 'pricing', 'budget', 'charge', 'rate', 'fee', 'quote', 'how much', 'estimate', 'expensive', 'cheap'],
    answer: "Every project is priced on its scope. A business website costs far less than a SaaS platform or ERP.\n\nAnswer a few quick questions and Sumit will send you a clear quote with scope and timeline within 24 hours, free and with no obligation.",
  },
  {
    label: 'How long does it take?',
    keywords: ['how long', 'time', 'timeline', 'deadline', 'duration', 'fast', 'quick', 'weeks', 'days', 'deliver'],
    answer: "It depends on size. Smaller websites can often be delivered in a few weeks; web apps, stores and business systems take longer.\n\nYou'll get a realistic timeline with milestones before any work starts.",
  },
  {
    label: 'How do you work?',
    keywords: ['process', 'how do you work', 'steps', 'work with', 'approach', 'method', 'update', 'communication'],
    answer: "1. Free consultation to understand your goals\n2. A clear proposal: scope, timeline and cost\n3. Design & build with regular demos\n4. Launch, full code handover and ongoing support if you need it",
  },
  {
    label: 'What tech do you use?',
    keywords: ['tech', 'stack', 'technology', 'react', 'next', 'node', 'language', 'framework', 'database', 'wordpress', 'shopify', 'flutter', 'android', 'ios'],
    answer: "Sumit's core stack is React, Next.js, TypeScript, NestJS, Express.js and PostgreSQL.\n\nFor mobile apps and design he works with a trusted network of developers and designers, and manages everything himself, so you still have one point of contact.",
  },
  {
    label: 'Where are you based?',
    keywords: ['india', 'remote', 'country', 'abroad', 'location', 'where', 'timezone', 'usa', 'uk', 'international'],
    answer: 'Sumit is based in Kolkata, India and works remotely with clients worldwide.',
  },
  {
    label: 'Will I own the code?',
    keywords: ['own', 'ownership', 'source code', 'code', 'rights', 'lock'],
    answer: 'Yes. You get clean, documented code and full ownership of everything built for you. No lock-in.',
  },
  {
    label: 'Do you offer support?',
    keywords: ['support', 'maintenance', 'after launch', 'bug', 'hosting', 'update', 'fix'],
    answer: 'Yes. Speed fixes, maintenance, new features and ongoing support after launch are all available.',
  },
  {
    label: 'Talk to Sumit directly',
    keywords: ['call', 'talk', 'human', 'person', 'phone', 'email', 'whatsapp', 'contact', 'meet', 'sumit'],
    answer: `You can email Sumit directly at ${personalInfo.email}.\n\nOr start a project here: he reads every request personally and replies within 24 hours.`,
  },
];

const GREETING = /^(hi+|hello|hey|hii+|good (morning|afternoon|evening)|namaste|yo)\b/i;

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PATTERNS = FAQ_ANSWERS.map((f) => ({ faq: f, re: new RegExp(`\\b(${f.keywords.map(escape).join('|')})\\b`, 'i') }));

/** Returns the FAQ entry whose keywords appear (as whole words) in the text, or a greeting reply. */
export function matchFaq(text) {
  const t = text.trim();
  if (GREETING.test(t)) return { answer: 'Hi there! 👋 Happy to help. Do you want to start a project, or do you have a question first?' };
  return PATTERNS.find(({ re }) => re.test(t))?.faq;
}

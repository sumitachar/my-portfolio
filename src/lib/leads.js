import { getFirestoreApi, isFirebaseConfigured } from './firebase';
import { personalInfo } from '../data/portfolio';

export { isFirebaseConfigured };

const clip = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export const LEAD_STATUSES = ['new', 'contacted', 'proposal', 'won', 'lost'];

/** Save a project enquiry to Firestore (collection "leads"). Shape must match firestore.rules. */
export async function saveLead(input) {
  const { db, fs } = await getFirestoreApi();
  const lead = {
    name: clip(input.name, 100),
    email: clip(input.email, 200),
    phone: clip(input.phone, 40),
    service: clip(input.service, 100),
    budget: clip(input.budget, 60),
    timeline: clip(input.timeline, 60),
    design: clip(input.design, 100),
    features: (input.features || []).slice(0, 20).map((f) => clip(f, 60)),
    message: clip(input.message, 5000),
    source: input.source === 'chatbot' ? 'chatbot' : 'contact',
    page: clip(window.location.href, 300),
    status: 'new',
    createdAt: fs.serverTimestamp(),
  };
  const ref = await fs.addDoc(fs.collection(db, 'leads'), lead);
  return ref.id;
}

/** Plain-text version of a lead, used for the email fallback and admin copy. */
export function leadToText(lead) {
  return [
    lead.service && `Project: ${lead.service}`,
    lead.message && `Details: ${lead.message}`,
    lead.features?.length && `Features: ${lead.features.join(', ')}`,
    lead.design && `Designs: ${lead.design}`,
    lead.budget && `Budget: ${lead.budget}`,
    lead.timeline && `Timeline: ${lead.timeline}`,
    lead.name && `Name: ${lead.name}`,
    lead.email && `Email: ${lead.email}`,
    lead.phone && `Phone: ${lead.phone}`,
  ].filter(Boolean).join('\n');
}

/** mailto: link that sends the lead to Sumit when the database is unavailable. */
export function leadMailto(lead) {
  const subject = encodeURIComponent(`Project enquiry${lead.name ? ` from ${lead.name}` : ''}`);
  return `mailto:${personalInfo.email}?subject=${subject}&body=${encodeURIComponent(leadToText(lead))}`;
}

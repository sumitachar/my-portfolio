export const OPEN_ASSISTANT_EVENT = 'open-assistant';

/** Open the project assistant from anywhere (hero, services, CTA band…). Pass 'project' to jump straight into the brief. */
export const openAssistant = (intent) => window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT, { detail: intent }));

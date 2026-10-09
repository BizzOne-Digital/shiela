export const PROCESS_SERVING_TIERS = [
  {
    tier: "Standard Service",
    turnaround: "3–5 Business Days",
    details: "First attempt made within standard operational window.",
  },
  {
    tier: "Priority Service",
    turnaround: "Within 24 Hours",
    details: "Expedited delivery attempt for time-sensitive matters.",
  },
  {
    tier: "Urgent / Same-Day Service",
    turnaround: "Same Day",
    details: "Immediate dispatch for urgent and high-priority services.",
  },
] as const;

export const WHY_CHOOSE_ITEMS = [
  "High Success Rate & Reliability: Experienced in serving even difficult or hard-to-locate parties legally and ethically.",
  "Real-Time Tracking & Transparency: Regular updates at every stage of the service or filing process.",
  "Strict Legal Compliance: Rigorous adherence to local rules of civil procedure.",
  "Client-Centric Approach: Dedicated support for law firms, paralegals, business owners, and self-represented individuals.",
] as const;

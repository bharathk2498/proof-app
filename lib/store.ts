export type Sub = { id: string; at: string; items: { text: string; done: boolean; photo?: string }[] };
const KEY = "proof.subs";
export const TEMPLATE = [
  "Lights and open sign on",
  "Floors clear and dry",
  "Restroom stocked",
  "Safe counted",
  "Door locked / cameras checked",
];
export function listSubs(): Sub[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function addSub(s: Sub) {
  localStorage.setItem(KEY, JSON.stringify([s, ...listSubs()]));
}

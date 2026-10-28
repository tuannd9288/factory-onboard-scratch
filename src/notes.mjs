// Turns a courier's delivery note into the one-line summary the depot's morning sheet shows.
export const SHEET_WIDTH = 72;

export function summarize(note) {
  const flat = String(note).replace(/\s+/g, " ").trim();
  if (flat === "") return "(empty note)";
  return flat.length <= SHEET_WIDTH ? flat : `${flat.slice(0, SHEET_WIDTH - 1)}…`;
}

export function countDelivered(notes) {
  return notes.filter((note) => /\bdelivered\b/i.test(note) && !/\bnot\s+(?:yet\s+)?delivered\b/i.test(note)).length;
}

/** The share of the day's notes that are deliveries, as the sheet's footer prints it. */
export function deliveryRate(notes) {
  return `${Math.round((countDelivered(notes) / notes.length) * 100)}%`;
}

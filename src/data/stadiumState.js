export const zones = [
  { name: "A — North Stand", occ: 2140, cap: 2600 },
  { name: "C — East Stand", occ: 2510, cap: 2600 },
  { name: "E — South Stand", occ: 2020, cap: 2600 },
  { name: "G — West Stand", occ: 2380, cap: 2600 },
  { name: "B / D / F / H", occ: 1500, cap: 2300 },
];

export const incidents = [
  { sev: "high", title: "Congestion building at Gate C turnstiles", time: "18:04", meta: "Marshal dispatched" },
  { sev: "med", title: "Minor medical, dehydration, Section E", time: "17:52", meta: "Attended, monitoring" },
  { sev: "low", title: "Signage misaligned near Gate A3", time: "17:31", meta: "Logged for maintenance" },
];

export const transport = [
  { title: "Metro Line 4 — Stadium Station", meta: "Trains every 4 min, exit via Gate A concourse", status: "On time", ok: true },
  { title: "Shuttle Bus — Park and Ride Lot C", meta: "Departs every 10 min, 12 min to venue", status: "Delayed 6 min", ok: false },
  { title: "Rideshare Pickup — East Lot", meta: "Avg wait 5 min, lower congestion than West Lot", status: "Normal", ok: true },
];

export const accessibility = [
  { title: "Ramp Access — Gate 4 to Section D", meta: "No stairs, approx. 4 min from main concourse", status: "Clear", ok: true },
  { title: "Wheelchair Elevator — West Concourse", meta: "Serves Sections F, G, H", status: "3 min wait", ok: false },
  { title: "Accessible Restroom — Near Gate 4", meta: "60m past Gate 4, on the left", status: "Clear", ok: true },
];

export const weather = { tempC: 29, humidity: 68, condition: "clear" };

export function getFullStateSnapshot() {
  return {
    occupancyPct: Math.round(zones.reduce((s, z) => s + z.occ, 0) / zones.reduce((s, z) => s + z.cap, 0) * 100),
    zones: zones.map(z => ({ name: z.name, pct: Math.round((z.occ / z.cap) * 100) })),
    incidents,
    transport,
    accessibility,
    weather,
  };
}

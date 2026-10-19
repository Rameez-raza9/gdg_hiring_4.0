// Usage: node scripts/build-results.mjs results.csv
// CSV header: email,roll,name,outcome,team,role,no
// outcome = Accepted | Waitlist | Not selected
// team    = Architect | Pioneer | Creator | Connector   (Accepted only)
import fs from "node:fs";

const file = process.argv[2];
if (!file) { console.error("Usage: node scripts/build-results.mjs results.csv"); process.exit(1); }

const OUTCOMES = ["Accepted", "Waitlist", "Not selected"];
const TEAMS = ["Architect", "Pioneer", "Creator", "Connector"];

function parseLine(line) {
  const out = []; let cur = ""; let q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) { out.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l.trim());
const head = parseLine(lines.shift()).map((h) => h.toLowerCase());
const col = (r, k) => r[head.indexOf(k)] ?? "";

const seen = new Set(); const rows = []; const problems = [];
lines.forEach((l, i) => {
  const r = parseLine(l); const n = i + 2;
  const email = col(r, "email").toLowerCase(); const roll = col(r, "roll");
  const outcome = col(r, "outcome"); const team = col(r, "team");
  if (!/^\S+@\S+\.\S+$/.test(email)) problems.push(`row ${n}: bad email "${email}"`);
  if (!roll) problems.push(`row ${n}: missing roll`);
  if (!OUTCOMES.includes(outcome)) problems.push(`row ${n}: outcome must be one of ${OUTCOMES.join(" | ")}`);
  if (outcome === "Accepted" && !TEAMS.includes(team)) problems.push(`row ${n}: Accepted needs team ${TEAMS.join(" | ")}`);
  if (seen.has(email)) problems.push(`row ${n}: duplicate email ${email}`);
  seen.add(email);
  const e = { email, roll, name: col(r, "name"), outcome };
  if (outcome === "Accepted") { e.team = team; e.role = col(r, "role"); }
  const no = Number(col(r, "no")); if (no) e.no = no;
  rows.push(e);
});

if (problems.length) { console.error("Fix these first:\n" + problems.join("\n")); process.exit(1); }
if (!fs.existsSync("data")) fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/results.json", JSON.stringify(rows, null, 2));
if (fs.existsSync("src/data")) {
  fs.writeFileSync("src/data/results.json", JSON.stringify(rows, null, 2));
}
const c = (o) => rows.filter((r) => r.outcome === o).length;
console.log(`Wrote ${rows.length} results: ${c("Accepted")} accepted, ${c("Waitlist")} waitlist, ${c("Not selected")} not selected.`);

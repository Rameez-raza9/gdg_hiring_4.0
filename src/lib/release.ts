// Server-only helper. The release time is enforced on the server (see /api/results),
// so changing a device clock never unlocks results early.
//
// Midnight tonight, India time. Override with RESULTS_RELEASE_AT (ISO string with offset).
export const DEFAULT_RELEASE_AT = "2026-10-20T00:00:00+05:30";

export function releaseAtMs() {
  const ms = Date.parse(process.env.RESULTS_RELEASE_AT || DEFAULT_RELEASE_AT);
  return Number.isFinite(ms) ? ms : Date.parse(DEFAULT_RELEASE_AT);
}

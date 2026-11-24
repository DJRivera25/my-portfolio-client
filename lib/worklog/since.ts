const RELATIVE = /^(\d+)\s*([dhw])$/i;

const UNIT_MS: Record<string, number> = {
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
};

/**
 * Accepts "7d" / "24h" / "2w" as well as an ISO date, so a caller asking "what did I do
 * this week" does not have to do date arithmetic first. Unparseable input returns
 * undefined, which reads downstream as "no lower bound" rather than throwing.
 */
export function parseSince(input?: string | null, now: Date = new Date()): Date | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  const relative = RELATIVE.exec(trimmed);
  if (relative) {
    const amount = Number(relative[1]);
    const unit = relative[2].toLowerCase();
    return new Date(now.getTime() - amount * UNIT_MS[unit]);
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

const BARE_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Upper bound for a window. A bare date means "through that day", so it resolves to the next
 * UTC midnight and callers treat the result as exclusive.
 */
export function parseUntil(input?: string | null, now: Date = new Date()): Date | undefined {
  const parsed = parseSince(input, now);
  if (!parsed || !input || !BARE_DATE.test(input.trim())) return parsed;
  return new Date(parsed.getTime() + UNIT_MS.d);
}

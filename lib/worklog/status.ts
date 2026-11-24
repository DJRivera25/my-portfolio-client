import type { WorkEntryStatus } from "./types";

/**
 * Three outcomes, not two:
 *   Date       stamp the completion time
 *   null       clear it
 *   undefined  leave the field exactly as it is
 *
 * The undefined case is what preserves an original completion time when a
 * finished entry is touched again. Callers omit the field from `$set` on undefined.
 */
export function resolveCompletedAt(
  prev: WorkEntryStatus | undefined,
  next: WorkEntryStatus,
  now: Date
): Date | null | undefined {
  if (next === "done") return prev === "done" ? undefined : now;
  return prev === "done" ? null : undefined;
}

/** null clears, a string sets, undefined leaves the field as it is. */
export function resolveWaitingOn(
  status: WorkEntryStatus,
  given: string | undefined
): string | null | undefined {
  if (status === "done") return null;
  if (given === undefined) return undefined;
  const trimmed = given.trim();
  return trimmed === "" ? null : trimmed;
}

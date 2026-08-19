import { redirect } from "next/navigation";

/**
 * This page duplicated a section of the single-page home and nothing linked to it.
 * Redirecting keeps old links and bookmarks working without maintaining a second
 * copy of the same copy, which would drift.
 */
export default function ContactPage() {
  redirect("/#contact");
}

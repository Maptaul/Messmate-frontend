import { notFound } from "next/navigation";

// Every unknown URL lands inside [lang] (the proxy rewrites English paths to
// /en/...), so this catch-all hands them to [lang]/not-found.tsx - rendered in
// the visitor's language and theme.
export default function UnknownPage() {
  notFound();
}

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Thin wrapper over TanStack <Link> for CMS-driven hrefs (plain strings,
 * optionally with a query string). Keeps client-side routing everywhere while
 * letting the backend return simple paths.
 */
export function AppLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const [path, query] = href.split("?");
  const search = query
    ? Object.fromEntries(new URLSearchParams(query).entries())
    : undefined;

  return (
    <Link
      to={path as never}
      search={search as never}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

type ErrorReportOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

export function reportError(
  error: unknown,
  context: Record<string, unknown> = {},
  options: ErrorReportOptions = {},
) {
  // Loaders and server fns commonly throw a raw Response; String(it) is the
  // opaque "[object Response]", so pull out the status and URL instead.
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  const payload = {
    message,
    ...(stack !== undefined && { stack }),
    route: typeof window !== "undefined" ? window.location.pathname : undefined,
    mechanism: options.mechanism ?? "manual",
    severity: options.severity ?? "error",
    ...context,
  };

  // Always log locally so it shows up in the browser console and terminal during dev.
  console.error("[error-reporting]", payload);

  // TODO: forward `payload` to your own logging endpoint or a service like Sentry
  // once the FastAPI backend (or a dedicated logging tool) is wired up. Until then
  // this is console-only — no external telemetry, since Lovable's editor hooks
  // this used to call into (window.__lovableEvents, window.__lovableReportRuntimeError)
  // don't exist outside the Lovable editor preview.
}
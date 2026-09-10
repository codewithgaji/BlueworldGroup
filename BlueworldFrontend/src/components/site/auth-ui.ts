/**
 * Shared visual tokens for the glass-card auth pages (login, request-access).
 * Keeps both pages' input/button styling identical without duplicating
 * long class strings in each route file.
 */

export const authInputWrapperClass = "relative";

export const authInputClass =
  "w-full rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/40 " +
  "border-2 shadow-[3px_3px_0_0_rgba(0,0,0,0.55)] " +
  "focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[1px_1px_0_0_rgba(0,0,0,0.55)]";

export const authInputStyle = {
  background: "rgba(255,255,255,0.08)",
  borderColor: "rgba(255,255,255,0.3)",
};

export const authInputFocusStyle = {
  borderColor: "hsl(var(--accent))",
  background: "rgba(255,255,255,0.12)",
};

export const authInputBlurStyle = authInputStyle;

/**
 * 3D offset-shadow button — solid blue at rest, flips to orange background
 * with blue text on hover, and visibly "presses in" on click.
 */
export const authButtonClass =
  "relative mt-2 w-full overflow-hidden rounded-xl border-2 border-black py-3 text-sm font-bold transition-all " +
  "bg-primary-deep text-primary-foreground " +
  "shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] " +
  "hover:-translate-y-0.5 hover:bg-accent hover:text-primary-deep hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.9)] " +
  "active:translate-y-0.5 active:shadow-[1px_1px_0_0_rgba(0,0,0,0.9)] " +
  "disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-primary-deep disabled:hover:text-primary-foreground";
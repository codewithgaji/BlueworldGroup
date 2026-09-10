import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import { apiFetch, ENDPOINTS, ApiError, fetchWithFallback } from "@/lib/api";
import type { MediaAsset } from "@/lib/types";
import { authInputClass, authInputStyle, authInputFocusStyle, authInputBlurStyle, authButtonClass } from "@/components/site/auth-ui";

export const Route = createFileRoute("/admin/request-access")({
  head: () => ({
    meta: [
      { title: "Request CMS Access — Blue World Cosmetics" },
      { name: "description", content: "Request editor or viewer access to the Blue World Cosmetics CMS." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RequestAccessPage,
});

type RequestedRole = "editor" | "viewer";
const SLIDE_DURATION = 5000;
const FALLBACK_GRADIENT = "linear-gradient(135deg, hsl(var(--primary-deep)) 0%, hsl(var(--primary)) 100%)";

function RequestAccessPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [requestedRole, setRequestedRole] = useState<RequestedRole>("viewer");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [bgImages, setBgImages] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const assets = await fetchWithFallback<MediaAsset[]>(ENDPOINTS.media, []);
      const tagged = assets.filter((a) => a.usedOn?.toLowerCase().includes("admin login"));
      const pool = (tagged.length > 0 ? tagged : assets).slice(0, 4).map((a) => a.url);
      setBgImages(pool);
    })();
  }, []);

  useEffect(() => {
    if (bgImages.length < 2) return;
    const timer = setInterval(() => setCurrentBg((p) => (p + 1) % bgImages.length), SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [bgImages.length]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await apiFetch(ENDPOINTS.requestAccess, {
        method: "POST",
        body: JSON.stringify({ email, password, fullName, requestedRole }),
      });
      setSubmitted(true);
      toast.success("Request submitted — an admin will review it.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.error("An account with this email already exists.");
      } else if (error instanceof ApiError && error.status === 429) {
        toast.error("Too many requests — please try again later.");
      } else {
        toast.error("Could not submit request. Try again shortly.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 z-0" style={{ background: FALLBACK_GRADIENT }}>
        {bgImages.length > 0 && (
          <AnimatePresence mode="sync">
            <motion.div
              key={currentBg}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              style={{
                backgroundImage: `url(${bgImages[currentBg]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "saturate(1.2) contrast(1.08) brightness(1.02)",
              }}
            />
          </AnimatePresence>
        )}

        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0.05) 55%, transparent 70%)",
          }}
          animate={{ backgroundPositionX: ["-40%", "140%"] }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.80) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)" }}
        />
      </div>

      {bgImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {bgImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBg(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentBg ? "24px" : "8px",
                height: "8px",
                background: i === currentBg ? "hsl(var(--primary))" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="absolute bottom-10 left-8 z-10 hidden md:block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
          © {new Date().getFullYear()} Blue World Cosmetics
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md md:ml-auto md:mr-16 lg:mr-24"
      >
        <motion.div
          style={{
            background: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "1.25rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
          className="p-8 sm:p-10"
        >
          {submitted ? (
            <div className="py-4 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-accent" />
              <h1 className="mt-4 text-2xl font-bold text-white">Request sent</h1>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Your access request is pending review. You'll be able to sign in once an admin approves it.
              </p>
              <Link to="/admin/login" className={`mt-6 inline-block ${authButtonClass}`.replace("w-full", "px-8")}>
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="mb-1 text-2xl font-bold text-white">Request CMS Access</h1>
                <p className="text-sm text-white/60">
                  Ask for editor or viewer access — an admin must approve it before you can sign in.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className={authInputClass}
                    style={authInputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, authInputFocusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, authInputBlurStyle)}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className={authInputClass}
                    style={authInputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, authInputFocusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, authInputBlurStyle)}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    minLength={8}
                    className={authInputClass}
                    style={authInputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, authInputFocusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, authInputBlurStyle)}
                  />
                </div>

                <div>
                  <label htmlFor="requestedRole" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
                    Requested role
                  </label>
                  <select
                    id="requestedRole"
                    value={requestedRole}
                    onChange={(e) => setRequestedRole(e.target.value as RequestedRole)}
                    className="w-full rounded-xl border-2 px-4 py-3 text-sm text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.3)" }}
                  >
                    <option value="viewer" className="text-primary-deep">Viewer — read-only access</option>
                    <option value="editor" className="text-primary-deep">Editor — can create and edit content</option>
                  </select>
                </div>

                <button type="submit" disabled={busy} className={authButtonClass}>
                  {busy ? "Submitting…" : "Submit Request"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-white/50">
                Already approved?{" "}
                <Link to="/admin/login" className="font-semibold text-white">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
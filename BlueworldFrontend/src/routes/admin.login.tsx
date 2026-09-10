import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { isDemoSession, login, useAdminUser } from "@/hooks/use-admin-auth";
import { fetchWithFallback, ENDPOINTS } from "@/lib/api";
import type { MediaAsset } from "@/lib/types";
import { authInputClass, authInputStyle, authInputFocusStyle, authInputBlurStyle, authButtonClass } from "@/components/site/auth-ui";





export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "CMS Sign In — Blue World Cosmetics" },
      { name: "description", content: "Secure sign-in for the Blue World Cosmetics content management system." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

const SLIDE_DURATION = 5000;
/** Static fallback so the page never looks broken if no images are uploaded yet. */
const FALLBACK_GRADIENT =
  "linear-gradient(135deg, hsl(var(--primary-deep)) 0%, hsl(var(--primary)) 100%)";

function AdminLoginPage() {
  const navigate = useNavigate();
  const user = useAdminUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [bgImages, setBgImages] = useState<string[]>([]);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && user) void navigate({ to: "/admin" });
  }, [hydrated, user, navigate]);

  useEffect(() => {
    void (async () => {
      const assets = await fetchWithFallback<MediaAsset[]>(ENDPOINTS.media, []);
      // Prefer assets tagged for this use, fall back to the most recent uploads.
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      if (isDemoSession()) {
        toast.warning("Signed in with the offline demo session — backend is unreachable, this is not real data.");
      } else {
        toast.success("Signed in");
      }
      void navigate({ to: "/admin" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      toast.error(message);
      setShake(true);
      setTimeout(() => setShake(false), 600);
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
                // "Glossy" pop — punchier saturation/contrast than a flat photo.
                filter: "saturate(1.2) contrast(1.08) brightness(1.02)",
              }}
            />
          </AnimatePresence>
        )}

        {/* Diagonal light sheen sweeping across the image — the "shiny" pass */}
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
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
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
          <div className="mb-8 text-center">
            <div
              className="mx-auto mb-5 h-16 w-16 overflow-hidden rounded-full border-2 shadow-lg"
              style={{ borderColor: "rgba(255,255,255,0.25)" }}
            >
              <img
                src="/blueworld.png"
                alt="Blue World Cosmetics"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.background = "hsl(var(--primary))";
                    parent.innerHTML =
                      '<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:white;font-size:1.25rem;font-weight:700">BW</span>';
                  }
                }}
              />
            </div>
            <h1 className="mb-1 text-2xl font-bold text-white">Blue World Cosmetics</h1>
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--primary))" }}>
              Admin Portal
            </p>
          </div>

          <div
            className="mb-6 rounded-lg p-3 text-center"
            style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.25)" }}
          >
            <p className="text-xs leading-relaxed text-red-300">
              This portal is strictly for verified Blue World Cosmetics administrators. Unauthorized access is prohibited.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
                            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
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
                className={authInputClass}
                style={authInputStyle}
                onFocus={(e) => Object.assign(e.currentTarget.style, authInputFocusStyle)}
                onBlur={(e) => Object.assign(e.currentTarget.style, authInputBlurStyle)}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-xs text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

                        <motion.button
              type="submit"
              disabled={busy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={authButtonClass}
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="inline-block h-4 w-4 rounded-full border-2"
                    style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "currentColor" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-white/50">
            Need access?{" "}
            <Link to="/admin/request-access" className="font-semibold text-white">
              Request an account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

type AuthMode = "login" | "signup";
type NoticeType = "error" | "success";

type Notice = {
  type: NoticeType;
  message: string;
};

type AuthOverlayProps = {
  isOpen: boolean;
  initialMode?: AuthMode;
  redirectTo?: string;
  onClose: () => void;
};

const AuthOverlay = ({
  isOpen,
  initialMode = "login",
  redirectTo = "/ghumphir/dashboard",
  onClose,
}: AuthOverlayProps) => {
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [googleButtonWidth, setGoogleButtonWidth] = useState(() => {
    if (typeof window === "undefined") return 340;
    return Math.max(220, Math.min(390, window.innerWidth - 90));
  });

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setNotice(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setGoogleButtonWidth(
        Math.max(220, Math.min(390, window.innerWidth - 90)),
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!isOpen) return null;

  const completeAuth = (token: string) => {
    localStorage.setItem("token", token);
    onClose();
    navigate(redirectTo);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (mode === "signup" && password !== confirmPassword) {
      setNotice({ type: "error", message: "Passwords do not match." });
      return;
    }

    const isLogin = mode === "login";
    const url = isLogin
      ? "http://localhost:9000/api/login"
      : "http://localhost:9000/api/signup";

    const body = isLogin
      ? { email, password }
      : { user_name: fullName, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (isLogin) {
        if (!response.ok) {
          setNotice({
            type: "error",
            message: "Email or password is incorrect.",
          });
          return;
        }

        completeAuth(data.token);
        return;
      }

      if (!response.ok) {
        setNotice({ type: "error", message: "Email already exists." });
        return;
      }

      setNotice({
        type: "success",
        message: "Account created. Log in to continue.",
      });
      setMode("login");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Auth request failed:", error);
      setNotice({ type: "error", message: "Something went wrong." });
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    const token = credentialResponse.credential;

    if (!token) {
      setNotice({
        type: "error",
        message: "Google did not return a credential.",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotice({
          type: "error",
          message: data?.error || data?.message || "Google sign-in failed.",
        });
        return;
      }

      completeAuth(data.token);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setNotice({
        type: "error",
        message: "Could not complete Google sign-in.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 text-slate-100 p-6 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Close login overlay"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 outline-none focus:border-sky-400"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 outline-none focus:border-sky-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 pr-11 outline-none focus:border-sky-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {mode === "signup" && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 pr-11 outline-none focus:border-sky-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-400 transition"
          >
            {mode === "login" ? "Log in" : "Create account"}
          </button>

          <div className="pt-1 flex justify-center">
            {googleClientId ? (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setNotice({
                    type: "error",
                    message: "Google sign-in was cancelled or failed.",
                  });
                }}
                text={mode === "login" ? "signin_with" : "signup_with"}
                shape="pill"
                theme="filled_black"
                size="large"
                logo_alignment="left"
                width={googleButtonWidth}
              />
            ) : (
              <button
                type="button"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 text-slate-300"
                onClick={() => {
                  setNotice({
                    type: "error",
                    message:
                      "Google sign-in is not configured in frontend env.",
                  });
                }}
              >
                {mode === "login"
                  ? "Log in with Google"
                  : "Sign up with Google"}
              </button>
            )}
          </div>
        </form>

        {notice && (
          <p
            className={`mt-4 rounded-xl border px-3.5 py-2.5 text-sm ${
              notice.type === "error"
                ? "border-red-500/40 bg-red-500/10 text-red-200"
                : "border-green-500/40 bg-green-500/10 text-green-200"
            }`}
          >
            {notice.message}
          </p>
        )}

        <p className="mt-5 text-sm text-slate-300 text-center">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-semibold text-sky-300 hover:text-sky-200 underline underline-offset-4"
            onClick={() => {
              setMode((prev) => (prev === "login" ? "signup" : "login"));
              setNotice(null);
            }}
          >
            {mode === "login" ? "Create one" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthOverlay;

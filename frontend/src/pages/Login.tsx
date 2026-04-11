import { useEffect, useState } from "react";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import ghumphirLogo from "../assets/ghumphirlogo.png";

type User = {
  fullName?: string;
  email?: string;
  password?: string;
};

type NoticeType = "error" | "success" | "info";

type Notice = {
  type: NoticeType;
  message: string;
};

const App = () => {
  const [, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [googleButtonWidth, setGoogleButtonWidth] = useState(() => {
    if (typeof window === "undefined") return 340;
    return Math.max(220, Math.min(390, window.innerWidth - 90));
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === null) return true;
    return saved === "true";
  });

  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!notice) return;

    const timeoutId = setTimeout(() => {
      setNotice(null);
    }, 3500);

    return () => clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      setGoogleButtonWidth(
        Math.max(220, Math.min(390, window.innerWidth - 90)),
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      setNotice({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

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
            message: "Email or Password incorrect",
          });
          return;
        }

        localStorage.setItem("token", data.token);
        setNotice(null);
        navigate("/ghumphir/dashboard");
        return;
      }

      if (!response.ok) {
        setNotice({
          type: "error",
          message: "Email already exists. Please use a new one.",
        });
        return;
      }

      setUser(body);
      setNotice({
        type: "success",
        message: "Account created successfully. Please log in.",
      });
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error during fetch:", error);
      setNotice({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
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

      localStorage.setItem("token", data.token);
      setNotice(null);
      navigate("/ghumphir/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setNotice({
        type: "error",
        message: "Could not complete Google sign-in.",
      });
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors ${
        darkMode ? "bg-[#071224] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          darkMode
            ? "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.20),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_30%),linear-gradient(135deg,#071224_0%,#0a1630_45%,#08101f_100%)]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_36%),linear-gradient(135deg,#e2e8f0_0%,#f8fafc_48%,#dbeafe_100%)]"
        }`}
      />
      <div
        className={`absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl ${
          darkMode ? "bg-sky-500/20" : "bg-sky-300/25"
        }`}
      />
      <div
        className={`absolute -bottom-32 -right-24 h-96 w-96 rounded-full blur-3xl ${
          darkMode ? "bg-cyan-500/15" : "bg-cyan-300/25"
        }`}
      />

      <div className="relative flex min-h-screen items-center justify-center px-3 py-4 sm:px-6 sm:py-6">
        <div
          className={`w-full max-w-6xl overflow-hidden rounded-4xl backdrop-blur-xl ${
            darkMode
              ? "border border-white/10 bg-white/8 shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
              : "border border-slate-200 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
          }`}
        >
          <div className="grid lg:min-h-170 lg:grid-cols-[1.05fr_0.95fr]">
            <div
              className={`hidden flex-col justify-between p-10 lg:flex lg:p-12 ${
                darkMode
                  ? "border-r border-white/10 bg-[linear-gradient(180deg,rgba(6,19,43,0.28),rgba(6,19,43,0.08))] text-white"
                  : "border-r border-slate-200 bg-[linear-gradient(180deg,rgba(148,163,184,0.14),rgba(226,232,240,0.10))] text-slate-800"
              }`}
            >
              <div>
                <div
                  className={`inline-flex items-center gap-3 rounded-2xl px-4 py-3 ${
                    darkMode
                      ? "border border-white/10 bg-white/8"
                      : "border border-slate-300 bg-white/70"
                  }`}
                >
                  <img
                    src={ghumphirLogo}
                    alt="Ghumphir logo"
                    className="h-10 w-10 rounded object-contain"
                  />
                  <div>
                    <p
                      className={`text-[11px] uppercase tracking-[0.35em] ${
                        darkMode ? "text-white/65" : "text-slate-500"
                      }`}
                    >
                      Ghumphir
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-white/85" : "text-slate-700"
                      }`}
                    >
                      Explore Nepal with one account
                    </p>
                  </div>
                </div>

                <h2
                  className={`mt-10 max-w-xl text-5xl font-semibold tracking-tight leading-[1.02] ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Explore Nepal.
                  <br />
                  Save every memory.
                </h2>

                <p
                  className={`mt-6 max-w-lg text-base leading-7 ${
                    darkMode ? "text-white/78" : "text-slate-600"
                  }`}
                >
                  Plan your next destination, save your wishlist, and keep every
                  trip story in one place with a cleaner, calmer travel
                  workspace.
                </p>
              </div>

              <div
                className={`mt-8 max-w-lg rounded-2xl px-5 py-4 text-sm leading-6 ${
                  darkMode
                    ? "border border-white/10 bg-white/6 text-white/75"
                    : "border border-slate-300 bg-white/65 text-slate-600"
                }`}
              >
                Access your personalized destinations, wishlist, and travel
                history from one secure account.
              </div>
            </div>

            <div
              className={`relative flex items-center justify-center p-4 sm:p-6 lg:p-10 ${
                darkMode ? "bg-[#08162d]/95" : "bg-white/72"
              }`}
            >
              <button
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                className={`absolute right-5 top-5 rounded-xl p-2 transition ${
                  darkMode
                    ? "border border-white/10 bg-white/5 text-sky-200 hover:bg-white/10"
                    : "border border-slate-300 bg-white/80 text-slate-700 hover:bg-slate-100"
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="w-full max-w-120">
                <div className="mb-6 sm:mb-8">
                  <p
                    className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                      darkMode
                        ? "border border-sky-400/20 bg-sky-400/10 text-sky-200"
                        : "border border-sky-400/30 bg-sky-50 text-sky-700"
                    }`}
                  >
                    Welcome back
                  </p>
                  <h1
                    className={`text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {isLogin ? "Continue your journey" : "Start your journey"}
                  </h1>
                  <p
                    className={`mt-3 text-base ${
                      darkMode ? "text-sky-200/90" : "text-slate-600"
                    }`}
                  >
                    Discover places. Track memories.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <input
                      type="text"
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full rounded-2xl px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-sky-500/20 ${
                        darkMode
                          ? "border border-white/10 bg-white/6 text-white placeholder:text-slate-400 focus:border-sky-400/50 focus:bg-white/8"
                          : "border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-sky-500/60"
                      }`}
                      required
                    />
                  )}

                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-2xl px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-sky-500/20 ${
                      darkMode
                        ? "border border-white/10 bg-white/6 text-white placeholder:text-slate-400 focus:border-sky-400/50 focus:bg-white/8"
                        : "border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-sky-500/60"
                    }`}
                    required
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full rounded-2xl px-4 py-3.5 pr-12 outline-none transition focus:ring-2 focus:ring-sky-500/20 ${
                        darkMode
                          ? "border border-white/10 bg-white/6 text-white placeholder:text-slate-400 focus:border-sky-400/50 focus:bg-white/8"
                          : "border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-sky-500/60"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                        darkMode ? "text-sky-300" : "text-sky-600"
                      }`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {!isLogin && (
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full rounded-2xl px-4 py-3.5 pr-12 outline-none transition focus:ring-2 focus:ring-sky-500/20 ${
                          darkMode
                            ? "border border-white/10 bg-white/6 text-white placeholder:text-slate-400 focus:border-sky-400/50 focus:bg-white/8"
                            : "border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-sky-500/60"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                          darkMode ? "text-sky-300" : "text-sky-600"
                        }`}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-sky-500 py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(14,165,233,0.25)] transition hover:bg-sky-400"
                  >
                    {isLogin ? "Log in" : "Create account"}
                  </button>

                  <div className="space-y-3 pt-2">
                    {googleClientId ? (
                      <div className="w-full flex justify-center">
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={() => {
                            setNotice({
                              type: "error",
                              message:
                                "Google sign-in was cancelled or failed.",
                            });
                          }}
                          text={isLogin ? "signin_with" : "signup_with"}
                          shape="pill"
                          theme={darkMode ? "filled_black" : "outline"}
                          size="large"
                          logo_alignment="left"
                          width={googleButtonWidth}
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setNotice({
                            type: "error",
                            message:
                              "VITE_GOOGLE_CLIENT_ID is missing in the frontend environment.",
                          });
                        }}
                        className="w-full rounded-2xl border border-white/10 bg-white/8 py-3.5 font-medium text-slate-400 cursor-not-allowed"
                      >
                        {isLogin ? "Log in with Google" : "Sign up with Google"}
                      </button>
                    )}
                  </div>
                </form>

                {notice && (
                  <div
                    className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${
                      notice.type === "error"
                        ? "border-red-300 bg-red-50 text-red-700"
                        : notice.type === "success"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-sky-300 bg-sky-50 text-sky-700"
                    }`}
                  >
                    {notice.message}
                  </div>
                )}

                <p
                  className={`mt-6 text-center text-sm ${
                    darkMode ? "text-sky-200" : "text-sky-700"
                  }`}
                >
                  {isLogin ? "New here?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setNotice(null);
                    }}
                    className={`font-semibold underline decoration-2 underline-offset-4 ${
                      darkMode
                        ? "text-white decoration-sky-400/70 hover:text-sky-200"
                        : "text-sky-800 decoration-sky-500/80 hover:text-sky-700"
                    }`}
                  >
                    {isLogin ? "Create one" : "Log in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

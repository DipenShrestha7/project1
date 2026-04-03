import { useEffect, useState } from "react";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === null) return true;
    return saved === "true";
  });

  const navigate = useNavigate();

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
      } else {
        if (!response.ok) {
          setNotice({
            type: "error",
            message: "Email already exists. Please use a new one.",
          });
          return;
        }
      }
      console.log("Success:", data);
      if (isLogin) {
        localStorage.setItem("token", data.token);
        setNotice(null);
        navigate("/ghumphir/dashboard");
      } else {
        setUser(body);
        setNotice({
          type: "success",
          message: "Account created successfully. Please log in.",
        });
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setNotice({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  };
  const guestLogin = () => {
    localStorage.removeItem("token");
    navigate("/ghumphir/dashboard");
  };

  const handleGoogleAuthPlaceholder = () => {
    setNotice({
      type: "info",
      message: `${isLogin ? "Google login" : "Google signup"} will be available soon.`,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-100 dark:bg-[#06142d] transition-colors">
      <div className="absolute -top-36 -left-28 w-96 h-96 rounded-full bg-sky-500/25 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 w-md h-md rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/90 shadow-2xl overflow-hidden">
          <div className="hidden md:flex flex-col justify-between p-10 bg-linear-to-b from-sky-600 to-cyan-700 text-white">
            <div>
              <div className="inline-flex items-center gap-3 rounded-2xl px-1 py-1">
                <img
                  src={ghumphirLogo}
                  alt="Ghumphir logo"
                  className="h-10 w-10 rounded object-contain"
                />
                <p className="text-2 uppercase tracking-[0.22em] text-white/90">
                  Ghumphir
                </p>
              </div>
              <h2 className="mt-6 text-4xl leading-tight font-semibold">
                Explore Nepal.
                <br />
                Save every memory.
              </h2>
            </div>
            <p className="text-sm text-white/85 max-w-xs">
              Plan your next destination, build your wishlist, and keep your
              travel history in one place.
            </p>
          </div>

          <div className="relative p-6 sm:p-8 md:p-10 bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="absolute top-5 right-5 p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="text-left mb-7 pr-12">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {isLogin ? "Continue your journey" : "Start your journey"}
              </h1>
              <p className="text-sky-700 dark:text-sky-300 mt-2 text-sm">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300"
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
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300"
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
                className="w-full py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
              >
                {isLogin ? "Log in" : "Create account"}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleAuthPlaceholder}
                  className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  {isLogin ? "Log in with Google" : "Sign up with Google"}
                </button>
                <button
                  type="button"
                  onClick={guestLogin}
                  className="w-full py-3 rounded-xl border border-sky-600 text-sky-700 dark:text-sky-300 dark:border-sky-500 font-medium hover:bg-sky-50 dark:hover:bg-slate-800 transition"
                >
                  Login as Guest
                </button>
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
            <p className="text-center text-sky-700 dark:text-sky-300 mt-6 text-sm">
              {isLogin ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setNotice(null);
                }}
                className="text-sky-800 dark:text-sky-200 font-medium hover:underline"
              >
                {isLogin ? "Create one" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

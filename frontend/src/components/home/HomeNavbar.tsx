import logo from "../../assets/ghumphirlogo.png";
import { Moon, Sun } from "lucide-react";

type HomeNavbarProps = {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
};

const HomeNavbar = ({
  darkMode,
  onToggleTheme,
  onOpenLogin,
  onOpenSignup,
}: HomeNavbarProps) => {
  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
        darkMode
          ? "bg-slate-950/70 border-white/10"
          : "bg-white/85 border-slate-200/80"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <a href="/ghumphir" className="inline-flex items-center gap-2.5">
          <img
            src={logo}
            alt="Ghumphir logo"
            className="h-9 w-9 rounded object-contain"
          />
          <span
            className={`font-semibold tracking-wide ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Ghumphir
          </span>
        </a>

        <nav
          className={`hidden md:flex items-center gap-6 text-sm ${
            darkMode ? "text-slate-200" : "text-slate-700"
          }`}
        >
          <a href="#features" className="hover:text-sky-300 transition">
            Features
          </a>
          <a href="#explore" className="hover:text-sky-300 transition">
            Explore
          </a>
          <a href="#faq" className="hover:text-sky-300 transition">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border transition ${
              darkMode
                ? "border-slate-400/40 text-slate-100 hover:border-sky-300 hover:text-sky-200"
                : "border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-700 bg-white"
            }`}
            title="Toggle dashboard and home theme"
            aria-label="Toggle dashboard and home theme"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            Theme
          </button>
          <button
            type="button"
            onClick={onOpenLogin}
            className={`px-4 py-2 text-sm rounded-xl border transition ${
              darkMode
                ? "border-slate-400/40 text-slate-100 hover:border-sky-300 hover:text-sky-200"
                : "border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-700 bg-white"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={onOpenSignup}
            className="px-4 py-2 text-sm rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-400 transition"
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;

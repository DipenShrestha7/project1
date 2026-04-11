import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthOverlay from "../components/auth/AuthOverlay";
import HomeFeatures from "../components/home/HomeFeatures";
import HomeHero from "../components/home/HomeHero";
import HomeInfoSections from "../components/home/HomeInfoSections";
import HomeNavbar from "../components/home/HomeNavbar";
import SeoMeta from "../components/shared/SeoMeta";

type HomeProps = {
  darkMode: boolean;
  onToggleTheme: () => void;
};

const Home = ({ darkMode, onToggleTheme }: HomeProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const authParam = searchParams.get("auth");
  const nextParam = searchParams.get("next");

  // ✅ derived state (no useState, no useEffect)
  const isAuthOpen = !!authParam;
  const mode: "login" | "signup" = authParam === "signup" ? "signup" : "login";

  const redirectPath = useMemo(() => {
    if (nextParam && nextParam.startsWith("/")) {
      return nextParam;
    }
    return "/ghumphir/dashboard";
  }, [nextParam]);

  const openAuth = (targetMode: "login" | "signup") => {
    const params = new URLSearchParams(searchParams);
    params.set("auth", targetMode);
    setSearchParams(params);
  };

  const closeAuth = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("auth");
    setSearchParams(params);
  };

  const handleLoginToDashboard = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/ghumphir/dashboard");
      return;
    }
    openAuth("login");
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-[radial-gradient(circle_at_top_left,#1d4ed8_0%,#0f172a_36%,#020617_100%)]"
          : "bg-white"
      }`}
    >
      <SeoMeta
        title="Ghumphir | Nepal Travel Planner, Wishlist, and Journey Tracker"
        description="Explore Nepal destinations, save your wishlist, and track travel history with Ghumphir. Sign in with Google or email to unlock your personalized dashboard."
        canonicalPath="/ghumphir"
      />

      <HomeNavbar
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        onOpenLogin={() => openAuth("login")}
        onOpenSignup={() => openAuth("signup")}
      />
      <main>
        <HomeHero darkMode={darkMode} onOpenLogin={handleLoginToDashboard} />
        <HomeFeatures darkMode={darkMode} />
        <HomeInfoSections darkMode={darkMode} />
      </main>

      <footer
        className={`border-t ${darkMode ? "border-white/10" : "border-slate-200"}`}
      >
        <div
          className={`mx-auto max-w-6xl px-4 sm:px-6 py-7 text-sm flex flex-wrap items-center justify-between gap-2 ${
            darkMode ? "text-slate-300" : "text-slate-600"
          }`}
        >
          <p>
            © {new Date().getFullYear()} Ghumphir. Crafted for travel lovers.
          </p>
        </div>
      </footer>

      <AuthOverlay
        isOpen={isAuthOpen}
        initialMode={mode}
        redirectTo={redirectPath}
        onClose={closeAuth}
      />
    </div>
  );
};

export default Home;

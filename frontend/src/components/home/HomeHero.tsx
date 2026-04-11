type HomeHeroProps = {
  darkMode: boolean;
  onOpenLogin: () => void;
};

const quickActions = [
  {
    title: "Explore destinations",
    description: "Browse cities and locations with visual details.",
  },
  {
    title: "Build your wishlist",
    description: "Create and manage your destination wishlist.",
  },
  {
    title: "Capture travel memories",
    description: "Track visited places and write travel reviews.",
  },
  {
    title: "Plan with AI",
    description: "Use AI chat to refine your trip ideas.",
  },
];

const HomeHero = ({ darkMode, onOpenLogin }: HomeHeroProps) => {
  return (
    <section className="relative overflow-hidden">
      <div
        className={`absolute -top-32 -left-20 h-80 w-80 rounded-full blur-3xl ${
          darkMode ? "bg-sky-500/30" : "bg-slate-200/50"
        }`}
      />
      <div
        className={`absolute -bottom-36 right-0 h-96 w-96 rounded-full blur-3xl ${
          darkMode ? "bg-cyan-500/20" : "bg-slate-100/70"
        }`}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <p
            className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.26em] ${
              darkMode
                ? "border-sky-300/30 bg-sky-400/10 text-sky-200"
                : "border-sky-200 bg-sky-50 text-sky-700"
            }`}
          >
            Nepal Travel Platform
          </p>
          <h1
            className={`mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.02] ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Travel smarter.
            <br />
            Keep every memory in one place.
          </h1>
          <p
            className={`mt-6 max-w-2xl text-base sm:text-lg leading-8 ${
              darkMode ? "text-slate-200" : "text-slate-700"
            }`}
          >
            Ghumphir helps you discover destinations, save wishlists, and build
            a personal travel history across Nepal with a smooth dashboard
            experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-xl bg-sky-500 px-6 py-3 text-white font-semibold hover:bg-sky-400 transition"
            >
              Login To Dashboard
            </button>
            <a
              href="/ghumphir/dashboard"
              onClick={() => localStorage.removeItem("token")}
              className="rounded-xl border border-black px-6 py-3 text-black hover:border-sky-300 hover:text-sky-200 transition"
            >
              Explore As Guest
            </a>
          </div>
        </div>

        <div
          className={`rounded-3xl border backdrop-blur-md p-6 sm:p-8 ${
            darkMode
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-white/85 shadow-lg shadow-slate-200/60"
          }`}
        >
          <h2
            className={`text-2xl font-semibold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            What You Can Do
          </h2>
          <ul className="mt-5 space-y-3">
            {quickActions.map((item, index) => (
              <li
                key={item.title}
                className={`group flex items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                  darkMode
                    ? "border-white/10 bg-slate-900/35 hover:border-sky-300/40 hover:bg-slate-900/55"
                    : "border-slate-200 bg-slate-50 hover:border-sky-200 hover:bg-white"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                    darkMode
                      ? "border-sky-300/40 bg-sky-500/20 text-sky-100"
                      : "border-sky-200 bg-sky-50 text-sky-700"
                  }`}
                >
                  {index + 1}
                </span>
                <span>
                  <span
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`mt-0.5 block text-sm ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {item.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

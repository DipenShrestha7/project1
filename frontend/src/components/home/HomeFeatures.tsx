const features = [
  {
    title: "Destination Discovery",
    description:
      "Find cities, compare highlights, and quickly open location details with maps and images.",
  },
  {
    title: "Wishlist + History",
    description:
      "Save dream places now, then mark them as visited later with your own ratings and reviews.",
  },
  {
    title: "Google + Email Auth",
    description:
      "Sign in with Google or standard credentials and continue where you left off.",
  },
];

type HomeFeaturesProps = {
  darkMode: boolean;
};

const HomeFeatures = ({ darkMode }: HomeFeaturesProps) => {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16"
    >
      <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
        {features.map((feature) => (
          <article
            key={feature.title}
            className={`rounded-2xl border p-6 backdrop-blur-sm ${
              darkMode
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white shadow-lg shadow-slate-200/60"
            }`}
          >
            <h3
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {feature.title}
            </h3>
            <p
              className={`mt-3 leading-7 ${
                darkMode ? "text-slate-200" : "text-slate-600"
              }`}
            >
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HomeFeatures;

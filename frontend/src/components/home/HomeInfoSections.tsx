type HomeInfoSectionsProps = {
  darkMode: boolean;
};

const HomeInfoSections = ({ darkMode }: HomeInfoSectionsProps) => {
  return (
    <>
      <section
        id="explore"
        className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14"
      >
        <div
          className={`rounded-3xl border p-7 sm:p-10 ${
            darkMode
              ? "border-white/10 bg-linear-to-br from-slate-900/70 via-slate-800/55 to-sky-900/40"
              : "border-slate-200 bg-white shadow-lg shadow-slate-200/60"
          }`}
        >
          <h2
            className={`text-3xl sm:text-4xl font-semibold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Built For Real Trip Planning
          </h2>
          <p
            className={`mt-4 max-w-3xl leading-8 ${
              darkMode ? "text-slate-200" : "text-slate-600"
            }`}
          >
            Unlike generic list-style travel apps, Ghumphir combines
            exploration, wishlist management, and travel journaling in one
            interface. You can browse public content as a guest and switch to
            account mode when you want to save personalized progress.
          </p>
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-20"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <article
            className={`rounded-2xl border p-6 ${
              darkMode
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white shadow-lg shadow-slate-200/60"
            }`}
          >
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Do I need an account?
            </h3>
            <p
              className={`mt-3 leading-7 ${
                darkMode ? "text-slate-200" : "text-slate-600"
              }`}
            >
              No. You can explore as a guest. To save wishlist items, travel
              history, and profile settings, log in from the overlay.
            </p>
          </article>
          <article
            className={`rounded-2xl border p-6 ${
              darkMode
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white shadow-lg shadow-slate-200/60"
            }`}
          >
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Is it only for Nepal?
            </h3>
            <p
              className={`mt-3 leading-7 ${
                darkMode ? "text-slate-200" : "text-slate-600"
              }`}
            >
              Yes, for now Ghumphir is focused on destinations inside Nepal.
              Support for other countries will be added in a future update.
            </p>
          </article>
        </div>
      </section>
    </>
  );
};

export default HomeInfoSections;

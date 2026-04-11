import React from "react";
import { CalendarDays, Compass, PenSquare, Star, Trash2 } from "lucide-react";
import type { HistoryItem, Locations, ActiveSection } from "./types";

interface TravelHistoryViewProps {
  travelHistoryItems: HistoryItem[];
  Locations: Locations[];
  expandedReviewLocationIds: Set<number>;
  toggleReviewSection: (id: number) => void;
  reviewTextDrafts: Record<number, string>;
  setReviewTextDrafts: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
  ratingDrafts: Record<number, number>;
  setRatingDrafts: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  savingReviewLocationId: number | null;
  saveReviewForLocation: (id: number) => Promise<void>;
  deleteReviewForLocation: (id: number) => Promise<void>;
  initiateDeleteReview: (id: number) => void;
  deletingReviewLocationId: number | null;
  confirmDeleteReviewLocationId: number | null;
  setConfirmDeleteReviewLocationId: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  setActiveSection: (s: ActiveSection) => void;
  setSelectedCity: (id: number | null) => void;
  setSelectedLocation: (id: number | null) => void;
}

const TravelHistoryView: React.FC<TravelHistoryViewProps> = ({
  travelHistoryItems,
  Locations,
  expandedReviewLocationIds,
  toggleReviewSection,
  reviewTextDrafts,
  setReviewTextDrafts,
  ratingDrafts,
  setRatingDrafts,
  savingReviewLocationId,
  saveReviewForLocation,
  deleteReviewForLocation,
  initiateDeleteReview,
  deletingReviewLocationId,
  confirmDeleteReviewLocationId,
  setConfirmDeleteReviewLocationId,
  setActiveSection,
  setSelectedCity,
  setSelectedLocation,
}) => {
  const totalReviews = travelHistoryItems.filter(
    (item) => (item.review_text ?? "").trim().length > 0,
  ).length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-sky-100/80 bg-linear-to-br from-white via-sky-50/65 to-cyan-50/45 p-6 shadow-sm dark:border-sky-500/20 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/40">
        <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-sky-200/45 blur-2xl dark:bg-sky-500/20" />
        <div className="relative">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-sky-300">
            Travel History
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Revisit places you explored, keep ratings up to date, and refine
            your notes anytime.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full border border-sky-200 bg-white/90 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-200">
              {travelHistoryItems.length} visited spots
            </span>
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-white/90 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200">
              {totalReviews} reviews saved
            </span>
          </div>
        </div>
      </div>

      {travelHistoryItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-slate-500 dark:text-slate-400">
            No visited locations yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max items-start">
          {travelHistoryItems.map((historyItem) => {
            const loc = Locations.find((l) => l.id === historyItem.location_id);
            if (!loc) return null;

            const isExpanded = expandedReviewLocationIds.has(loc.id);
            const hasReview =
              historyItem.review_text !== null &&
              historyItem.review_text !== undefined &&
              historyItem.review_text !== "";
            const draftReviewText = reviewTextDrafts[loc.id] ?? "";
            const draftRating = ratingDrafts[loc.id] ?? 1;

            return (
              <div
                key={loc.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-sky-400 via-cyan-400 to-emerald-400 opacity-80" />
                <div className="pl-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-sky-200">
                        {loc.name}
                      </h3>
                      {historyItem.travel_date && (
                        <p className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <CalendarDays size={12} />
                          Visited {historyItem.travel_date}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                      #{loc.id}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {loc.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection("cities");
                        setSelectedCity(loc.city_id);
                        setSelectedLocation(loc.id);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      <Compass size={15} />
                      Open Location
                    </button>

                    <button
                      type="button"
                      disabled={savingReviewLocationId === loc.id}
                      onClick={async () => {
                        if (isExpanded) {
                          await saveReviewForLocation(loc.id);
                        }
                        toggleReviewSection(loc.id);
                      }}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                        savingReviewLocationId === loc.id
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <PenSquare size={15} />
                      {isExpanded
                        ? savingReviewLocationId === loc.id
                          ? "Saving..."
                          : "Save Review"
                        : hasReview
                          ? "Update Review"
                          : "Write Review"}
                    </button>
                  </div>

                  {isExpanded ? (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                      <p className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Review & Rating
                      </p>

                      <div className="mb-3">
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                          Review
                        </label>
                        <textarea
                          value={draftReviewText}
                          onChange={(e) =>
                            setReviewTextDrafts((prev) => ({
                              ...prev,
                              [loc.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                          rows={4}
                          placeholder="Write your experience..."
                        />
                      </div>

                      <div className="mb-1">
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                          Rating
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[1, 2, 3, 4, 5].map((n) => {
                            const isActive = n <= draftRating;
                            return (
                              <button
                                type="button"
                                key={n}
                                onClick={() =>
                                  setRatingDrafts((prev) => ({
                                    ...prev,
                                    [loc.id]: n,
                                  }))
                                }
                                aria-label={`Set rating to ${n}`}
                                className="rounded-md p-1 transition hover:bg-slate-200/80 dark:hover:bg-slate-700"
                              >
                                <Star
                                  size={20}
                                  className={
                                    isActive
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-slate-300 fill-none dark:text-slate-500"
                                  }
                                  fill={isActive ? "currentColor" : "none"}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : hasReview ? (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-800/50">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            Your Review
                          </p>
                          <p className="mb-2 text-slate-600 dark:text-slate-300">
                            <span className="inline-flex items-center gap-1 align-middle">
                              {[1, 2, 3, 4, 5].map((n) => {
                                const isActive = n <= (historyItem.rating ?? 0);
                                return (
                                  <Star
                                    key={n}
                                    size={16}
                                    className={
                                      isActive
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-slate-300 fill-none dark:text-slate-500"
                                    }
                                    fill={isActive ? "currentColor" : "none"}
                                  />
                                );
                              })}
                            </span>
                          </p>
                          <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                            {historyItem.review_text}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={deletingReviewLocationId === loc.id}
                          onClick={() => initiateDeleteReview(loc.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition whitespace-nowrap ${
                            deletingReviewLocationId === loc.id
                              ? "bg-red-200 text-red-400 cursor-not-allowed dark:bg-red-900/30"
                              : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                          }`}
                        >
                          <Trash2 size={15} />
                          {deletingReviewLocationId === loc.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {confirmDeleteReviewLocationId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Delete Review?
            </h3>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteReviewLocationId(null)}
                className="rounded-lg bg-slate-200 px-4 py-2 text-slate-900 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  deleteReviewForLocation(confirmDeleteReviewLocationId)
                }
                disabled={
                  deletingReviewLocationId === confirmDeleteReviewLocationId
                }
                className={`rounded-lg px-4 py-2 text-white transition ${
                  deletingReviewLocationId === confirmDeleteReviewLocationId
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deletingReviewLocationId === confirmDeleteReviewLocationId
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelHistoryView;

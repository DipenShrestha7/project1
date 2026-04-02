import React from "react";
import { Star } from "lucide-react";
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
  return (
    <div>
      <h2 className="text-3xl font-semibold text-sky-900 dark:text-sky-400 mb-4">
        Travel History
      </h2>
      {travelHistoryItems.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">
          No visited locations yet.
        </p>
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
                className="bg-white dark:bg-gray-800 py-3 px-4 rounded-2xl shadow-md"
              >
                <h3 className="text-lg font-semibold text-sky-800 dark:text-sky-300">
                  {loc.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 mb-2 text-justify">
                  {loc.description}
                </p>
                {historyItem.travel_date && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                    Visited: {historyItem.travel_date}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-2 flex-wrap mb-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection("cities");
                      setSelectedCity(loc.city_id);
                      setSelectedLocation(loc.id);
                    }}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                  >
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
                    className={`px-4 py-2 rounded-lg transition ${
                      savingReviewLocationId === loc.id
                        ? "bg-slate-200 dark:bg-gray-800 text-slate-400 cursor-not-allowed"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-gray-600"
                    }`}
                  >
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
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                    <p className="text-sm font-semibold text-sky-900 dark:text-sky-300 mb-3">
                      Review & Rating
                    </p>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
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
                        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                        rows={4}
                        placeholder="Write your experience..."
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                        Rating
                      </label>
                      <div className="flex items-center gap-1 flex-wrap">
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
                              className="p-0.5 rounded hover:bg-slate-200/60 dark:hover:bg-black/20 transition"
                            >
                              <Star
                                size={20}
                                className={
                                  isActive
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-slate-300 fill-none"
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
                  <div className="mt-4 text-sm">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                          Your Review
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mb-2">
                          <span className="inline-flex items-center gap-1 align-middle">
                            {[1, 2, 3, 4, 5].map((n) => {
                              const isActive = n <= (historyItem.rating ?? 0);
                              return (
                                <Star
                                  key={n}
                                  size={16}
                                  className={
                                    isActive
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-slate-300 fill-none"
                                  }
                                  fill={isActive ? "currentColor" : "none"}
                                />
                              );
                            })}
                          </span>
                        </p>
                        <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                          {historyItem.review_text}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={deletingReviewLocationId === loc.id}
                        onClick={() => initiateDeleteReview(loc.id)}
                        className={`px-5 py-2 text-sm rounded-lg transition whitespace-nowrap ${
                          deletingReviewLocationId === loc.id
                            ? "bg-red-200 dark:bg-red-900/30 text-red-400 cursor-not-allowed"
                            : "bg-red-200 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40"
                        }`}
                      >
                        {deletingReviewLocationId === loc.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {confirmDeleteReviewLocationId !== null && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Delete Review?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDeleteReviewLocationId(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-gray-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-gray-600 transition"
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
                className={`px-4 py-2 rounded-lg text-white transition ${
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

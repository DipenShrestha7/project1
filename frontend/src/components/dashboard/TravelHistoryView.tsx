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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
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
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
              >
                <h3 className="text-lg font-semibold text-sky-800 dark:text-sky-300">
                  {loc.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 mb-3">
                  {loc.description}
                </p>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
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
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <p className="text-sm font-semibold text-sky-900 dark:text-sky-300">
                        Review & Rating
                      </p>
                      {historyItem.travel_date && (
                        <p className="text-xs text-slate-500 dark:text-slate-300">
                          Visited: {historyItem.travel_date}
                        </p>
                      )}
                    </div>

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
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TravelHistoryView;

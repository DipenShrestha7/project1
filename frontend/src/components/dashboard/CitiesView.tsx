import React from "react";
import { Heart, History, MapPin, MoreVertical, Search } from "lucide-react";
import type { Cities, Locations } from "./types";

interface CitiesViewProps {
  currentCity?: Cities;
  filteredLocations: Locations[];
  setSelectedLocation: (id: number | null) => void;
  wishlistCityIds: Set<number>;
  toggleCityWishlist: (id: number) => void;
  wishlistLocationIds: Set<number>;
  toggleLocationWishlist: (id: number) => void;
  travelHistoryLocationIds: Set<number>;
  toggleLocationCollection: (
    locationId: number,
    collection: "wishlist" | "travelHistory",
  ) => void;
}

const CitiesView: React.FC<CitiesViewProps> = ({
  currentCity,
  filteredLocations,
  setSelectedLocation,
  wishlistCityIds,
  toggleCityWishlist,
  wishlistLocationIds,
  toggleLocationWishlist,
  travelHistoryLocationIds,
  toggleLocationCollection,
}) => {
  const [activeDropdownId, setActiveDropdownId] = React.useState<number | null>(
    null,
  );
  const [activeWishlistDropdownId, setActiveWishlistDropdownId] =
    React.useState<number | null>(null);
  const [locationSearchInput, setLocationSearchInput] = React.useState("");
  const locationCount = filteredLocations.length;
  const visitedCount = filteredLocations.filter((loc) =>
    travelHistoryLocationIds.has(loc.id),
  ).length;
  const wishlistCount = filteredLocations.filter((loc) =>
    wishlistLocationIds.has(loc.id),
  ).length;
  const normalizedSearch = locationSearchInput.trim().toLowerCase();
  const displayedLocations = normalizedSearch
    ? filteredLocations.filter((loc) => {
        const searchableText =
          `${loc.name} ${loc.description ?? ""}`.toLowerCase();
        return searchableText.includes(normalizedSearch);
      })
    : filteredLocations;

  return (
    <div
      onClick={() => {
        setActiveDropdownId(null);
        setActiveWishlistDropdownId(null);
      }}
    >
      <section className="mb-7 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-slate-50 to-sky-100 p-5 sm:p-6 shadow-lg shadow-slate-300/40 dark:border-white/10 dark:from-slate-900/60 dark:via-slate-800/45 dark:to-sky-950/35 dark:shadow-black/10">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-sky-700 dark:text-sky-300">
              {currentCity?.name?.toUpperCase()}
            </h2>
            <p className="mt-3 max-w-3xl text-sm sm:text-base leading-7 text-slate-700 dark:text-slate-200/90">
              {currentCity?.description || "No description available"}
            </p>
            {currentCity && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleCityWishlist(currentCity.id);
                  }}
                  className={`inline-flex items-center justify-center gap-2 self-start rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${wishlistCityIds.has(currentCity.id) ? "border-pink-300 bg-pink-100 text-pink-700 hover:bg-pink-200 dark:border-pink-500/40 dark:bg-pink-500/15 dark:text-pink-100" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-gray-800/70 dark:text-slate-100 dark:hover:bg-gray-700"}`}
                  aria-label={
                    wishlistCityIds.has(currentCity.id)
                      ? `Remove ${currentCity.name} from wishlist`
                      : `Add ${currentCity.name} to wishlist`
                  }
                  title={
                    wishlistCityIds.has(currentCity.id)
                      ? `Remove ${currentCity.name} from wishlist`
                      : `Add ${currentCity.name} to wishlist`
                  }
                >
                  <Heart
                    size={16}
                    fill={
                      wishlistCityIds.has(currentCity.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                  {wishlistCityIds.has(currentCity.id)
                    ? "Remove City from Wishlist"
                    : "Add City to Wishlist"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/6">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-200/85">
                <MapPin size={15} className="text-sky-600 dark:text-sky-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Locations
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                {locationCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/6">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-200/85">
                <History
                  size={15}
                  className="text-emerald-600 dark:text-emerald-300"
                />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Visited
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                {visitedCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/6">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-200/85">
                <Heart size={15} className="text-pink-600 dark:text-pink-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Wishlist
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                {wishlistCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4 grid gap-3 md:grid-cols-[auto_minmax(22rem,36rem)] md:items-center md:justify-start md:gap-4">
        <h3 className="text-2xl font-semibold text-sky-900 dark:text-sky-400">
          Locations
        </h3>
        <div className="w-full">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={locationSearchInput}
              onChange={(event) => setLocationSearchInput(event.target.value)}
              placeholder="Search locations"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-900/45 dark:text-slate-100 dark:focus:border-sky-300 dark:focus:ring-sky-500/25"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {displayedLocations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => setSelectedLocation(loc.id)}
            className={`group relative cursor-pointer overflow-visible rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-lg shadow-slate-300/40 transition hover:-translate-y-0.5 hover:border-sky-300/45 hover:bg-slate-50 hover:shadow-xl dark:border-white/10 dark:bg-white/6 dark:shadow-black/10 dark:hover:border-sky-300/25 dark:hover:bg-white/8 ${
              activeWishlistDropdownId === loc.id || activeDropdownId === loc.id
                ? "z-40"
                : "z-0"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-xl font-semibold text-sky-700 transition group-hover:text-sky-600 dark:text-sky-200 dark:group-hover:text-sky-100">
                  {loc.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {loc.description ||
                    "Open this location to view images and details."}
                </p>
              </div>

              {(wishlistLocationIds.has(loc.id) ||
                travelHistoryLocationIds.has(loc.id)) && (
                <div className="flex shrink-0 flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  {wishlistLocationIds.has(loc.id) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-300 bg-pink-100 px-2.5 py-1 text-pink-700 dark:border-pink-300/30 dark:bg-pink-500/15 dark:text-pink-100">
                      <Heart size={12} />
                      Wishlist
                    </span>
                  )}
                  {travelHistoryLocationIds.has(loc.id) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-1 text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-500/15 dark:text-emerald-100">
                      <History size={12} />
                      Visited
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="relative">
                {wishlistLocationIds.has(loc.id) ? (
                  <div className="flex w-full overflow-hidden rounded-2xl border border-pink-300 bg-pink-100 dark:border-pink-300/25 dark:bg-pink-500/14">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-pink-700 dark:text-pink-100"
                    >
                      <Heart size={15} fill="currentColor" />
                      In Wishlist
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveWishlistDropdownId(
                          activeWishlistDropdownId === loc.id ? null : loc.id,
                        );
                        setActiveDropdownId(null);
                      }}
                      className="flex items-center justify-center border-l border-pink-300 px-3 text-pink-700 transition hover:bg-pink-200 dark:border-pink-300/25 dark:text-pink-100 dark:hover:bg-pink-500/20"
                    >
                      <MoreVertical size={15} />
                    </button>

                    {activeWishlistDropdownId === loc.id && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xl dark:border-slate-700 dark:bg-gray-800">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLocationWishlist(loc.id);
                            setActiveWishlistDropdownId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Remove from Wishlist
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveWishlistDropdownId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleLocationWishlist(loc.id);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-gray-800/60 dark:text-slate-200 dark:hover:bg-gray-700"
                  >
                    <Heart size={15} />
                    Add to Wishlist
                  </button>
                )}
              </div>

              <div className="relative">
                {travelHistoryLocationIds.has(loc.id) ? (
                  <div className="flex w-full overflow-hidden rounded-2xl border border-emerald-300 bg-emerald-100 dark:border-emerald-300/25 dark:bg-emerald-500/14">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-100"
                    >
                      <History size={15} fill="currentColor" />
                      Visited
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveDropdownId(
                          activeDropdownId === loc.id ? null : loc.id,
                        );
                        setActiveWishlistDropdownId(null);
                      }}
                      className="flex items-center justify-center border-l border-emerald-300 px-3 text-emerald-700 transition hover:bg-emerald-200 dark:border-emerald-300/25 dark:text-emerald-100 dark:hover:bg-emerald-500/20"
                    >
                      <MoreVertical size={15} />
                    </button>

                    {activeDropdownId === loc.id && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xl dark:border-slate-700 dark:bg-gray-800">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLocationCollection(loc.id, "travelHistory");
                            setActiveDropdownId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Remove from Visited
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleLocationCollection(loc.id, "travelHistory");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-gray-800/60 dark:text-slate-200 dark:hover:bg-gray-700"
                  >
                    <History size={15} />
                    Mark Visited
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400/90">
              Tap to view images
            </p>
          </div>
        ))}
      </div>

      {displayedLocations.length === 0 && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/35 dark:text-slate-300">
          No locations matched your search.
        </div>
      )}
    </div>
  );
};

export default CitiesView;

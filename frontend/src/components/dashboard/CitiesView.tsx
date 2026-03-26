import React from "react";
import { Heart, History, MoreVertical } from "lucide-react";
import type { Cities, Locations } from "./types";

interface CitiesViewProps {
  currentCity?: Cities;
  filteredLocations: Locations[];
  setSelectedLocation: (id: number | null) => void;
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

  return (
    <div
      onClick={() => {
        setActiveDropdownId(null);
        setActiveWishlistDropdownId(null);
      }}
    >
      <h2 className="text-3xl font-semibold text-sky-900 dark:text-sky-400 mb-2">
        {currentCity?.name?.toUpperCase()}
      </h2>
      <p className="mb-6 text-justify text-slate-700 dark:text-slate-300">
        {currentCity?.description || "No description available"}
      </p>

      <h3 className="text-2xl font-semibold text-sky-900 dark:text-sky-400 mb-4">
        Locations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLocations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => setSelectedLocation(loc.id)}
            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-sky-800 dark:text-sky-300">
              {loc.name}
            </h3>
            <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-2">
              <div className="relative flex">
                {wishlistLocationIds.has(loc.id) ? (
                  <div className="flex w-full">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-l-lg border-y border-l font-medium cursor-default transition bg-pink-100 border-pink-300 text-pink-700 dark:bg-pink-700 dark:border-pink-600 dark:text-white"
                    >
                      <Heart size={14} />
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
                      className="flex items-center justify-center px-1.5 border-y border-r rounded-r-lg font-medium cursor-pointer transition bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200 dark:bg-pink-700 dark:border-pink-600 dark:text-white dark:hover:bg-pink-600 relative"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {activeWishlistDropdownId === loc.id && (
                      <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLocationWishlist(loc.id);
                            setActiveWishlistDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                          Remove from Wishlist
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveWishlistDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
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
                    className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium cursor-pointer transition bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    <Heart size={14} />
                    Add to Wishlist
                  </button>
                )}
              </div>
              <div className="relative flex">
                {travelHistoryLocationIds.has(loc.id) ? (
                  <div className="flex w-full">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-l-lg border-y border-l font-medium cursor-default transition bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-700 dark:border-emerald-600 dark:text-white"
                    >
                      <History size={14} />
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
                      className="flex items-center justify-center px-1.5 border-y border-r rounded-r-lg font-medium cursor-pointer transition bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-700 dark:border-emerald-600 dark:text-white dark:hover:bg-emerald-600"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {activeDropdownId === loc.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLocationCollection(loc.id, "travelHistory");
                            setActiveDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                          Remove from Visited
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
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
                    className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium cursor-pointer transition bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    <History size={14} />
                    Mark Visited
                  </button>
                )}
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Tap to view images
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitiesView;

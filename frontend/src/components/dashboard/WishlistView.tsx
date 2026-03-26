import React from "react";
import type { Cities, Locations, ActiveSection } from "./types";

interface WishlistViewProps {
  wishlistCities: Cities[];
  wishlistLocations: Locations[];
  setActiveSection: (s: ActiveSection) => void;
  setSelectedCity: (id: number | null) => void;
  setSelectedLocation: (id: number | null) => void;
}

const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistCities,
  wishlistLocations,
  setActiveSection,
  setSelectedCity,
  setSelectedLocation,
}) => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-sky-900 dark:text-sky-400 mb-4">
        Wishlist
      </h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-sky-900 dark:text-sky-400 mb-4">
            City Wishlist
          </h3>
          {wishlistCities.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">
              No cities added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {wishlistCities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-gray-700/60"
                >
                  <div>
                    <p className="font-semibold text-sky-800 dark:text-sky-300">
                      {city.name?.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {city.description || "No description available"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveSection("cities");
                      setSelectedCity(city.id);
                      setSelectedLocation(null);
                    }}
                    className="px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-sky-900 dark:text-sky-400 mb-4">
            Location Wishlist
          </h3>
          {wishlistLocations.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">
              No locations added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {wishlistLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-gray-700/60"
                >
                  <div>
                    <p className="font-semibold text-sky-800 dark:text-sky-300">
                      {loc.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {loc.description}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveSection("cities");
                      setSelectedCity(loc.city_id);
                      setSelectedLocation(loc.id);
                    }}
                    className="px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm shrink-0"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {wishlistCities.length === 0 && wishlistLocations.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400 mt-5">
          Add cities from the Cities sidebar heart icon and locations from city
          cards.
        </p>
      )}
    </div>
  );
};

export default WishlistView;

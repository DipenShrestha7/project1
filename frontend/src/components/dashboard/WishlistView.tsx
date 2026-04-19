import React, { useState } from "react";
import { Heart, MapPin, Mountain, Trash2 } from "lucide-react";
import type { Cities, Locations, ActiveSection } from "./types";

interface WishlistViewProps {
  wishlistCities: Cities[];
  wishlistLocations: Locations[];
  locationImageById: Record<number, string>;
  onRemoveCity: (cityId: number) => Promise<void>;
  onRemoveLocation: (locationId: number) => Promise<void>;
  setActiveSection: (s: ActiveSection) => void;
  setSelectedCity: (id: number | null) => void;
  setSelectedLocation: (id: number | null) => void;
}

const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistCities,
  wishlistLocations,
  locationImageById,
  onRemoveCity,
  onRemoveLocation,
  setActiveSection,
  setSelectedCity,
  setSelectedLocation,
}) => {
  const [pendingRemove, setPendingRemove] = useState<{
    type: "city" | "location";
    id: number;
    name: string;
  } | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const totalWishlistItems = wishlistCities.length + wishlistLocations.length;

  const confirmRemove = async () => {
    if (!pendingRemove) return;
    setIsRemoving(true);
    try {
      if (pendingRemove.type === "city") {
        await onRemoveCity(pendingRemove.id);
      } else {
        await onRemoveLocation(pendingRemove.id);
      }
      setPendingRemove(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-rose-100/70 bg-linear-to-br from-white via-rose-50/60 to-amber-50/40 p-6 shadow-sm dark:border-rose-500/20 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/35">
        <div className="pointer-events-none absolute -right-16 -top-14 h-44 w-44 rounded-full bg-rose-200/40 blur-2xl dark:bg-rose-500/20" />
        <div className="relative">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-rose-200">
            Wishlist
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Keep your dream spots organized and jump into any city or location
            in one click.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-400/35 dark:bg-rose-500/10 dark:text-rose-200">
            <Heart size={14} className="fill-current" />
            {totalWishlistItems} saved destinations
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-sky-200">
              City Wishlist
            </h3>
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
              {wishlistCities.length}
            </span>
          </div>
          {wishlistCities.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No cities added yet.
            </p>
          ) : (
            <div className="space-y-3.5">
              {wishlistCities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-sky-300 hover:bg-sky-50/70 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-sky-500/35 dark:hover:bg-slate-800"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {city.name?.toUpperCase()}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">
                      {city.description || "No description available"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveSection("cities");
                      setSelectedCity(city.id);
                      setSelectedLocation(null);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                  >
                    <Mountain size={14} />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingRemove({
                        type: "city",
                        id: city.id,
                        name: city.name ?? `City #${city.id}`,
                      })
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-sky-200">
              Location Wishlist
            </h3>
            <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200">
              {wishlistLocations.length}
            </span>
          </div>
          {wishlistLocations.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No locations added yet.
            </p>
          ) : (
            <div className="space-y-3.5">
              {wishlistLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-cyan-300 hover:bg-cyan-50/60 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-cyan-500/35 dark:hover:bg-slate-800"
                >
                  <div className="min-w-0 flex items-start gap-3">
                    {locationImageById[loc.id] ? (
                      <img
                        src={locationImageById[loc.id]}
                        alt={loc.name}
                        className="h-14 w-20 rounded-lg object-cover border border-cyan-100 dark:border-cyan-500/20"
                      />
                    ) : null}
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {loc.name}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">
                        {loc.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveSection("cities");
                        setSelectedCity(loc.city_id);
                        setSelectedLocation(loc.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
                    >
                      <MapPin size={14} />
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingRemove({
                          type: "location",
                          id: loc.id,
                          name: loc.name,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {wishlistCities.length === 0 && wishlistLocations.length === 0 && (
        <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
          Add cities from the Cities sidebar heart icon and locations from city
          cards.
        </p>
      )}

      {pendingRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Remove from{" "}
              {pendingRemove.type === "city" ? "Wishlist" : "Location Wishlist"}
              ?
            </h3>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              {pendingRemove.name} will be removed from your
              {pendingRemove.type === "city"
                ? " wishlist"
                : " location wishlist"}
              . This action can be reversed by adding it again.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingRemove(null)}
                disabled={isRemoving}
                className="rounded-lg bg-slate-200 px-4 py-2 text-slate-900 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmRemove()}
                disabled={isRemoving}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistView;

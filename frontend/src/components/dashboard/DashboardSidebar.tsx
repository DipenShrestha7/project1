import React from "react";
import { Heart, History, MapPin, Search } from "lucide-react";
import type { User, Cities, ActiveSection } from "./types";

interface DashboardSidebarProps {
  User?: User;
  preview: string | null;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  activeSection: ActiveSection;
  setActiveSection: (s: ActiveSection) => void;
  searchCity: string;
  setSearchCity: (s: string) => void;
  filteredCities: Cities[];
  selectedCity: number | null;
  setSelectedCity: (id: number | null) => void;
  setSelectedLocation: (id: number | null) => void;
  wishlistCityIds: Set<number>;
  toggleCityWishlist: (id: number) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  User,
  preview,
  handleFile,
  activeSection,
  setActiveSection,
  searchCity,
  setSearchCity,
  filteredCities,
  selectedCity,
  setSelectedCity,
  setSelectedLocation,
  wishlistCityIds,
  toggleCityWishlist,
}) => {
  return (
    <div className="w-72 bg-white dark:bg-gray-800 shadow-xl rounded-r-3xl p-6 flex flex-col gap-8 transition-colors shrink-0 overflow-y-auto">
      <div className="flex items-center gap-4 bg-sky-600 text-white rounded-2xl p-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center text-sky-600 font-semibold">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={handleFile}
          />
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              onClick={() => document.getElementById("fileInput")?.click()}
            />
          ) : (
            <div
              onClick={() => document.getElementById("fileInput")?.click()}
              className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
            >
              <span className="text-xl text-gray-500 pb-1">+</span>
            </div>
          )}
        </div>
        <div className="leading-tight overflow-hidden">
          <h2 className="text-base font-semibold truncate">{User?.name}</h2>
          <p className="text-sm opacity-90 truncate">{User?.email}</p>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-2 mb-5">
          <button
            onClick={() => setActiveSection("wishlist")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${
              activeSection === "wishlist"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
            }`}
          >
            <Heart size={18} /> Wishlist
          </button>
          <button
            onClick={() => setActiveSection("travelHistory")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${
              activeSection === "travelHistory"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
            }`}
          >
            <History size={18} /> Travel History
          </button>
          <button
            onClick={() => {
              setActiveSection("cities");
              setSelectedLocation(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${
              activeSection === "cities"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
            }`}
          >
            <MapPin size={18} /> Cities
          </button>
        </div>

        {activeSection === "cities" && (
          <>
            <div className="relative my-4">
              <input
                className="border border-black p-2 pl-8 bg-white text-black dark:bg-slate-800 text-sm rounded-xl w-full dark:border-white dark:text-white"
                placeholder="Search cities"
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
            </div>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => {
                    setSelectedCity(city.id);
                    setSelectedLocation(null);
                  }}
                  className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl transition cursor-pointer ${
                    selectedCity === city.id
                      ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                      : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin size={18} className="shrink-0" />
                    <span className="truncate">{city.name?.toUpperCase()}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleCityWishlist(city.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/40 dark:hover:bg-black/20 transition shrink-0"
                    aria-label={
                      wishlistCityIds.has(city.id)
                        ? `Remove ${city.name} from city wishlist`
                        : `Add ${city.name} to city wishlist`
                    }
                  >
                    <Heart
                      size={16}
                      fill={
                        wishlistCityIds.has(city.id) ? "currentColor" : "none"
                      }
                      className={
                        wishlistCityIds.has(city.id)
                          ? "text-pink-600 dark:text-pink-300"
                          : "text-slate-500 dark:text-slate-300"
                      }
                    />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardSidebar;

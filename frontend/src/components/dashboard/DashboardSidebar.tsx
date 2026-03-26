import React from "react";
import { Heart, History, MapPin, Search, X, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User, Cities, ActiveSection } from "./types";
import pfp from "../../assets/pfp.jpg";

interface DashboardSidebarProps {
  onAuthRequired: () => void;
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
  onCloseMobile?: () => void;
  onLogOut?: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
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
  onAuthRequired,
  onCloseMobile,
  onLogOut,
  darkMode,
  toggleTheme,
}) => {
  const navigate = useNavigate();

  const handleRestrictedNavigation = (section: ActiveSection) => {
    if (!User?.id) {
      onAuthRequired();
      return;
    }
    setActiveSection(section);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 shadow-xl md:rounded-r-3xl p-6 flex flex-col gap-6 transition-colors shrink-0 overflow-hidden">
      {/* Mobile Title & Close Button */}
      <div className="flex items-center justify-between mb-2 md:hidden">
        <h1 className="font-bold text-2xl text-sky-600 dark:text-sky-400">
          Menu
        </h1>
        <button
          onClick={onCloseMobile}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
        >
          <X size={24} />
        </button>
      </div>

      {User ? (
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
                src={pfp}
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
      ) : (
        <div
          onClick={() => navigate("/login")}
          className="flex items-center gap-4 bg-sky-600 text-white rounded-2xl p-4 cursor-pointer hover:bg-sky-700 transition"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center text-sky-600 font-semibold">
            <span className="text-xl pb-1">?</span>
          </div>
          <div className="leading-tight overflow-hidden">
            <h2 className="text-base font-semibold truncate">Welcome, Guest</h2>
            <p className="text-sm opacity-90 truncate hover:underline">
              Click here to sign in
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex flex-col gap-2 mb-5">
          <button
            onClick={() => handleRestrictedNavigation("wishlist")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${
              activeSection === "wishlist"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
            }`}
          >
            <Heart size={18} /> Wishlist
          </button>
          <button
            onClick={() => handleRestrictedNavigation("travelHistory")}
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
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="relative mt-0 mb-3">
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
            <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto dashboard-scrollbar pr-1">
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
          </div>
        )}
      </div>

      {/* Auth Buttons Anchored to Bottom */}
      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-3 text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-gray-700/50 rounded-xl hover:bg-sky-200 dark:hover:bg-gray-600 transition shrink-0"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {User ? (
          <button
            onClick={onLogOut}
            className="flex-1 py-3 bg-red-600/10 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-semibold rounded-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-800 transition shadow-sm"
          >
            Log Out
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex-1 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition shadow-md"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardSidebar;

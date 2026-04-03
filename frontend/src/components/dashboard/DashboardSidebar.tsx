import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  History,
  MapPin,
  Search,
  X,
  Sun,
  Moon,
  MessageCircle,
  PanelLeftClose,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User, Cities, ActiveSection } from "./types";
import pfp from "../../assets/pfp.jpg";
import logo from "../../assets/ghumphirlogo.png";

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
  onDesktopToggle?: () => void;
  isExpanded?: boolean;
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
  onDesktopToggle,
  isExpanded = true,
}) => {
  const navigate = useNavigate();
  const navIconSize = 18;
  const sidebarToggleIconSize = 20;
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleRestrictedNavigation = (section: ActiveSection) => {
    if (!User?.id) {
      onAuthRequired();
      return;
    }
    closeProfileMenu();
    setActiveSection(section);
  };

  const closeProfileMenu = () => {
    setProfileMenuOpen(false);
  };

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        closeProfileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 shadow-xl py-4 px-1.5 flex flex-col gap-6 transition-colors shrink-0 overflow-hidden">
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

      <div
        className={`hidden md:flex items-center -mb-3 w-full transition-all duration-300 ${isExpanded ? "justify-between gap-3" : "justify-center"}`}
      >
        {isExpanded && (
          <button
            type="button"
            onClick={() => window.location.assign("/ghumphir/dashboard")}
            className="h-10 flex items-center gap-2 pl-2.5 pr-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <img
              src={logo}
              alt="Ghumphir logo"
              className="h-8 w-8 rounded object-contain shrink-0"
            />
            <span
              className={`ml-0 text-[16px] font-semibold text-slate-700 dark:text-slate-200 truncate
              overflow-hidden transition-all duration-300 whitespace-nowrap
              ${isExpanded ? "max-w-25 opacity-100" : "max-w-0 opacity-0"}`}
            >
              Ghumphir
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={onDesktopToggle}
          className={`items-center rounded-xl text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex shrink-0 ${isExpanded ? "h-10 w-10 justify-center" : "h-10 w-10 justify-center"}`}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <PanelLeftClose size={sidebarToggleIconSize} />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col w-full min-w-0">
        <div className="flex flex-col gap-1.5 mb-4">
          <button
            onClick={() => handleRestrictedNavigation("chatbot")}
            className={`flex items-center ${isExpanded ? "gap-2 px-3.5 py-2 justify-start" : "justify-center w-10 h-10 mx-auto"} rounded-xl transition ${
              activeSection === "chatbot"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
            }`}
            aria-label="Chatbot"
            title="Chatbot"
          >
            <MessageCircle size={navIconSize} />
            <span
              className={`overflow-hidden transition-all duration-300 whitespace-nowrap
              ${isExpanded ? "max-w-25 opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"}`}
            >
              Chatbot
            </span>
          </button>
          <button
            onClick={() => handleRestrictedNavigation("wishlist")}
            className={`flex items-center ${isExpanded ? "gap-2 px-3.5 py-2 justify-start" : "justify-center w-10 h-10 mx-auto"} rounded-xl transition ${
              activeSection === "wishlist"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
            }`}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={navIconSize} />
            <span
              className={`overflow-hidden transition-all duration-300 whitespace-nowrap
              ${isExpanded ? "max-w-25 opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"}`}
            >
              Wishlist
            </span>
          </button>
          <button
            onClick={() => handleRestrictedNavigation("travelHistory")}
            className={`flex items-center ${isExpanded ? "gap-2 px-3.5 py-2 justify-start" : "justify-center w-10 h-10 mx-auto"} rounded-xl transition ${
              activeSection === "travelHistory"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
            }`}
            aria-label="Travel History"
            title="Travel History"
          >
            <History size={navIconSize} />
            <span
              className={`overflow-hidden transition-all duration-300 whitespace-nowrap
              ${isExpanded ? "max-w-40 opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"}`}
            >
              Travel History
            </span>
          </button>
          <button
            onClick={() => {
              closeProfileMenu();
              setActiveSection("cities");
              setSelectedLocation(null);
            }}
            className={`flex items-center ${isExpanded ? "gap-2 px-3.5 py-2 justify-start" : "justify-center w-10 h-10 mx-auto"} rounded-xl transition ${
              activeSection === "cities"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
            }`}
            aria-label="Cities"
            title="Cities"
          >
            <MapPin size={navIconSize} />
            <span
              className={`overflow-hidden transition-all duration-300 whitespace-nowrap
              ${isExpanded ? "max-w-25 opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"}`}
            >
              Cities
            </span>
          </button>
        </div>

        {isExpanded && activeSection === "cities" && (
          <div className="flex-1 min-h-0 flex flex-col px-0.5">
            <div className="relative mt-0 mb-2">
              <input
                className="border border-black py-2 pl-8 pr-2 bg-white text-black dark:bg-slate-800 text-[15px] rounded-xl w-full dark:border-white dark:text-white"
                placeholder="Search cities"
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                size={15}
              />
            </div>
            <div className="flex-1 min-h-0 flex flex-col gap-1.5 overflow-y-auto dashboard-scrollbar pr-0">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => {
                    setSelectedCity(city.id);
                    setSelectedLocation(null);
                  }}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 px-1.5 py-2 rounded-xl text-[15px] transition cursor-pointer ${
                    selectedCity === city.id
                      ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                      : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin size={navIconSize} className="shrink-0" />
                    <span className="truncate leading-tight text-[14px]">
                      {city.name?.toUpperCase()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleCityWishlist(city.id);
                    }}
                    className="p-0.5 rounded-full hover:bg-white/40 dark:hover:bg-black/20 transition shrink-0 justify-self-end"
                    aria-label={
                      wishlistCityIds.has(city.id)
                        ? `Remove ${city.name} from city wishlist`
                        : `Add ${city.name} to city wishlist`
                    }
                  >
                    <Heart
                      size={navIconSize}
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

      {User && (
        <div className="-mt-4 -mb-2.5 pt-1.5 border-t border-slate-200 dark:border-slate-700">
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => {
                if (isExpanded) {
                  setProfileMenuOpen(!profileMenuOpen);
                } else {
                  onDesktopToggle?.();
                }
              }}
              className={`flex items-center text-black dark:text-white rounded-lg transition group cursor-pointer ${isExpanded ? "w-full gap-2 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-gray-700" : "w-12 h-12 mx-auto justify-center p-1.5  hover:bg-gray-700 shadow-md"}`}
            >
              <div
                className={`rounded-full overflow-hidden bg-white flex items-center justify-center text-sky-600 font-semibold shrink-0 ${isExpanded ? "w-10 h-10" : "w-9 h-9"}`}
              >
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
                    className={`rounded-full object-cover ${isExpanded ? "w-10 h-10" : "w-9 h-9"}`}
                  />
                ) : User?.profile_image ? (
                  <img
                    src={`http://localhost:9000${User.profile_image}`}
                    alt="profile"
                    className={`rounded-full object-cover ${isExpanded ? "w-10 h-10" : "w-9 h-9"}`}
                  />
                ) : (
                  <img
                    src={pfp}
                    alt="default"
                    className={`rounded-full object-cover ${isExpanded ? "w-10 h-10" : "w-9 h-9"}`}
                  />
                )}
              </div>
              {isExpanded && (
                <div className="leading-tight overflow-hidden min-w-0 text-left">
                  <h2 className="text-sm font-semibold truncate">
                    {User?.name}
                  </h2>
                  <p className="text-xs opacity-90 truncate">{User?.email}</p>
                </div>
              )}
              {isExpanded && (
                <Settings
                  size={18}
                  className="transition shrink-0 ml-auto opacity-90 text-black dark:text-white"
                />
              )}
            </button>

            {profileMenuOpen && isExpanded && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    document.getElementById("fileInput")?.click();
                    closeProfileMenu();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-gray-600 transition"
                >
                  Change Profile Picture
                </button>

                <div className="border-t border-slate-200 dark:border-gray-600 my-1"></div>

                <button
                  onClick={() => {
                    toggleTheme();
                    closeProfileMenu();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                >
                  {darkMode ? (
                    <>
                      <Sun size={16} />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon size={16} />
                      Dark Mode
                    </>
                  )}
                </button>

                <div className="border-t border-slate-200 dark:border-gray-600 my-1"></div>

                <button
                  onClick={() => {
                    onLogOut?.();
                    closeProfileMenu();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Buttons Anchored to Bottom - Only show for guests */}
      {!User && (
        <div className="-mt-3 pt-2.5 -mb-1 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-3 text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-gray-700/50 rounded-xl hover:bg-sky-200 dark:hover:bg-gray-600 transition shrink-0"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          {isExpanded && (
            <button
              onClick={() => navigate("/ghumphir/login")}
              className="flex-1 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition shadow-md"
            >
              Log In
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;

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
  onOpenAccountOverlay?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  User,
  preview,
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
  onOpenAccountOverlay,
}) => {
  const navigate = useNavigate();
  const navIconSize = 18;
  const sidebarToggleIconSize = 20;
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const getProfileImageSrc = (profileImage: string) => {
    if (/^https?:\/\//i.test(profileImage)) {
      return profileImage;
    }
    return `http://localhost:9000${profileImage}`;
  };

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
    <div className="w-full h-full bg-linear-to-b from-slate-100 via-slate-50 to-white dark:from-[#0a1b38] dark:via-[#08162d] dark:to-[#071224] shadow-xl py-4 px-2 flex flex-col gap-5 transition-colors shrink-0 overflow-hidden text-slate-700 dark:text-slate-100">
      {/* Mobile Title & Close Button */}
      <div className="flex items-center justify-between mb-2 md:hidden px-1">
        <h1 className="font-bold text-2xl text-sky-700 dark:text-sky-300">
          Menu
        </h1>
        <button
          onClick={onCloseMobile}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white rounded-full transition"
        >
          <X size={24} />
        </button>
      </div>

      <div
        className={`hidden md:flex items-center -mb-2 w-full transition-all duration-300 ${isExpanded ? "justify-between gap-3" : "justify-center"}`}
      >
        {isExpanded && (
          <button
            type="button"
            onClick={() => window.location.assign("/ghumphir/dashboard")}
            className="h-10 flex items-center gap-2 pl-2.5 pr-2.5 py-2 rounded-xl bg-transparent hover:bg-white/5 dark:hover:bg-white/5 transition"
          >
            <img
              src={logo}
              alt="Ghumphir logo"
              className="h-8 w-8 rounded object-contain shrink-0"
            />
            <span
              className={`ml-0 text-[16px] font-semibold text-slate-800 dark:text-slate-100 truncate
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
          className={`items-center rounded-xl text-slate-600 hover:bg-white/5 dark:text-slate-200 dark:hover:bg-white/5 transition flex shrink-0 ${isExpanded ? "h-10 w-10 justify-center" : "h-10 w-10 justify-center"}`}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <PanelLeftClose size={sidebarToggleIconSize} />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col w-full min-w-0">
        <div className="flex flex-col gap-1.5 mb-4 px-0.5">
          <button
            onClick={() => handleRestrictedNavigation("chatbot")}
            className={`flex items-center ${isExpanded ? "gap-2 px-3.5 py-2 justify-start" : "justify-center w-10 h-10 mx-auto"} rounded-xl transition ${
              activeSection === "chatbot"
                ? "bg-sky-600 text-white"
                : "bg-transparent hover:bg-slate-200/70 text-slate-700 dark:hover:bg-white/10 dark:text-slate-100"
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
                ? "bg-sky-600 text-white"
                : "bg-transparent hover:bg-slate-200/70 text-slate-700 dark:hover:bg-white/10 dark:text-slate-100"
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
                ? "bg-sky-600 text-white"
                : "bg-transparent hover:bg-slate-200/70 text-slate-700 dark:hover:bg-white/10 dark:text-slate-100"
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
                ? "bg-sky-600 text-white"
                : "bg-transparent hover:bg-slate-200/70 text-slate-700 dark:hover:bg-white/10 dark:text-slate-100"
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
                className="border border-slate-300 py-2.5 pl-8 pr-3 bg-white text-slate-700 dark:border-white/25 dark:bg-white/6 dark:text-slate-100 text-[14px] rounded-xl w-full placeholder:text-slate-400 focus:outline-none focus:border-sky-300/60"
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
            <div className="flex-1 min-h-0 flex flex-col gap-1.5 overflow-y-auto dashboard-scrollbar pr-0.5">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => {
                    setSelectedCity(city.id);
                    setSelectedLocation(null);
                  }}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 px-2 py-2 rounded-xl text-[14px] transition cursor-pointer ${
                    selectedCity === city.id
                      ? "bg-sky-600 text-white"
                      : "bg-transparent hover:bg-slate-200/70 text-slate-700 dark:hover:bg-white/10 dark:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin size={navIconSize} className="shrink-0" />
                    <span className="truncate leading-tight text-[13px] font-medium tracking-[0.03em]">
                      {city.name?.toUpperCase()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleCityWishlist(city.id);
                    }}
                    className="p-1 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-600/60 transition shrink-0 justify-self-end"
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
        <div className="-mt-3 -mb-1 pt-2 border-t border-slate-300 dark:border-white/12">
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => {
                if (isExpanded) {
                  setProfileMenuOpen(!profileMenuOpen);
                } else {
                  onDesktopToggle?.();
                }
              }}
              className={`flex items-center text-slate-800 dark:text-white rounded-xl transition group cursor-pointer ${isExpanded ? "w-full gap-2 px-3 py-2.5 bg-slate-200/70 hover:bg-slate-200 dark:bg-white/8 dark:hover:bg-white/12" : "w-12 h-12 mx-auto justify-center p-1.5 bg-slate-200/70 hover:bg-slate-200 dark:bg-white/8 dark:hover:bg-white/12 shadow-md"}`}
            >
              <div
                className={`rounded-full overflow-hidden bg-white flex items-center justify-center text-sky-600 font-semibold shrink-0 ${isExpanded ? "w-10 h-10" : "w-9 h-9"}`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className={`rounded-full object-cover ${isExpanded ? "w-10 h-10" : "w-9 h-9"}`}
                  />
                ) : User?.profile_image ? (
                  <img
                    src={getProfileImageSrc(User.profile_image)}
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
                  className="transition shrink-0 ml-auto opacity-90 text-slate-700 dark:text-white"
                />
              )}
            </button>

            {profileMenuOpen && isExpanded && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    onOpenAccountOverlay?.();
                    closeProfileMenu();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <Settings size={16} />
                  My Account
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
        <div className="-mt-2 pt-2.5 -mb-1 border-t border-slate-300 dark:border-white/12 flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-3 text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-gray-700/50 rounded-xl hover:bg-sky-200 dark:hover:bg-gray-600 transition shrink-0"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          {isExpanded && (
            <button
              onClick={() =>
                navigate("/ghumphir?auth=login&next=/ghumphir/dashboard")
              }
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

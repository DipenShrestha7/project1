import { LogIn, PanelLeftClose, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import CitiesView from "../components/dashboard/CitiesView";
import ChatbotView from "../components/dashboard/ChatbotView.tsx";
import WishlistView from "../components/dashboard/WishlistView";
import TravelHistoryView from "../components/dashboard/TravelHistoryView";
import LocationDetailsView from "../components/dashboard/LocationDetailsView";
import AccountOverlay from "../components/dashboard/AccountOverlay";
import { useDashboardController } from "./dashboard/useDashboardController";

type DashboardProps = {
  darkMode: boolean;
  onToggleTheme: () => void;
};

const Dashboard = ({ darkMode, onToggleTheme }: DashboardProps) => {
  const navigate = useNavigate();
  const {
    user,
    preview,
    activeSection,
    setActiveSection,
    selectedCity,
    setSelectedCity,
    selectedLocation,
    setSelectedLocation,
    locationReviews,
    showAuthModal,
    setShowAuthModal,
    showLogoutModal,
    setShowLogoutModal,
    isAccountOverlayOpen,
    setIsAccountOverlayOpen,
    isSidebarOpen,
    isSidebarClosing,
    openSidebar,
    closeSidebar,
    closeSidebarOnMobile,
    wishlistCityIds,
    wishlistLocationIds,
    travelHistoryLocationIds,
    wishlistItems,
    travelHistoryItems,
    accountStats,
    expandedReviewLocationIds,
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
    locationImageById,
    deletingHistoryLocationId,
    removeLocationFromTravelHistory,
    searchCity,
    setSearchCity,
    filteredCities,
    filteredLocations,
    wishlistCities,
    wishlistLocations,
    filteredImages,
    currentCity,
    currentLocation,
    parsedLatitude,
    parsedLongitude,
    hasValidCoordinates,
    googleMapsUrl,
    mapEmbedUrl,
    toggleLocationCollection,
    toggleReviewSection,
    toggleCityWishlist,
    toggleLocationWishlist,
    removeCityFromWishlist,
    removeLocationFromWishlist,
    handleSaveProfile,
    handleDeleteAccount,
    handleSubmitReport,
    uploadProfileImage,
    handleLogoutClick,
  } = useDashboardController();

  const dashboardSidebarProps = {
    onAuthRequired: () => setShowAuthModal(true),
    User: user,
    preview,
    activeSection,
    setActiveSection: (sec: typeof activeSection) => {
      setActiveSection(sec);
      if (sec !== "cities") {
        closeSidebarOnMobile();
      }
    },
    searchCity,
    setSearchCity,
    filteredCities,
    selectedCity,
    setSelectedCity: (id: number | null) => {
      setSelectedCity(id);
    },
    setSelectedLocation,
    wishlistCityIds,
    toggleCityWishlist,
    onCloseMobile: closeSidebar,
    onLogOut: handleLogoutClick,
    darkMode,
    toggleTheme: onToggleTheme,
    onDesktopToggle: () => {
      if (isSidebarOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    },
    isExpanded: isSidebarOpen,
    onOpenAccountOverlay: () => setIsAccountOverlayOpen(true),
  };

  const citiesViewProps = {
    currentCity,
    filteredLocations,
    setSelectedLocation,
    wishlistCityIds,
    toggleCityWishlist,
    wishlistLocationIds,
    toggleLocationWishlist,
    travelHistoryLocationIds,
    toggleLocationCollection,
  };

  const wishlistViewProps = {
    wishlistCities,
    wishlistLocations,
    locationImageById,
    onRemoveCity: removeCityFromWishlist,
    onRemoveLocation: removeLocationFromWishlist,
    setActiveSection,
    setSelectedCity,
    setSelectedLocation,
  };

  const travelHistoryViewProps = {
    travelHistoryItems,
    Locations:
      filteredLocations.length >= 0
        ? travelHistoryItems.length >= 0
          ? []
          : []
        : [],
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
    locationImageById,
    deletingHistoryLocationId,
    removeLocationFromTravelHistory,
    setActiveSection,
    setSelectedCity,
    setSelectedLocation,
  };

  const locationDetailsViewProps = {
    currentLocation,
    cityLocations: filteredLocations,
    parsedLatitude,
    parsedLongitude,
    hasValidCoordinates,
    googleMapsUrl,
    mapEmbedUrl,
    wishlistLocationIds,
    toggleLocationWishlist,
    travelHistoryLocationIds,
    toggleLocationCollection,
    filteredImages,
    setSelectedLocation,
    locationReviews,
  };

  const accountOverlayProps = {
    isOpen: isAccountOverlayOpen,
    onClose: () => setIsAccountOverlayOpen(false),
    user,
    darkMode,
    onToggleTheme,
    onSaveProfile: handleSaveProfile,
    onDeleteAccount: handleDeleteAccount,
    onLogout: handleLogoutClick,
    onUploadProfileImage: uploadProfileImage,
    onSubmitReport: handleSubmitReport,
    accountStats,
    wishlistItems,
    travelHistoryItems,
    preview,
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-slate-200 transition-colors overflow-hidden">
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm z-30 shrink-0">
        <h1 className="font-bold text-xl text-sky-600 dark:text-sky-400">
          Dashboard
        </h1>
        <button
          onClick={() => {
            if (isSidebarOpen) {
              closeSidebar();
            } else {
              openSidebar();
            }
          }}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <PanelLeftClose size={24} />
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 md:relative md:inset-y-auto md:left-auto transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isSidebarClosing ? "md:-translate-x-2" : "md:translate-x-0"} z-50 md:z-auto transition-all duration-300 ease-in-out h-full md:h-screen ${isSidebarOpen ? "w-60" : "w-16 md:w-16"} shrink-0 overflow-hidden md:border-r md:border-sky-900/40 md:shadow-[10px_0_26px_rgba(2,8,23,0.45)]`}
      >
        <DashboardSidebar {...dashboardSidebarProps} />
      </div>

      <div className="flex-1 p-2 sm:p-3 md:p-4 overflow-y-auto w-full md:w-auto h-[calc(100vh-72px)] md:h-screen relative md:border-l md:border-slate-200/10">
        {activeSection === "cities" && !selectedCity && (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-400 text-xl">
            Select a city to explore locations
          </div>
        )}

        {activeSection === "cities" && selectedCity && !selectedLocation && (
          <CitiesView {...citiesViewProps} />
        )}

        {activeSection === "wishlist" && (
          <WishlistView {...wishlistViewProps} />
        )}

        {activeSection === "chatbot" && (
          <div className="h-full min-h-0">
            <ChatbotView userId={user?.id} />
          </div>
        )}

        {activeSection === "travelHistory" && (
          <TravelHistoryView
            {...travelHistoryViewProps}
            Locations={filteredLocations}
          />
        )}

        {activeSection === "cities" && selectedLocation && (
          <LocationDetailsView {...locationDetailsViewProps} />
        )}
      </div>

      <AccountOverlay {...accountOverlayProps} />

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/50 text-sky-600 rounded-full flex items-center justify-center mb-6">
              <LogIn size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
              Login Required
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-center mb-8">
              Sign in or create an account to use this feature and save your
              favorite locations.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() =>
                  navigate("/ghumphir?auth=login&next=/ghumphir/dashboard")
                }
                className="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl hover:bg-sky-700 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 text-red-600 rounded-full flex items-center justify-center mb-6">
              <LogOut size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
              Confirm Logout
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-center mb-8">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/ghumphir");
                }}
                className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import { useEffect, useMemo, useState } from "react";
import { useAdminData } from "./useAdminData";
import { useProfile } from "./useProfile";
import { useWishlist } from "./useWishlist";
import { useTravelHistory } from "./useTravelHistory";
import { useSidebar } from "./useSidebar";
import type { ActiveSection } from "../../components/dashboard/types";

type DashboardHashState = {
  activeSection: ActiveSection;
  selectedCity: number | null;
  selectedLocation: number | null;
  selectedChatId: string | null;
};

export const useDashboardController = () => {
  const admin = useAdminData();
  const profile = useProfile();
  const sidebar = useSidebar();
  const wishlist = useWishlist(profile.user?.id);
  const travel = useTravelHistory(profile.user?.id);

  const parseHash = (): DashboardHashState => {
    const rawHash = window.location.hash.replace(/^#/, "").trim();
    const normalizedHash = rawHash.toLowerCase();

    if (!normalizedHash) {
      return {
        activeSection: "cities" as ActiveSection,
        selectedCity: null as number | null,
        selectedLocation: null as number | null,
        selectedChatId: null,
      };
    }

    if (
      normalizedHash === "chatbot" ||
      normalizedHash.startsWith("chatbot/") ||
      normalizedHash === "wishlist" ||
      normalizedHash === "travelhistory" ||
      normalizedHash === "travel-history"
    ) {
      const selectedChatId = rawHash.split("/")[1] ?? null;
      return {
        activeSection:
          normalizedHash === "travelhistory" ||
          normalizedHash === "travel-history"
            ? ("travelHistory" as ActiveSection)
            : normalizedHash.startsWith("chatbot/")
              ? ("chatbot" as ActiveSection)
              : (normalizedHash as ActiveSection),
        selectedCity: null as number | null,
        selectedLocation: null as number | null,
        selectedChatId,
      };
    }

    const [section, cityIdValue, locationIdValue] = rawHash.split("/");
    if (section?.toLowerCase() !== "cities") {
      return {
        activeSection: "cities" as ActiveSection,
        selectedCity: null as number | null,
        selectedLocation: null as number | null,
        selectedChatId: null,
      };
    }

    const selectedCity = Number(cityIdValue);
    const selectedLocation = Number(locationIdValue);

    return {
      activeSection: "cities" as ActiveSection,
      selectedCity: Number.isFinite(selectedCity) ? selectedCity : null,
      selectedLocation: Number.isFinite(selectedLocation)
        ? selectedLocation
        : null,
      selectedChatId: null,
    };
  };

  const setHash = (
    section: ActiveSection,
    cityId: number | null = null,
    locationId: number | null = null,
  ) => {
    const nextHash =
      section === "cities"
        ? cityId === null
          ? "#cities"
          : locationId === null
            ? `#cities/${cityId}`
            : `#cities/${cityId}/${locationId}`
        : `#${section}`;

    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  };

  const initialHashState = parseHash();
  const [activeSection, setActiveSectionState] = useState<ActiveSection>(
    initialHashState.activeSection,
  );
  const [selectedCity, setSelectedCityState] = useState<number | null>(
    initialHashState.selectedCity,
  );
  const [selectedLocation, setSelectedLocationState] = useState<number | null>(
    initialHashState.selectedLocation,
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    initialHashState.selectedChatId,
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAccountOverlayOpen, setIsAccountOverlayOpen] = useState(false);
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      const nextState = parseHash();
      setActiveSectionState(nextState.activeSection);
      setSelectedCityState(nextState.selectedCity);
      setSelectedLocationState(nextState.selectedLocation);
      setSelectedChatId(nextState.selectedChatId);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const syncHash = (
    section: ActiveSection,
    cityId: number | null = selectedCity,
    locationId: number | null = selectedLocation,
  ) => {
    setHash(section, cityId, locationId);
  };

  const setActiveSection = (section: ActiveSection) => {
    setActiveSectionState(section);
    syncHash(section);
  };

  const setSelectedCity = (cityId: number | null) => {
    setActiveSectionState("cities");
    setSelectedCityState(cityId);
    setSelectedLocationState(null);
    syncHash("cities", cityId, null);
  };

  const setSelectedLocation = (locationId: number | null) => {
    if (locationId === null) {
      setSelectedLocationState(null);
      syncHash("cities", selectedCity, null);
      return;
    }

    const location = admin.locations.find((item) => item.id === locationId);
    const cityId = location?.city_id ?? selectedCity;
    setActiveSectionState("cities");
    setSelectedLocationState(locationId);
    if (typeof cityId === "number") {
      setSelectedCityState(cityId);
      syncHash("cities", cityId, locationId);
      return;
    }

    syncHash("cities", selectedCity, locationId);
  };

  const locationImageById = useMemo(() => {
    return admin.images.reduce<Record<number, string>>((acc, img) => {
      if (!acc[img.location_id]) acc[img.location_id] = img.image_url;
      return acc;
    }, {});
  }, [admin.images]);

  const filteredCities = useMemo(() => {
    if (!searchCity) return admin.cities;
    const s = searchCity.toLowerCase();
    return admin.cities.filter((c) => c.name?.toLowerCase().includes(s));
  }, [admin.cities, searchCity]);

  const filteredLocations = useMemo(() => {
    if (!selectedCity) return admin.locations;
    return admin.locations.filter((l) => l.city_id === selectedCity);
  }, [admin.locations, selectedCity]);

  const wishlistCities = useMemo(() => {
    return admin.cities.filter((c) => wishlist.wishlistCityIds.has(c.id));
  }, [admin.cities, wishlist.wishlistCityIds]);

  const wishlistLocations = useMemo(() => {
    return admin.locations.filter((l) =>
      wishlist.wishlistLocationIds.has(l.id),
    );
  }, [admin.locations, wishlist.wishlistLocationIds]);

  const currentCity = admin.cities.find((c) => c.id === selectedCity);
  const currentLocation = admin.locations.find(
    (l) => l.id === selectedLocation,
  );

  const parsedLatitude = currentLocation
    ? Number(currentLocation.latitude)
    : Number.NaN;
  const parsedLongitude = currentLocation
    ? Number(currentLocation.longitude)
    : Number.NaN;
  const hasValidCoordinates =
    Number.isFinite(parsedLatitude) &&
    Number.isFinite(parsedLongitude) &&
    parsedLatitude >= -90 &&
    parsedLatitude <= 90 &&
    parsedLongitude >= -180 &&
    parsedLongitude <= 180;
  const googleMapsUrl = hasValidCoordinates
    ? `https://www.google.com/maps?q=${parsedLatitude},${parsedLongitude}`
    : "";
  const mapEmbedUrl = hasValidCoordinates
    ? `https://maps.google.com/maps?q=${parsedLatitude},${parsedLongitude}&z=12&output=embed`
    : "";

  const toggleCityWishlist = (cityId: number) => {
    const uid = profile.user?.id;
    if (!uid) {
      setShowAuthModal(true);
      return;
    }
    void wishlist.toggleCityWishlist(cityId, uid);
  };

  const toggleLocationWishlist = (locationId: number) => {
    const uid = profile.user?.id;
    if (!uid) {
      setShowAuthModal(true);
      return;
    }
    void wishlist.toggleLocationWishlist(locationId, uid);
  };

  const toggleLocationCollection = (
    locationId: number,
    collection: "wishlist" | "travelHistory",
  ) => {
    const uid = profile.user?.id;
    if (!uid) {
      setShowAuthModal(true);
      return;
    }

    if (collection === "wishlist") {
      void wishlist.toggleLocationWishlist(locationId, uid);
      return;
    }

    void travel.removeLocationFromTravelHistory(uid, locationId);
  };

  const saveReviewForLocation = async (locationId: number) => {
    const uid = profile.user?.id;
    await travel.saveReviewForLocation(uid, locationId);
  };

  const deleteReviewForLocation = async (locationId: number) => {
    const uid = profile.user?.id;
    await travel.deleteReviewForLocation(uid, locationId);
  };

  const initiateDeleteReview = (locationId: number) =>
    travel.initiateDeleteReview(locationId);

  const removeLocationFromTravelHistory = async (locationId: number) => {
    const uid = profile.user?.id;
    await travel.removeLocationFromTravelHistory(uid, locationId);
  };

  const loadTravelHistory = async () => {
    const uid = profile.user?.id;
    if (uid) await travel.loadTravelHistory(uid);
  };

  const handleLogoutClick = () => setShowLogoutModal(true);

  return {
    user: profile.user,
    setUser: profile.setUser,
    cities: admin.cities,
    locations: admin.locations,
    images: admin.images,
    preview: profile.preview,
    activeSection,
    setActiveSection,
    selectedCity,
    setSelectedCity,
    selectedLocation,
    setSelectedLocation,
    selectedChatId,
    setSelectedChatId,
    locationReviews: travel.locationReviews,
    showAuthModal,
    setShowAuthModal,
    showLogoutModal,
    setShowLogoutModal,
    isAccountOverlayOpen,
    setIsAccountOverlayOpen,
    isSidebarOpen: sidebar.isSidebarOpen,
    isSidebarClosing: sidebar.isSidebarClosing,
    openSidebar: sidebar.openSidebar,
    closeSidebar: sidebar.closeSidebar,
    closeSidebarOnMobile: sidebar.closeSidebarOnMobile,
    wishlistCityIds: wishlist.wishlistCityIds,
    wishlistLocationIds: wishlist.wishlistLocationIds,
    travelHistoryLocationIds: travel.travelHistoryLocationIds,
    wishlistItems: wishlist.wishlistItems,
    travelHistoryItems: travel.travelHistoryItems,
    accountStats: profile.accountStats,
    expandedReviewLocationIds: travel.expandedReviewLocationIds,
    reviewTextDrafts: travel.reviewTextDrafts,
    setReviewTextDrafts: travel.setReviewTextDrafts,
    ratingDrafts: travel.ratingDrafts,
    setRatingDrafts: travel.setRatingDrafts,
    savingReviewLocationId: travel.savingReviewLocationId,
    saveReviewForLocation,
    deleteReviewForLocation,
    initiateDeleteReview,
    deletingReviewLocationId: travel.deletingReviewLocationId,
    confirmDeleteReviewLocationId: travel.confirmDeleteReviewLocationId,
    setConfirmDeleteReviewLocationId: travel.setConfirmDeleteReviewLocationId,
    locationImageById,
    deletingHistoryLocationId: travel.deletingHistoryLocationId,
    removeLocationFromTravelHistory,
    searchCity,
    setSearchCity,
    filteredCities,
    filteredLocations,
    wishlistCities,
    wishlistLocations,
    filteredImages: admin.images.filter(
      (img) => img.location_id === selectedLocation,
    ),
    currentCity,
    currentLocation,
    parsedLatitude,
    parsedLongitude,
    hasValidCoordinates,
    googleMapsUrl,
    mapEmbedUrl,
    toggleLocationCollection,
    toggleReviewSection: travel.toggleReviewSection,
    toggleCityWishlist,
    toggleLocationWishlist,
    removeCityFromWishlist: (cityId: number) =>
      wishlist.removeCityFromWishlist(cityId, profile.user?.id),
    removeLocationFromWishlist: (locationId: number) =>
      wishlist.removeLocationFromWishlist(locationId, profile.user?.id),
    handleSaveProfile: profile.handleSaveProfile,
    handleDeleteAccount: profile.handleDeleteAccount,
    handleSubmitReport: profile.handleSubmitReport,
    uploadProfileImage: profile.uploadProfileImage,
    loadTravelHistory,
    handleLogoutClick,
  };
};

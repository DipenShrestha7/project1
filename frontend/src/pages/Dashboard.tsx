import { useState, useEffect, useRef } from "react";
import { LogIn, PanelLeftClose, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type {
  User,
  WishlistItem,
  City,
  Cities,
  Location,
  Locations,
  Image,
  Images,
  HistoryItem,
  ActiveSection,
  Review,
} from "../components/dashboard/types";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import CitiesView from "../components/dashboard/CitiesView";
import ChatbotView from "../components/dashboard/ChatbotView";
import WishlistView from "../components/dashboard/WishlistView";
import TravelHistoryView from "../components/dashboard/TravelHistoryView";
import LocationDetailsView from "../components/dashboard/LocationDetailsView";

const Dashboard = () => {
  const [User, setUser] = useState<User>();
  const [Cities, setCities] = useState<Cities[]>([]);
  const [Locations, setLocations] = useState<Locations[]>([]);
  const [Images, setImages] = useState<Images[]>([]);
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>("cities");

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/admin/cities");
        const data: City[] = await response.json();
        const formatted: Cities[] = data.map((item) => ({
          id: item.city_id,
          name: item.city_name,
          description: item.description,
        }));
        setCities(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCityData();
  }, []);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch(
          "http://localhost:9000/api/admin/locations",
        );
        const data: Location[] = await response.json();
        const formatted: Locations[] = data.map((item) => ({
          id: item.location_id,
          name: item.location_name,
          description: item.description,
          city_id: item.city_id,
          latitude: item.latitude,
          longitude: item.longitude,
        }));
        setLocations(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocationData();
  }, []);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/admin/images");
        const data: Image[] = await response.json();
        const formatted: Images[] = data.map((item) => {
          return {
            id: item.image_id,
            location_id: item.location_id,
            image_url: item.image_url,
            image_description: item.image_description,
          };
        });
        setImages(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchImageData();
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const response = await fetch("http://localhost:9000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setUser(data);
        setPreview(`http://localhost:9000${data.profile_image}`);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, [navigate]);

  const [, setImage] = useState<File | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:9000/api/dashboard/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      await response.json();
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [locationReviews, setLocationReviews] = useState<Review[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return window.innerWidth >= 768;
  });
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);
  const sidebarCloseTimeoutRef = useRef<number | null>(null);

  const openSidebar = () => {
    if (sidebarCloseTimeoutRef.current) {
      window.clearTimeout(sidebarCloseTimeoutRef.current);
      sidebarCloseTimeoutRef.current = null;
    }
    setIsSidebarClosing(false);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsSidebarClosing(true);
      setIsSidebarOpen(false);

      if (sidebarCloseTimeoutRef.current) {
        window.clearTimeout(sidebarCloseTimeoutRef.current);
      }

      sidebarCloseTimeoutRef.current = window.setTimeout(() => {
        setIsSidebarClosing(false);
      }, 300);

      return;
    }

    setIsSidebarOpen(false);
  };

  useEffect(() => {
    return () => {
      if (sidebarCloseTimeoutRef.current) {
        window.clearTimeout(sidebarCloseTimeoutRef.current);
      }
    };
  }, []);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      const fetchReviews = async () => {
        try {
          const res = await fetch(
            `http://localhost:9000/api/location/${selectedLocation}/reviews`,
          );
          if (res.ok) {
            const data = await res.json();
            setLocationReviews(data);
          }
        } catch (err) {
          console.error("Failed to fetch reviews:", err);
        }
      };
      fetchReviews();
    } else {
      setLocationReviews([]);
    }
  }, [selectedLocation]);

  const [wishlistCityIds, setWishlistCityIds] = useState<Set<number>>(
    new Set(),
  );
  const [wishlistLocationIds, setWishlistLocationIds] = useState<Set<number>>(
    new Set(),
  );
  const [travelHistoryLocationIds, setTravelHistoryLocationIds] = useState<
    Set<number>
  >(new Set());
  const [travelHistoryItems, setTravelHistoryItems] = useState<HistoryItem[]>(
    [],
  );
  const [expandedReviewLocationIds, setExpandedReviewLocationIds] = useState<
    Set<number>
  >(new Set());
  const [reviewTextDrafts, setReviewTextDrafts] = useState<
    Record<number, string>
  >({});
  const [ratingDrafts, setRatingDrafts] = useState<Record<number, number>>({});
  const [savingReviewLocationId, setSavingReviewLocationId] = useState<
    number | null
  >(null);
  const [deletingReviewLocationId, setDeletingReviewLocationId] = useState<
    number | null
  >(null);
  const [confirmDeleteReviewLocationId, setConfirmDeleteReviewLocationId] =
    useState<number | null>(null);
  const [flippedImageIds, setFlippedImageIds] = useState<Set<number>>(
    new Set(),
  );
  const [hasUserThemePreference, setHasUserThemePreference] = useState(() => {
    return localStorage.getItem("darkMode") !== null;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === null) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    if (saved === "true") return true;
    return false;
  });
  const [searchCity, setSearchCity] = useState("");
  const filteredCities = Cities?.filter((city) => {
    return city.name?.toLowerCase().includes(searchCity.toLowerCase());
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    if (hasUserThemePreference) {
      localStorage.setItem("darkMode", darkMode.toString());
    }
  }, [darkMode, hasUserThemePreference]);

  useEffect(() => {
    if (hasUserThemePreference) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [hasUserThemePreference]);

  const filteredLocations = Locations.filter((l) => l.city_id === selectedCity);
  const wishlistCities = Cities.filter((city) => wishlistCityIds.has(city.id));
  const wishlistLocations = Locations.filter((location) =>
    wishlistLocationIds.has(location.id),
  );
  const filteredImages = Images.filter(
    (img) => img.location_id === selectedLocation,
  );

  const currentCity = Cities?.find((c) => c.id === selectedCity);
  const currentLocation = Locations.find((l) => l.id === selectedLocation);
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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const toggleLocationCollection = (
    locationId: number,
    collection: "wishlist" | "travelHistory",
  ) => {
    if (!User?.id) {
      setShowAuthModal(true);
      return;
    }

    if (collection === "wishlist") {
      setWishlistLocationIds((prev) => {
        const updated = new Set(prev);
        if (updated.has(locationId)) {
          updated.delete(locationId);
        } else {
          updated.add(locationId);
        }
        return updated;
      });
      return;
    }

    // This toggle is persisted in the database via `/api/history/visited`.
    const userId = User?.id;
    if (typeof userId !== "number") return;

    (async () => {
      try {
        const response = await fetch(
          "http://localhost:9000/api/history/visited",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              location_id: locationId,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "History update failed");
        }

        // Refresh from DB so review/rating state stays consistent too.
        await loadTravelHistory(userId);
      } catch (error) {
        console.error(error);
      }
    })();
  };

  const loadWishlist = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/wishlist/${userId}`,
      );
      if (!response.ok) return;
      const data: WishlistItem[] = await response.json();
      const cityIds = new Set<number>();
      const locationIds = new Set<number>();

      data.forEach((item) => {
        if (item.city_id !== null) cityIds.add(item.city_id);
        if (item.location_id !== null) locationIds.add(item.location_id);
      });

      setWishlistCityIds(cityIds);
      setWishlistLocationIds(locationIds);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    }
  };

  useEffect(() => {
    if (User?.id) {
      loadWishlist(User.id);
    }
  }, [User?.id]);

  const loadTravelHistory = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/history/${userId}`,
      );
      if (!response.ok) return;

      const data: HistoryItem[] = await response.json();
      // Backend sorts by \`travel_date DESC\`; keep the latest entry per location.
      const latestByLocationId = new Map<number, HistoryItem>();
      data.forEach((item) => {
        if (!latestByLocationId.has(item.location_id)) {
          latestByLocationId.set(item.location_id, item);
        }
      });

      const items = Array.from(latestByLocationId.values());
      setTravelHistoryItems(items);
      setTravelHistoryLocationIds(new Set(items.map((i) => i.location_id)));

      const reviewDrafts: Record<number, string> = {};
      const ratingDraftsLocal: Record<number, number> = {};
      items.forEach((i) => {
        reviewDrafts[i.location_id] = i.review_text ?? "";
        ratingDraftsLocal[i.location_id] = i.rating ?? 1;
      });
      setReviewTextDrafts(reviewDrafts);
      setRatingDrafts(ratingDraftsLocal);
      setExpandedReviewLocationIds(new Set());
    } catch (error) {
      console.error("Failed to load travel history:", error);
    }
  };

  useEffect(() => {
    if (User?.id) {
      loadTravelHistory(User.id);
    }
  }, [User?.id]);

  const toggleReviewSection = (locationId: number) => {
    // Toggle expanded/collapsed state
    setExpandedReviewLocationIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(locationId)) updated.delete(locationId);
      else updated.add(locationId);
      return updated;
    });

    // When opening, hydrate drafts from saved values.
    const item = travelHistoryItems.find((i) => i.location_id === locationId);
    setReviewTextDrafts((prev) => ({
      ...prev,
      [locationId]: item?.review_text ?? "",
    }));
    setRatingDrafts((prev) => ({
      ...prev,
      [locationId]: item?.rating ?? 1,
    }));
  };

  const saveReviewForLocation = async (locationId: number) => {
    if (!User?.id) return;
    const review_text = reviewTextDrafts[locationId]?.trim() ?? "";
    const rating = ratingDrafts[locationId] ?? 1;

    setSavingReviewLocationId(locationId);
    try {
      const response = await fetch("http://localhost:9000/api/history/review", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: User.id,
          location_id: locationId,
          review_text,
          rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save review");
      }

      const updated: HistoryItem = await response.json();
      setTravelHistoryItems((prev) =>
        prev.map((i) => (i.location_id === locationId ? updated : i)),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSavingReviewLocationId(null);
    }
  };

  const initiateDeleteReview = (locationId: number) => {
    setConfirmDeleteReviewLocationId(locationId);
  };

  const deleteReviewForLocation = async (locationId: number) => {
    if (!User?.id) return;

    setDeletingReviewLocationId(locationId);
    setConfirmDeleteReviewLocationId(null);
    try {
      const response = await fetch("http://localhost:9000/api/history/review", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: User.id,
          location_id: locationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete review");
      }

      const updated: HistoryItem = await response.json();
      setTravelHistoryItems((prev) =>
        prev.map((i) => (i.location_id === locationId ? updated : i)),
      );
      setReviewTextDrafts((prev) => {
        const next = { ...prev };
        delete next[locationId];
        return next;
      });
      setRatingDrafts((prev) => {
        const next = { ...prev };
        delete next[locationId];
        return next;
      });
      // Close the expanded review section after successful deletion
      toggleReviewSection(locationId);
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingReviewLocationId(null);
    }
  };

  const toggleCityWishlist = async (cityId: number) => {
    if (!User?.id) {
      setShowAuthModal(true);
      return;
    }

    const isAlreadyWishlisted = wishlistCityIds.has(cityId);

    try {
      const response = await fetch("http://localhost:9000/api/wishlist", {
        method: isAlreadyWishlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: User.id,
          city_id: cityId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Wishlist update failed");
      }

      setWishlistCityIds((prev) => {
        const updated = new Set(prev);
        if (updated.has(cityId)) {
          updated.delete(cityId);
        } else {
          updated.add(cityId);
        }
        return updated;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLocationWishlist = async (locationId: number) => {
    if (!User?.id) {
      setShowAuthModal(true);
      return;
    }

    const isAlreadyWishlisted = wishlistLocationIds.has(locationId);

    try {
      const response = await fetch("http://localhost:9000/api/wishlist", {
        method: isAlreadyWishlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: User.id,
          location_id: locationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Wishlist update failed");
      }

      setWishlistLocationIds((prev) => {
        const updated = new Set(prev);
        if (updated.has(locationId)) {
          updated.delete(locationId);
        } else {
          updated.add(locationId);
        }
        return updated;
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-slate-200 transition-colors overflow-hidden">
      {/* Mobile Top Header */}
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

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Wrapper */}
      <div
        className={`fixed inset-y-0 left-0 md:relative md:inset-y-auto md:left-auto transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isSidebarClosing ? "md:-translate-x-2" : "md:translate-x-0"} z-50 md:z-auto transition-all duration-300 ease-in-out h-full md:h-screen ${isSidebarOpen ? "w-60" : "w-16 md:w-16"} shrink-0 overflow-hidden`}
      >
        <DashboardSidebar
          onAuthRequired={() => setShowAuthModal(true)}
          User={User}
          preview={preview}
          handleFile={handleFile}
          activeSection={activeSection}
          setActiveSection={(sec) => {
            setActiveSection(sec);
            closeSidebarOnMobile();
          }}
          searchCity={searchCity}
          setSearchCity={setSearchCity}
          filteredCities={filteredCities}
          selectedCity={selectedCity}
          setSelectedCity={(id) => {
            setSelectedCity(id);
            closeSidebarOnMobile();
          }}
          setSelectedLocation={setSelectedLocation}
          wishlistCityIds={wishlistCityIds}
          toggleCityWishlist={toggleCityWishlist}
          onCloseMobile={closeSidebar}
          onLogOut={handleLogoutClick}
          darkMode={darkMode}
          toggleTheme={() => {
            setHasUserThemePreference(true);
            setDarkMode((prev) => !prev);
          }}
          onDesktopToggle={() => {
            if (isSidebarOpen) {
              closeSidebar();
            } else {
              openSidebar();
            }
          }}
          isExpanded={isSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-3 md:p-4 overflow-y-auto w-full md:w-auto h-[calc(100vh-72px)] md:h-screen relative">
        {/* No city selected */}
        {activeSection === "cities" && !selectedCity && (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-400 text-xl">
            Select a city to explore locations
          </div>
        )}

        {/* City selected but no location selected */}
        {activeSection === "cities" && selectedCity && !selectedLocation && (
          <CitiesView
            currentCity={currentCity}
            filteredLocations={filteredLocations}
            setSelectedLocation={setSelectedLocation}
            wishlistLocationIds={wishlistLocationIds}
            toggleLocationWishlist={toggleLocationWishlist}
            travelHistoryLocationIds={travelHistoryLocationIds}
            toggleLocationCollection={toggleLocationCollection}
          />
        )}

        {activeSection === "wishlist" && (
          <WishlistView
            wishlistCities={wishlistCities}
            wishlistLocations={wishlistLocations}
            setActiveSection={setActiveSection}
            setSelectedCity={setSelectedCity}
            setSelectedLocation={setSelectedLocation}
          />
        )}

        {activeSection === "chatbot" && <ChatbotView userId={User?.id} />}

        {activeSection === "travelHistory" && (
          <TravelHistoryView
            travelHistoryItems={travelHistoryItems}
            Locations={Locations}
            expandedReviewLocationIds={expandedReviewLocationIds}
            toggleReviewSection={toggleReviewSection}
            reviewTextDrafts={reviewTextDrafts}
            setReviewTextDrafts={setReviewTextDrafts}
            ratingDrafts={ratingDrafts}
            setRatingDrafts={setRatingDrafts}
            savingReviewLocationId={savingReviewLocationId}
            saveReviewForLocation={saveReviewForLocation}
            deleteReviewForLocation={deleteReviewForLocation}
            initiateDeleteReview={initiateDeleteReview}
            deletingReviewLocationId={deletingReviewLocationId}
            confirmDeleteReviewLocationId={confirmDeleteReviewLocationId}
            setConfirmDeleteReviewLocationId={setConfirmDeleteReviewLocationId}
            setActiveSection={setActiveSection}
            setSelectedCity={setSelectedCity}
            setSelectedLocation={setSelectedLocation}
          />
        )}

        {/* Location selected */}
        {activeSection === "cities" && selectedLocation && (
          <LocationDetailsView
            currentLocation={currentLocation}
            parsedLatitude={parsedLatitude}
            parsedLongitude={parsedLongitude}
            hasValidCoordinates={hasValidCoordinates}
            googleMapsUrl={googleMapsUrl}
            mapEmbedUrl={mapEmbedUrl}
            wishlistLocationIds={wishlistLocationIds}
            toggleLocationWishlist={toggleLocationWishlist}
            travelHistoryLocationIds={travelHistoryLocationIds}
            toggleLocationCollection={toggleLocationCollection}
            filteredImages={filteredImages}
            flippedImageIds={flippedImageIds}
            setFlippedImageIds={setFlippedImageIds}
            setSelectedLocation={setSelectedLocation}
            locationReviews={locationReviews}
          />
        )}
      </div>

      {/* Authentication Modal */}
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
                onClick={() => navigate("/ghumphir/login")}
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

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
                  navigate("/ghumphir/login");
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

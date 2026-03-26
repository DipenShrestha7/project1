import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
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
        console.log(data);
        const formatted: Cities[] = data.map((item) => ({
          id: item.city_id,
          name: item.city_name,
          description: item.description,
        }));
        setCities(formatted);
      } catch (err) {
        console.log(err);
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
        console.log(data);
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
        console.log(err);
      }
    };
    fetchLocationData();
  }, []);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/admin/images");
        const data: Image[] = await response.json();
        console.log(data);
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
        console.log(err);
      }
    };
    fetchImageData();
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not logged in");
        navigate("/login");
      }
      try {
        const response = await fetch("http://localhost:9000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          navigate("/login");
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
    console.log(file);
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
      console.log(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [locationReviews, setLocationReviews] = useState<Review[]>([]);

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
  console.log(selectedLocation);
  console.log(Images);
  console.log(filteredImages);
  console.log(filteredImages.length);

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
    ? `https://maps.google.com/maps?q=${parsedLatitude},${parsedLongitude}&z=15&output=embed`
    : "";

  const LogOut = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const toggleLocationCollection = (
    locationId: number,
    collection: "wishlist" | "travelHistory",
  ) => {
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

  const toggleCityWishlist = async (cityId: number) => {
    if (!User?.id) return;

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
    if (!User?.id) return;

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
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-slate-200 transition-colors">
      {/* Sidebar */}
      <DashboardSidebar
        User={User}
        preview={preview}
        handleFile={handleFile}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        filteredCities={filteredCities}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        setSelectedLocation={setSelectedLocation}
        wishlistCityIds={wishlistCityIds}
        toggleCityWishlist={toggleCityWishlist}
      />

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-auto">
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

      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => {
          setHasUserThemePreference(true);
          setDarkMode((prev) => !prev);
        }}
        className="fixed bottom-6 left-6 p-3 bg-sky-600 text-white rounded-full shadow-lg hover:bg-sky-700 transition z-50"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <button
        onClick={() => {
          LogOut();
        }}
        className="fixed bottom-6 left-40 px-3 py-2.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition z-50"
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;

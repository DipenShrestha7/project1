import { useState, useEffect } from "react";
import { MapPin, Sun, Moon, Search, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

type User = {
  id?: number;
  name?: string;
  email?: string;
};

type City = {
  city_id: number;
  city_name: string;
  description: string;
  created_at: string;
};

type Cities = {
  id: number;
  name?: string;
  description?: string;
};

type Location = {
  location_id: number;
  location_name: string;
  description: string;
  city_id: number;
  created_at: string;
  latitude: number | string;
  longitude: number | string;
};

type Locations = {
  id: number;
  name: string;
  description: string;
  city_id: number;
  latitude: number | string;
  longitude: number | string;
};

type Image = {
  image_id: number;
  location_id: number;
  image_url: string;
  image_description: string;
};

type Images = {
  id: number;
  location_id: number;
  image_url: string;
  image_description: string;
};

const Dashboard = () => {
  const [User, setUser] = useState<User>();
  const [Cities, setCities] = useState<Cities[]>([]);
  const [Locations, setLocations] = useState<Locations[]>([]);
  const [Images, setImages] = useState<Images[]>([]);
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-slate-200 transition-colors">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-gray-800 shadow-xl rounded-r-3xl p-6 flex flex-col gap-8 transition-colors">
        <div className="flex items-center gap-4 bg-sky-600 text-white rounded-2xl p-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center text-sky-600 font-semibold">
            <input
              type="file"
              accept="image"
              className="hidden"
              id="fileInput"
              onChange={handleFile}
            />
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 rounded-lg object-cover cursor-pointer"
                onClick={() => document.getElementById("fileInput")?.click()}
              />
            ) : (
              <div
                onClick={() => document.getElementById("fileInput")?.click()}
                className="w-40 h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
              >
                <span className="text-4xl text-gray-500 p-4 mb-2">+</span>
              </div>
            )}
          </div>
          <div className="leading-tight">
            <h2 className="text-base font-semibold">{User?.name}</h2>
            <p className="text-sm opacity-90">{User?.email}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sky-900 dark:text-sky-400 font-semibold mb-3 text-lg">
            Cities
          </h3>
          <div className="relative my-4">
            <input
              className="border border-black white p-1.5 pl-8 bg-white text-black dark:bg-slate-800 text-sm rounded-3xl w-full dark:border-white dark:text-white"
              placeholder="Search"
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
          </div>
          <div className="flex flex-col gap-2">
            {filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id);
                  setSelectedLocation(null);
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${
                  selectedCity === city.id
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-white"
                    : "hover:bg-slate-100 text-slate-700 dark:hover:bg-gray-700 dark:text-slate-200"
                }`}
              >
                <MapPin size={18} /> {city.name?.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-auto">
        {/* No city selected */}
        {!selectedCity && (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-400 text-xl">
            Select a city to explore locations
          </div>
        )}

        {/* City selected but no location selected */}
        {selectedCity && !selectedLocation && (
          <div>
            {/* City Name */}
            <h2 className="text-3xl font-semibold text-sky-900 dark:text-sky-400 mb-2">
              {currentCity?.name?.toUpperCase()}
            </h2>
            {/* City Description */}
            <p className="mb-6 text-slate-700 dark:text-slate-300">
              {currentCity?.description || "No description available"}
            </p>

            <h3 className="text-2xl font-semibold text-sky-900 dark:text-sky-400 mb-4">
              Locations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-sky-800 dark:text-sky-300">
                    {loc.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Tap to view images
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location selected */}
        {selectedLocation && (
          <div>
            {/* Location Name */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedLocation(null)}
                className="mr-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
              >
                ← Back
              </button>
              <h2 className="inline text-3xl font-semibold text-sky-900 dark:text-sky-400">
                {currentLocation?.name}
              </h2>

              <p className="mt-2 text-slate-700 dark:text-slate-300">
                {currentLocation?.description}
              </p>

              {hasValidCoordinates ? (
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Coordinates: {parsedLatitude.toFixed(6)},{" "}
                      {parsedLongitude.toFixed(6)}
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                  <iframe
                    title="Location map"
                    src={mapEmbedUrl}
                    className="w-full h-72 rounded-xl border border-slate-200 dark:border-slate-700"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <p className="mt-4 text-sm text-amber-600 dark:text-amber-400">
                  Map unavailable: this location is missing valid
                  latitude/longitude.
                </p>
              )}

              <div className="py-4 w-1/3"></div>
              <div className="flex items-center gap-2 mb-6">
                <Camera className="text-sky-600" />
                <h2 className="text-3xl font-semibold text-sky-900">
                  Location Images
                </h2>
              </div>

              {/* Images grid follows here */}
            </div>

            {filteredImages.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400">
                No images available
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="h-64 cursor-pointer perspective"
                  onClick={() => {
                    const newFlipped = new Set(flippedImageIds);
                    if (newFlipped.has(img.id)) {
                      newFlipped.delete(img.id);
                    } else {
                      newFlipped.add(img.id);
                    }
                    setFlippedImageIds(newFlipped);
                  }}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-500 ease-in-out"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: flippedImageIds.has(img.id)
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    {/* Front - Image */}
                    <div
                      className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <img
                        src={img.image_url}
                        className="w-full h-full object-cover"
                        alt={img.image_description}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3 text-white text-xs">
                        Click to see description
                      </div>
                    </div>

                    {/* Back - Description */}
                    <div
                      className="absolute w-full h-full bg-sky-600 dark:bg-sky-700 rounded-2xl shadow-md overflow-hidden p-6 flex flex-col justify-between"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-3">
                          Description
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {img.image_description || "No description available"}
                        </p>
                      </div>
                      <div className="text-white/70 text-xs text-center">
                        Click to go back
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

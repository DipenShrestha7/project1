import { useState, useEffect } from "react";
import { MapPin, Sun, Moon, Search, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

type User = {
  id?: number;
  name?: string;
  email?: string;
};

const Dashboard = () => {
  const [User, setUser] = useState<User>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
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
        console.log(data);
        console.log(`http://localhost:9000${data.profile_image}`);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, [navigate]);
  console.log(preview);

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

  const cities = [
    {
      id: 1,
      name: "Kathmandu",
      description: "The capital city of Nepal, known for temples and culture.",
      lat: 27.7103,
      lng: 85.3222,
    },
    {
      id: 2,
      name: "Pokhara",
      description: "Famous for lakes, mountains, and adventure tourism.",
    },
  ];

  const locations = [
    {
      id: 1,
      name: "Pashupatinath",
      cityId: 1,
      description: "One of the holiest Hindu temples in Nepal.",
      lat: 27.7105,
      lng: 85.3488,
    },
    {
      id: 2,
      name: "Swayambhunath",
      cityId: 1,
      description: "Ancient religious complex atop a hill in Kathmandu.",
      lat: 27.7149,
      lng: 85.2904,
    },
    {
      id: 3,
      name: "Fewa Lake",
      cityId: 2,
      description: "Beautiful lake in Pokhara with boating and mountain views.",
      lat: 28.2154,
      lng: 83.9453,
    },
  ];

  const images = [
    { id: 1, locationId: 1, url: "https://picsum.photos/400/300?1" },
    { id: 2, locationId: 1, url: "https://picsum.photos/400/300?2" },
    { id: 3, locationId: 3, url: "https://picsum.photos/400/300?3" },
  ];

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [searchCity, setSearchCity] = useState("");
  const filteredCities = cities.filter((city) => {
    return city.name.toLowerCase().includes(searchCity.toLowerCase());
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  const filteredLocations = locations.filter((l) => l.cityId === selectedCity);
  const filteredImages = images.filter(
    (img) => img.locationId === selectedLocation,
  );

  const currentCity = cities.find((c) => c.id === selectedCity);
  const currentLocation = locations.find((l) => l.id === selectedLocation);

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
              className="border border-white white p-1.5 pl-8 bg-white dark:bg-slate-800 text-sm rounded-3xl w-full"
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
                <MapPin size={18} /> {city.name}
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
              {currentCity?.name}
            </h2>
            {/* City Description */}
            <p className="mb-6 text-slate-700 dark:text-slate-300">
              {currentCity?.description}
            </p>
            <div className="w-1/3 mb-5">
              <div
                key={currentCity?.id}
                className="border rounded-lg shadow-lg overflow-hidden"
              >
                {currentCity && (
                  <iframe
                    title={currentCity.name}
                    width="100%"
                    height="300"
                    className="border-0 rounded-xl"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      currentCity.name,
                    )}&output=embed`}
                  />
                )}
              </div>
            </div>

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

              <div className="py-4 w-1/3">
                <div
                  key={currentLocation?.id}
                  className="border rounded-lg shadow-lg overflow-hidden"
                >
                  <iframe
                    title={currentLocation?.name}
                    width="100%"
                    height="300"
                    className="border-0"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${currentLocation?.lat},${currentLocation?.lng}&z=14&output=embed`}
                  ></iframe>
                </div>
              </div>
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
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <img src={img.url} className="w-full h-56 object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
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

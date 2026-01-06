import { useState } from "react";
import { MapPin, Camera } from "lucide-react";

const Dashboard = () => {
  const user = {
    name: "Alice Johnson",
    email: "alice@gmail.com",
  };

  const cities = [
    { id: 1, name: "Kathmandu" },
    { id: 2, name: "Pokhara" },
  ];

  const locations = [
    {
      id: 1,
      name: "Pashupatinath",
      cityId: 1,
    },
    {
      id: 2,
      name: "Swayambhunath",
      cityId: 1,
    },
    {
      id: 3,
      name: "Fewa Lake",
      cityId: 2,
    },
  ];

  const images = [
    {
      id: 1,
      locationId: 1,
      url: "https://picsum.photos/400/300?1",
    },
    {
      id: 2,
      locationId: 1,
      url: "https://picsum.photos/400/300?2",
    },
    {
      id: 3,
      locationId: 3,
      url: "https://picsum.photos/400/300?3",
    },
  ];

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const filteredLocations = locations.filter((l) => l.cityId === selectedCity);

  const filteredImages = images.filter(
    (img) => img.locationId === selectedLocation
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="w-72 bg-white shadow-xl rounded-r-3xl p-6 flex flex-col gap-8">
        <div className="flex items-center gap-4 bg-sky-600 text-white rounded-2xl p-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center text-sky-600 font-semibold">
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="leading-tight">
            <h2 className="text-base font-semibold">{user.name}</h2>
            <p className="text-sm opacity-90">{user.email}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sky-900 font-semibold mb-3">Cities</h3>
          <div className="flex flex-col gap-2">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id);
                  setSelectedLocation(null);
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${
                  selectedCity === city.id
                    ? "bg-sky-100 text-sky-700"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <MapPin size={18} />
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-10 overflow-auto">
        {!selectedCity && (
          <div className="h-full flex items-center justify-center text-slate-400 text-xl">
            Select a city to explore locations
          </div>
        )}

        {selectedCity && !selectedLocation && (
          <div>
            <h2 className="text-3xl font-semibold text-sky-900 mb-6">
              Locations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className="cursor-pointer bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-sky-800">
                    {loc.name}
                  </h3>
                  <p className="text-slate-500 mt-1">Tap to view images</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedLocation && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Camera className="text-sky-600" />
              <h2 className="text-3xl font-semibold text-sky-900">
                Location Images
              </h2>
            </div>

            {filteredImages.length === 0 && (
              <p className="text-slate-500">No images available</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <img src={img.url} className="w-full h-56 object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

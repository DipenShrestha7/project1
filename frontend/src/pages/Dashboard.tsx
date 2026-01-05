import { useState } from "react";
import { Users, MapPin, Camera, Calendar } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { key: "users", label: "Users", icon: <Users size={20} /> },
    { key: "cities", label: "Cities", icon: <MapPin size={20} /> },
    { key: "locations", label: "Locations", icon: <MapPin size={20} /> },
    { key: "history", label: "Travel History", icon: <Calendar size={20} /> },
    { key: "images", label: "Images", icon: <Camera size={20} /> },
  ];

  // Dummy data for now
  const data = {
    users: [
      { id: 1, name: "Alice", email: "alice@gmail.com" },
      { id: 2, name: "Bob", email: "bob@gmail.com" },
    ],
    cities: [
      { id: 1, name: "Kathmandu", description: "Capital of Nepal" },
      { id: 2, name: "Pokhara", description: "Tourist city" },
    ],
    locations: [
      {
        id: 1,
        name: "Pashupatinath",
        city: "Kathmandu",
        lat: 27.71,
        long: 85.324,
      },
      {
        id: 2,
        name: "Fewa Lake",
        city: "Pokhara",
        lat: 28.2096,
        long: 83.9311,
      },
    ],
    history: [
      {
        id: 1,
        user: "Alice",
        location: "Pashupatinath",
        date: "2026-01-01",
        rating: 5,
      },
      {
        id: 2,
        user: "Bob",
        location: "Fewa Lake",
        date: "2026-01-02",
        rating: 4,
      },
    ],
    images: [
      {
        id: 1,
        location: "Pashupatinath",
        url: "https://picsum.photos/200",
        description: "Temple view",
      },
      {
        id: 2,
        location: "Fewa Lake",
        url: "https://picsum.photos/200",
        description: "Lake view",
      },
    ],
  };

  return (
    <div className="min-h-screen flex bg-[#f4f9ff]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg rounded-r-3xl p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-sky-900 mb-8 text-center">
          Travel Dashboard
        </h1>
        <nav className="flex flex-col gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition
                ${
                  activeTab === tab.key
                    ? "bg-sky-600 text-white"
                    : "text-sky-700 hover:bg-sky-100"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10 overflow-auto">
        <h2 className="text-3xl font-semibold text-sky-900 mb-6 capitalize">
          {activeTab}
        </h2>

        {/* Render content based on activeTab */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.users.map((user) => (
              <div key={user.id} className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="font-bold text-sky-800">{user.name}</h3>
                <p className="text-sky-600">{user.email}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "cities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.cities.map((city) => (
              <div key={city.id} className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="font-bold text-sky-800">{city.name}</h3>
                <p className="text-sky-600">{city.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "locations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.locations.map((loc) => (
              <div key={loc.id} className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="font-bold text-sky-800">{loc.name}</h3>
                <p className="text-sky-600">{loc.city}</p>
                <p className="text-sky-500 text-sm">
                  Lat: {loc.lat}, Long: {loc.long}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.history.map((h) => (
              <div key={h.id} className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="font-bold text-sky-800">{h.user}</h3>
                <p className="text-sky-600">{h.location}</p>
                <p className="text-sky-500 text-sm">
                  Date: {h.date} | Rating: {h.rating}/5
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "images" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.images.map((img) => (
              <div key={img.id} className="p-4 bg-white rounded-2xl shadow-md">
                <img
                  src={img.url}
                  alt={img.description}
                  className="w-full h-48 object-cover rounded-xl mb-2"
                />
                <h3 className="font-bold text-sky-800">{img.location}</h3>
                <p className="text-sky-600 text-sm">{img.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import { useState } from "react";
import type { ReactNode } from "react";

type city = {
  city_id: string;
  city_name: string;
  description: string;
};

type location = {
  location_id: string;
  location_name: string;
  description: string;
  city_id: string;
  city_name: string;
  latitude: number;
  longitude: number;
};

export default function AdminPanel() {
  /* =========================
      CITY STATES
  ========================== */

  const [cityName, setCityName] = useState("");
  const [cityDescription, setCityDescription] = useState("");

  const [updateCityId, setUpdateCityId] = useState("");
  const [updateCityName, setUpdateCityName] = useState("");
  const [updateCityDescription, setUpdateCityDescription] = useState("");

  const [deleteCityId, setDeleteCityId] = useState("");

  const [searchCityId, setSearchCityId] = useState("");
  const [searchCityName, setSearchCityName] = useState("");
  const [fetchedCity, setFetchedCity] = useState<city | null>(null);

  /* =========================
      LOCATION STATES
  ========================== */

  const [locationName, setLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [locationCityId, setLocationCityId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [updateLocationId, setUpdateLocationId] = useState("");
  const [updateLocationName, setUpdateLocationName] = useState("");
  const [updateLocationDescription, setUpdateLocationDescription] =
    useState("");
  const [updateLatitude, setUpdateLatitude] = useState("");
  const [updateLongitude, setUpdateLongitude] = useState("");

  const [deleteLocationId, setDeleteLocationId] = useState("");

  const [searchLocationId, setSearchLocationId] = useState("");
  const [searchLocationName, setSearchLocationName] = useState("");
  const [fetchedLocation, setFetchedLocation] = useState<location | null>(null);

  /* =========================
      CITY FUNCTIONS
  ========================== */

  const handleAddCity = async () => {
    await fetch("http://localhost:9000/api/admin/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city_name: cityName,
        description: cityDescription,
      }),
    });
    alert("City Added");
  };

  const handleUpdateCity = async () => {
    await fetch(`http://localhost:9000/api/admin/city/${updateCityId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city_name: updateCityName,
        description: updateCityDescription,
      }),
    });
    alert("City Updated");
  };

  const handleDeleteCity = async () => {
    await fetch(`http://localhost:9000/api/admin/city/${deleteCityId}`, {
      method: "DELETE",
    });
    alert("City Deleted");
  };

  const handleGetCity = async () => {
    let url = "";
    if (searchCityId)
      url = `http://localhost:9000/api/admin/city/${searchCityId}`;
    else if (searchCityName)
      url = `http://localhost:9000/api/admin/city/name/${searchCityName}`;
    else return alert("Enter ID or Name");

    const res = await fetch(url);
    const data = await res.json();
    setFetchedCity(data);
  };

  const handleGetAllCities = async () => {
    const res = await fetch("http://localhost:9000/api/admin/cities");
    const data = await res.json();
    console.log(data);
  };

  /* =========================
      LOCATION FUNCTIONS
  ========================== */

  const handleAddLocation = async () => {
    await fetch("http://localhost:9000/api/admin/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location_name: locationName,
        description: locationDescription,
        city_id: locationCityId,
        latitude,
        longitude,
      }),
    });
    alert("Location Added");
  };

  const handleUpdateLocation = async () => {
    await fetch(
      `http://localhost:9000/api/admin/location/${updateLocationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location_name: updateLocationName,
          description: updateLocationDescription,
          latitude: updateLatitude,
          longitude: updateLongitude,
        }),
      },
    );
    alert("Location Updated");
  };

  const handleDeleteLocation = async () => {
    await fetch(
      `http://localhost:9000/api/admin/location/${deleteLocationId}`,
      {
        method: "DELETE",
      },
    );
    alert("Location Deleted");
  };

  const handleGetLocation = async () => {
    let url = "";
    if (searchLocationId)
      url = `http://localhost:9000/api/admin/location/${searchLocationId}`;
    else if (searchLocationName)
      url = `http://localhost:9000/api/admin/location/name/${searchLocationName}`;
    else return alert("Enter ID or Name");

    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    setFetchedLocation(data);
  };

  const handleGetAllLocations = async () => {
    const res = await fetch("http://localhost:9000/api/admin/locations");
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {/* ADD CITY */}
        <Container title="Add City">
          <Input
            placeholder="City Name"
            value={cityName}
            onChange={setCityName}
          />
          <Input
            placeholder="Description"
            value={cityDescription}
            onChange={setCityDescription}
          />
          <Button
            text="Add City"
            onClick={handleAddCity}
            color="bg-green-600"
          />
        </Container>

        {/* UPDATE CITY */}
        <Container title="Update City">
          <Input
            placeholder="City ID"
            value={updateCityId}
            onChange={setUpdateCityId}
          />
          <Input
            placeholder="New Name"
            value={updateCityName}
            onChange={setUpdateCityName}
          />
          <Input
            placeholder="New Description"
            value={updateCityDescription}
            onChange={setUpdateCityDescription}
          />
          <Button
            text="Update City"
            onClick={handleUpdateCity}
            color="bg-yellow-600"
          />
        </Container>

        {/* DELETE CITY */}
        <Container title="Delete City">
          <Input
            placeholder="City ID"
            value={deleteCityId}
            onChange={setDeleteCityId}
          />
          <Button
            text="Delete City"
            onClick={handleDeleteCity}
            color="bg-red-600"
          />
        </Container>

        {/* GET CITY */}
        <Container title="Get City">
          <Button
            text="Fetch All City"
            onClick={handleGetAllCities}
            color="bg-purple-600"
          />
          <Input
            placeholder="City ID"
            value={searchCityId}
            onChange={setSearchCityId}
          />
          <Input
            placeholder="City Name"
            value={searchCityName}
            onChange={setSearchCityName}
          />
          <Button
            text="Fetch City"
            onClick={handleGetCity}
            color="bg-purple-600"
          />
          {fetchedCity && (
            <div className="mt-4 bg-gray-800 p-3 rounded">
              <p>ID: {fetchedCity.city_id}</p>
              <p>Name: {fetchedCity.city_name}</p>
              <p>Description: {fetchedCity.description}</p>
            </div>
          )}
        </Container>

        {/* ADD LOCATION */}
        <Container title="Add Location">
          <Input
            placeholder="Location Name"
            value={locationName}
            onChange={setLocationName}
          />
          <Input
            placeholder="Description"
            value={locationDescription}
            onChange={setLocationDescription}
          />
          <Input
            placeholder="City ID"
            value={locationCityId}
            onChange={setLocationCityId}
          />
          <Input
            placeholder="Latitude"
            value={latitude}
            onChange={setLatitude}
          />
          <Input
            placeholder="Longitude"
            value={longitude}
            onChange={setLongitude}
          />
          <Button
            text="Add Location"
            onClick={handleAddLocation}
            color="bg-green-600"
          />
        </Container>

        {/* UPDATE LOCATION */}
        <Container title="Update Location">
          <Input
            placeholder="Location ID"
            value={updateLocationId}
            onChange={setUpdateLocationId}
          />
          <Input
            placeholder="New Name"
            value={updateLocationName}
            onChange={setUpdateLocationName}
          />
          <Input
            placeholder="New Description"
            value={updateLocationDescription}
            onChange={setUpdateLocationDescription}
          />
          <Input
            placeholder="New Latitude"
            value={updateLatitude}
            onChange={setUpdateLatitude}
          />
          <Input
            placeholder="New Longitude"
            value={updateLongitude}
            onChange={setUpdateLongitude}
          />
          <Button
            text="Update Location"
            onClick={handleUpdateLocation}
            color="bg-yellow-600"
          />
        </Container>

        {/* DELETE LOCATION */}
        <Container title="Delete Location">
          <Input
            placeholder="Location ID"
            value={deleteLocationId}
            onChange={setDeleteLocationId}
          />
          <Button
            text="Delete Location"
            onClick={handleDeleteLocation}
            color="bg-red-600"
          />
        </Container>

        {/* GET LOCATION */}
        <Container title="Get Location">
          <Button
            text="Fetch All Locations"
            onClick={handleGetAllLocations}
            color="bg-indigo-600"
          />
          <Input
            placeholder="Location ID"
            value={searchLocationId}
            onChange={setSearchLocationId}
          />
          <Input
            placeholder="Location Name"
            value={searchLocationName}
            onChange={setSearchLocationName}
          />
          <Button
            text="Fetch Location"
            onClick={handleGetLocation}
            color="bg-indigo-600"
          />
          {fetchedLocation && (
            <div className="mt-4 bg-gray-800 p-3 rounded">
              <p>ID: {fetchedLocation.location_id}</p>
              <p>Name: {fetchedLocation.location_name}</p>
              <p>City ID: {fetchedLocation.city_id}</p>
              <p>Description: {fetchedLocation.description}</p>
              <p>Latitude: {fetchedLocation.latitude}</p>
              <p>Longitude: {fetchedLocation.longitude}</p>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}

/* =========================
    REUSABLE COMPONENTS
========================= */

function Container({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-80">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
    />
  );
}

function Button({
  text,
  onClick,
  color,
}: {
  text: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-2 rounded text-white ${color} hover:opacity-80`}
    >
      {text}
    </button>
  );
}

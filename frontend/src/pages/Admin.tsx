import { useEffect, useState } from "react";
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

type image = {
  image_id: string;
  location_id: string;
  image_url: string;
  image_description: string;
};

type NotificationType = "success" | "error" | "info";

type Notification = {
  type: NotificationType;
  message: string;
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
      IMAGE STATES
  ========================== */

  const [imageLocationId, setImageLocationId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState("");

  const [updateImageId, setUpdateImageId] = useState("");
  const [updateImageFile, setUpdateImageFile] = useState<File | null>(null);
  const [updateImageDescription, setUpdateImageDescription] = useState("");

  const [deleteImageId, setDeleteImageId] = useState("");

  const [searchImageId, setSearchImageId] = useState("");
  const [searchImageLocationId, setSearchImageLocationId] = useState("");
  const [fetchedImage, setFetchedImage] = useState<image | null>(null);
  const [fetchedImages, setFetchedImages] = useState<image[] | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
  };

  useEffect(() => {
    if (!notification) return;

    const timeoutId = setTimeout(() => {
      setNotification(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [notification]);

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
    showNotification("success", "City Added");
  };

  const handleUpdateCity = async () => {
    if (!updateCityId) {
      showNotification("info", "Please provide City ID");
      return;
    }

    const payload: Record<string, string> = {};
    if (updateCityName.trim()) payload.city_name = updateCityName;
    if (updateCityDescription.trim()) payload.description = updateCityDescription;

    if (Object.keys(payload).length === 0) {
      showNotification("info", "Please provide at least one new value");
      return;
    }

    await fetch(`http://localhost:9000/api/admin/city/${updateCityId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    showNotification("success", "City Updated");
  };

  const handleDeleteCity = async () => {
    await fetch(`http://localhost:9000/api/admin/city/${deleteCityId}`, {
      method: "DELETE",
    });
    showNotification("success", "City Deleted");
  };

  const handleGetCity = async () => {
    let url = "";
    if (searchCityId)
      url = `http://localhost:9000/api/admin/city/${searchCityId}`;
    else if (searchCityName)
      url = `http://localhost:9000/api/admin/city/name/${searchCityName}`;
    else {
      showNotification("info", "Enter ID or Name");
      return;
    }

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
    showNotification("success", "Location Added");
  };

  const handleUpdateLocation = async () => {
    if (!updateLocationId) {
      showNotification("info", "Please provide Location ID");
      return;
    }

    const payload: Record<string, string> = {};
    if (updateLocationName.trim()) payload.location_name = updateLocationName;
    if (updateLocationDescription.trim()) {
      payload.description = updateLocationDescription;
    }
    if (updateLatitude.trim()) payload.latitude = updateLatitude;
    if (updateLongitude.trim()) payload.longitude = updateLongitude;

    if (Object.keys(payload).length === 0) {
      showNotification("info", "Please provide at least one new value");
      return;
    }

    await fetch(
      `http://localhost:9000/api/admin/location/${updateLocationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    showNotification("success", "Location Updated");
  };

  const handleDeleteLocation = async () => {
    await fetch(
      `http://localhost:9000/api/admin/location/${deleteLocationId}`,
      {
        method: "DELETE",
      },
    );
    showNotification("success", "Location Deleted");
  };

  const handleGetLocation = async () => {
    let url = "";
    if (searchLocationId)
      url = `http://localhost:9000/api/admin/location/${searchLocationId}`;
    else if (searchLocationName)
      url = `http://localhost:9000/api/admin/location/name/${searchLocationName}`;
    else {
      showNotification("info", "Enter ID or Name");
      return;
    }

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

  /* =========================
      IMAGE FUNCTIONS
  ========================== */

  const handleAddImage = async () => {
    if (!imageFile) {
      showNotification("info", "Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("location_id", imageLocationId);
    formData.append("image", imageFile);
    formData.append("image_description", imageDescription);

    const res = await fetch("http://localhost:9000/api/admin/image", {
      method: "POST",
      // Note: When sending FormData, DO NOT set Content-Type header manually.
      // The browser will automatically set it to multipart/form-data with the correct boundary.
      body: formData,
    });

    if (res.ok) {
      showNotification("success", "Image Added");
      // Reset form
      setImageFile(null);
      setImageLocationId("");
      setImageDescription("");
      // Reset file input element visually
      const fileInput = document.getElementById(
        "imageFileInput",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      const errorData = await res.json();
      showNotification("error", "Error adding image: " + errorData.message);
    }
  };

  const handleUpdateImage = async () => {
    if (!updateImageId) {
      showNotification("info", "Please provide Image ID");
      return;
    }

    if (!updateImageFile && !updateImageDescription) {
      showNotification(
        "info",
        "Please provide a new image or description to update",
      );
      return;
    }

    const formData = new FormData();
    if (updateImageFile) formData.append("image", updateImageFile);
    if (updateImageDescription)
      formData.append("image_description", updateImageDescription);

    const res = await fetch(
      `http://localhost:9000/api/admin/image/${updateImageId}`,
      {
        method: "PUT",
        body: formData,
      },
    );

    if (res.ok) {
      showNotification("success", "Image Updated");
      setUpdateImageId("");
      setUpdateImageFile(null);
      setUpdateImageDescription("");
      const fileInput = document.getElementById(
        "updateImageFileInput",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      const errorData = await res.json();
      showNotification("error", "Error updating image: " + errorData.message);
    }
  };

  const handleDeleteImage = async () => {
    await fetch(`http://localhost:9000/api/admin/image/${deleteImageId}`, {
      method: "DELETE",
    });
    showNotification("success", "Image Deleted");
  };

  const handleGetImage = async () => {
    let url = "";
    if (searchImageId)
      url = `http://localhost:9000/api/admin/image/${searchImageId}`;
    else if (searchImageLocationId)
      url = `http://localhost:9000/api/admin/image/location/${searchImageLocationId}`;
    else {
      showNotification("info", "Enter Image ID or Location ID");
      return;
    }

    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) {
      setFetchedImages(data);
      setFetchedImage(null);
    } else {
      setFetchedImage(data);
      setFetchedImages(null);
    }
  };

  const handleGetAllImages = async () => {
    const res = await fetch("http://localhost:9000/api/admin/images");
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
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

        {/* ADD IMAGE */}
        <Container title="Add Image">
          <Input
            placeholder="Location ID"
            value={imageLocationId}
            onChange={setImageLocationId}
          />
          <input
            id="imageFileInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
          />
          <Input
            placeholder="Image Description"
            value={imageDescription}
            onChange={setImageDescription}
          />
          <Button
            text="Add Image"
            onClick={handleAddImage}
            color="bg-green-600"
          />
        </Container>

        {/* UPDATE IMAGE */}
        <Container title="Update Image">
          <Input
            placeholder="Image ID"
            value={updateImageId}
            onChange={setUpdateImageId}
          />
          <input
            id="updateImageFileInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setUpdateImageFile(e.target.files[0]);
              }
            }}
            className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 cursor-pointer"
          />
          <Input
            placeholder="New Description"
            value={updateImageDescription}
            onChange={setUpdateImageDescription}
          />
          <Button
            text="Update Image"
            onClick={handleUpdateImage}
            color="bg-yellow-600"
          />
        </Container>

        {/* DELETE IMAGE */}
        <Container title="Delete Image">
          <Input
            placeholder="Image ID"
            value={deleteImageId}
            onChange={setDeleteImageId}
          />
          <Button
            text="Delete Image"
            onClick={handleDeleteImage}
            color="bg-red-600"
          />
        </Container>

        {/* GET IMAGE */}
        <Container title="Get Image">
          <Button
            text="Fetch All Images"
            onClick={handleGetAllImages}
            color="bg-teal-600"
          />
          <Input
            placeholder="Image ID"
            value={searchImageId}
            onChange={setSearchImageId}
          />
          <Input
            placeholder="Location ID"
            value={searchImageLocationId}
            onChange={setSearchImageLocationId}
          />
          <Button
            text="Fetch Image(s)"
            onClick={handleGetImage}
            color="bg-teal-600"
          />
          {fetchedImage && (
            <div className="mt-4 bg-gray-800 p-3 rounded">
              <p>ID: {fetchedImage.image_id}</p>
              <p>Location ID: {fetchedImage.location_id}</p>
              <p className="truncate">URL: {fetchedImage.image_url}</p>
              <p>Description: {fetchedImage.image_description}</p>
            </div>
          )}
          {fetchedImages && fetchedImages.length > 0 && (
            <div className="mt-4 bg-gray-800 p-3 rounded max-h-40 overflow-y-auto">
              <p className="font-bold mb-2">Images ({fetchedImages.length})</p>
              {fetchedImages.map((img) => (
                <div
                  key={img.image_id}
                  className="mb-2 border-b border-gray-700 pb-2"
                >
                  <p>ID: {img.image_id}</p>
                  <p className="truncate">URL: {img.image_url}</p>
                </div>
              ))}
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

function NotificationToast({
  type,
  message,
  onClose,
}: {
  type: NotificationType;
  message: string;
  onClose: () => void;
}) {
  const typeClasses: Record<NotificationType, string> = {
    success: "border-green-500 bg-green-900/90 text-green-100",
    error: "border-red-500 bg-red-900/90 text-red-100",
    info: "border-sky-500 bg-sky-900/90 text-sky-100",
  };

  return (
    <div className="fixed top-6 right-6 z-50 w-88">
      <div
        className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm ${typeClasses[type]}`}
      >
        <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="text-lg leading-none opacity-80 transition-opacity hover:opacity-100"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

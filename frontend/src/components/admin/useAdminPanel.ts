import { useEffect, useState } from "react";
import type {
  City,
  Image,
  InlineStatus,
  Location,
  Notification,
  NotificationType,
  ReportStatus,
  UserReport,
} from "./types";

export function useAdminPanel() {
  const apiHost =
    window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
  const API_BASE = `http://${apiHost}:9000/api`;

  const [cityName, setCityName] = useState("");
  const [cityDescription, setCityDescription] = useState("");
  const [updateCityId, setUpdateCityId] = useState("");
  const [updateCityName, setUpdateCityName] = useState("");
  const [updateCityDescription, setUpdateCityDescription] = useState("");
  const [deleteCityId, setDeleteCityId] = useState("");
  const [searchCityId, setSearchCityId] = useState("");
  const [searchCityName, setSearchCityName] = useState("");
  const [fetchedCity, setFetchedCity] = useState<City | null>(null);
  const [allCities, setAllCities] = useState<City[]>([]);

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
  const [searchLocationCityId, setSearchLocationCityId] = useState("");
  const [fetchedLocation, setFetchedLocation] = useState<Location | null>(null);
  const [fetchedLocationsByCity, setFetchedLocationsByCity] = useState<
    Location[] | null
  >(null);
  const [allLocations, setAllLocations] = useState<Location[]>([]);

  const [imageLocationId, setImageLocationId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [updateImageId, setUpdateImageId] = useState("");
  const [updateImageFile, setUpdateImageFile] = useState<File | null>(null);
  const [deleteImageId, setDeleteImageId] = useState("");
  const [searchImageId, setSearchImageId] = useState("");
  const [searchImageLocationId, setSearchImageLocationId] = useState("");
  const [fetchedImage, setFetchedImage] = useState<Image | null>(null);
  const [fetchedImages, setFetchedImages] = useState<Image[] | null>(null);
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [imageInlineStatus, setImageInlineStatus] =
    useState<InlineStatus | null>(null);

  const [reports, setReports] = useState<UserReport[]>([]);
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

  const parseApiResponse = async (res: Response) => {
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    return data;
  };

  const handleAddCity = async () => {
    if (!cityName.trim()) {
      showNotification("info", "Please provide City Name");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city_name: cityName,
          description: cityDescription,
        }),
      });
      await parseApiResponse(res);
      showNotification("success", "City Added");
      setCityName("");
      setCityDescription("");
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleUpdateCity = async () => {
    if (!updateCityId) {
      showNotification("info", "Please provide City ID");
      return;
    }

    const payload: Record<string, string> = {};
    if (updateCityName.trim()) payload.city_name = updateCityName;
    if (updateCityDescription.trim()) {
      payload.description = updateCityDescription;
    }

    if (Object.keys(payload).length === 0) {
      showNotification("info", "Please provide at least one new value");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/city/${updateCityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await parseApiResponse(res);
      showNotification("success", "City Updated");
      setUpdateCityId("");
      setUpdateCityName("");
      setUpdateCityDescription("");
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleDeleteCity = async () => {
    if (!deleteCityId.trim()) {
      showNotification("info", "Please provide City ID");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/city/${deleteCityId}`, {
        method: "DELETE",
      });
      await parseApiResponse(res);
      showNotification("success", "City Deleted");
      setDeleteCityId("");
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleGetCity = async () => {
    let url = "";
    if (searchCityId) url = `${API_BASE}/admin/city/${searchCityId}`;
    else if (searchCityName)
      url = `${API_BASE}/admin/city/name/${searchCityName}`;
    else {
      showNotification("info", "Enter ID or Name");
      return;
    }

    try {
      const res = await fetch(url);
      const data = await parseApiResponse(res);
      setFetchedCity(data);
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleGetAllCities = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/cities`);
      const data = await parseApiResponse(res);
      const cityList = Array.isArray(data) ? data : [];
      setAllCities(cityList);
      showNotification("success", `Fetched ${cityList.length} cities`);
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleAddLocation = async () => {
    if (!locationName.trim() || !locationCityId.trim()) {
      showNotification("info", "Please provide Location Name and City ID");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/location`, {
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
      await parseApiResponse(res);
      showNotification("success", "Location Added");
      setLocationName("");
      setLocationDescription("");
      setLocationCityId("");
      setLatitude("");
      setLongitude("");
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
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

    try {
      const res = await fetch(
        `${API_BASE}/admin/location/${updateLocationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      await parseApiResponse(res);
      showNotification("success", "Location Updated");
      setUpdateLocationId("");
      setUpdateLocationName("");
      setUpdateLocationDescription("");
      setUpdateLatitude("");
      setUpdateLongitude("");
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleDeleteLocation = async () => {
    if (!deleteLocationId.trim()) {
      showNotification("info", "Please provide Location ID");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/admin/location/${deleteLocationId}`,
        {
          method: "DELETE",
        },
      );
      await parseApiResponse(res);
      showNotification("success", "Location Deleted");
      setDeleteLocationId("");
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleGetLocation = async () => {
    let url = "";
    if (searchLocationId)
      url = `${API_BASE}/admin/location/${searchLocationId}`;
    else if (searchLocationName) {
      url = `${API_BASE}/admin/location/name/${searchLocationName}`;
    } else if (searchLocationCityId) {
      url = `${API_BASE}/admin/location/city/${searchLocationCityId}`;
    } else {
      showNotification("info", "Enter Location ID, Name, or City ID");
      return;
    }

    try {
      const res = await fetch(url);
      const data = await parseApiResponse(res);
      if (Array.isArray(data)) {
        setFetchedLocationsByCity(data);
        setFetchedLocation(null);
      } else {
        setFetchedLocation(data);
        setFetchedLocationsByCity(null);
      }
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleGetAllLocations = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/locations`);
      const data = await parseApiResponse(res);
      const locationList = Array.isArray(data) ? data : [];
      setAllLocations(locationList);
      showNotification("success", `Fetched ${locationList.length} locations`);
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleAddImage = async () => {
    setImageInlineStatus(null);

    if (!imageFile) {
      showNotification("info", "Please select an image");
      setImageInlineStatus({
        type: "info",
        message: "Please select an image before uploading.",
      });
      return;
    }
    if (!imageLocationId.trim()) {
      showNotification("info", "Please provide Location ID");
      setImageInlineStatus({
        type: "info",
        message: "Please provide a valid Location ID.",
      });
      return;
    }

    setImageInlineStatus({ type: "info", message: "Uploading image..." });

    const formData = new FormData();
    formData.append("location_id", imageLocationId);
    formData.append("image", imageFile);

    try {
      const res = await fetch(`${API_BASE}/admin/image`, {
        method: "POST",
        body: formData,
      });
      await parseApiResponse(res);

      showNotification("success", "Image Added");
      setImageInlineStatus({
        type: "success",
        message: "Image uploaded successfully.",
      });
      setImageFile(null);
      setImageLocationId("");
      const fileInput = document.getElementById(
        "imageFileInput",
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      const message = (error as Error).message;
      showNotification("error", message);
      setImageInlineStatus({ type: "error", message });
    }
  };

  const handleUpdateImage = async () => {
    if (!updateImageId) {
      showNotification("info", "Please provide Image ID");
      return;
    }

    if (!updateImageFile) {
      showNotification("info", "Please provide a new image file to update");
      return;
    }

    const formData = new FormData();
    formData.append("image", updateImageFile);

    try {
      setImageInlineStatus({ type: "info", message: "Updating image..." });
      const res = await fetch(`${API_BASE}/admin/image/${updateImageId}`, {
        method: "PUT",
        body: formData,
      });
      await parseApiResponse(res);

      showNotification("success", "Image Updated");
      setImageInlineStatus({ type: "success", message: "Image updated." });
      setUpdateImageId("");
      setUpdateImageFile(null);
      const fileInput = document.getElementById(
        "updateImageFileInput",
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      const message = (error as Error).message;
      showNotification("error", message);
      setImageInlineStatus({ type: "error", message });
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteImageId.trim()) {
      showNotification("info", "Please provide Image ID");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/image/${deleteImageId}`, {
        method: "DELETE",
      });
      await parseApiResponse(res);
      showNotification("success", "Image Deleted");
      setDeleteImageId("");
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleGetImage = async () => {
    let url = "";
    if (searchImageId) url = `${API_BASE}/admin/image/${searchImageId}`;
    else if (searchImageLocationId) {
      url = `${API_BASE}/admin/image/location/${searchImageLocationId}`;
    } else {
      showNotification("info", "Enter Image ID or Location ID");
      return;
    }

    try {
      const res = await fetch(url);
      const data = await parseApiResponse(res);
      if (Array.isArray(data)) {
        setFetchedImages(data);
        setFetchedImage(null);
      } else {
        setFetchedImage(data);
        setFetchedImages(null);
      }
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleGetAllImages = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/images`);
      const data = await parseApiResponse(res);
      const imageList = Array.isArray(data) ? data : [];
      setAllImages(imageList);
      showNotification("success", `Fetched ${imageList.length} images`);
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  const handleGetReports = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/reports`);
      const data = await parseApiResponse(res);
      if (!Array.isArray(data)) {
        showNotification("error", "Failed to fetch user reports");
        return;
      }
      setReports(data);
      showNotification("success", `Loaded ${data.length} user reports`);
    } catch (error) {
      showNotification("error", (error as Error).message);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadReportsOnMount = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/reports`);
        const contentType = res.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        const data = isJson ? await res.json().catch(() => null) : null;

        if (!res.ok || !Array.isArray(data) || cancelled) {
          return;
        }

        setReports(data);
      } catch {
        // Ignore silent initial-load errors; manual refresh remains available.
      }
    };

    void loadReportsOnMount();

    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  const handleUpdateReportStatus = async (
    reportId: number,
    status: ReportStatus,
  ) => {
    const res = await fetch(`${API_BASE}/admin/reports/${reportId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      showNotification(
        "error",
        errorData.message || "Failed to update report status",
      );
      return;
    }

    setReports((prev) =>
      prev.map((report) =>
        report.report_id === reportId ? { ...report, status } : report,
      ),
    );
    showNotification("success", `Report #${reportId} marked ${status}`);
  };

  return {
    cityName,
    cityDescription,
    updateCityId,
    updateCityName,
    updateCityDescription,
    deleteCityId,
    searchCityId,
    searchCityName,
    fetchedCity,
    allCities,
    setCityName,
    setCityDescription,
    setUpdateCityId,
    setUpdateCityName,
    setUpdateCityDescription,
    setDeleteCityId,
    setSearchCityId,
    setSearchCityName,
    handleAddCity,
    handleUpdateCity,
    handleDeleteCity,
    handleGetCity,
    handleGetAllCities,

    locationName,
    locationDescription,
    locationCityId,
    latitude,
    longitude,
    updateLocationId,
    updateLocationName,
    updateLocationDescription,
    updateLatitude,
    updateLongitude,
    deleteLocationId,
    searchLocationId,
    searchLocationName,
    searchLocationCityId,
    fetchedLocation,
    fetchedLocationsByCity,
    allLocations,
    setLocationName,
    setLocationDescription,
    setLocationCityId,
    setLatitude,
    setLongitude,
    setUpdateLocationId,
    setUpdateLocationName,
    setUpdateLocationDescription,
    setUpdateLatitude,
    setUpdateLongitude,
    setDeleteLocationId,
    setSearchLocationId,
    setSearchLocationName,
    setSearchLocationCityId,
    handleAddLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    handleGetLocation,
    handleGetAllLocations,

    imageLocationId,
    imageFile,
    updateImageId,
    updateImageFile,
    deleteImageId,
    searchImageId,
    searchImageLocationId,
    fetchedImage,
    fetchedImages,
    allImages,
    imageInlineStatus,
    setImageLocationId,
    setImageFile,
    setUpdateImageId,
    setUpdateImageFile,
    setDeleteImageId,
    setSearchImageId,
    setSearchImageLocationId,
    handleAddImage,
    handleUpdateImage,
    handleDeleteImage,
    handleGetImage,
    handleGetAllImages,

    reports,
    handleGetReports,
    handleUpdateReportStatus,

    notification,
    setNotification,
  };
}

export type UseAdminPanelState = ReturnType<typeof useAdminPanel>;

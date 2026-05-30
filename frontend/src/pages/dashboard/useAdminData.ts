import { useEffect, useState } from "react";
import type {
  City,
  Cities,
  Location,
  Locations,
  Image,
  Images,
} from "../../components/dashboard/types";
import { API_URL } from "../../config/api";

export const useAdminData = () => {
  const [cities, setCities] = useState<Cities[]>([]);
  const [locations, setLocations] = useState<Locations[]>([]);
  const [images, setImages] = useState<Images[]>([]);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/cities`);
        const data: City[] = await response.json();
        const formatted: Cities[] = data.map((item) => ({
          id: item.city_id,
          name: item.city_name,
          description: item.description,
        }));
        setCities(formatted);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchCityData();
  }, []);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/locations`);
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
      } catch (error) {
        console.error(error);
      }
    };

    void fetchLocationData();
  }, []);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/images`);
        const data: Image[] = await response.json();
        const formatted: Images[] = data.map((item) => ({
          id: item.image_id,
          location_id: item.location_id,
          image_url: item.image_url,
        }));
        setImages(formatted);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchImageData();
  }, []);

  return { cities, locations, images };
};

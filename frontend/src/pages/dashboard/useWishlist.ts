import { useEffect, useState } from "react";
import type { WishlistItem } from "../../components/dashboard/types";
import { API_URL } from "../../config/api";

export const useWishlist = (userId?: number) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistCityIds, setWishlistCityIds] = useState<Set<number>>(
    new Set(),
  );
  const [wishlistLocationIds, setWishlistLocationIds] = useState<Set<number>>(
    new Set(),
  );

  const loadWishlist = async (uid: number) => {
    try {
      const response = await fetch(`${API_URL}/api/wishlist/${uid}`);
      if (!response.ok) return;
      const data: WishlistItem[] = await response.json();
      setWishlistItems(data);
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
    if (userId) void loadWishlist(userId);
  }, [userId]);

  const toggleCityWishlist = async (cityId: number, userId?: number) => {
    if (!userId) return;
    const isAlready = wishlistCityIds.has(cityId);
    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        method: isAlready ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, city_id: cityId }),
      });
      if (!response.ok) throw new Error("Wishlist update failed");
      setWishlistCityIds((prev) => {
        const updated = new Set(prev);
        if (updated.has(cityId)) updated.delete(cityId);
        else updated.add(cityId);
        return updated;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLocationWishlist = async (
    locationId: number,
    userId?: number,
  ) => {
    if (!userId) return;
    const isAlready = wishlistLocationIds.has(locationId);
    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        method: isAlready ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, location_id: locationId }),
      });
      if (!response.ok) throw new Error("Wishlist update failed");
      setWishlistLocationIds((prev) => {
        const updated = new Set(prev);
        if (updated.has(locationId)) updated.delete(locationId);
        else updated.add(locationId);
        return updated;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const removeCityFromWishlist = async (cityId: number, userId?: number) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, city_id: cityId }),
      });
      if (!response.ok) throw new Error("Failed to remove city from wishlist");
      await loadWishlist(userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const removeLocationFromWishlist = async (
    locationId: number,
    userId?: number,
  ) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, location_id: locationId }),
      });
      if (!response.ok)
        throw new Error("Failed to remove location from wishlist");
      await loadWishlist(userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    wishlistItems,
    wishlistCityIds,
    wishlistLocationIds,
    toggleCityWishlist,
    toggleLocationWishlist,
    removeCityFromWishlist,
    removeLocationFromWishlist,
    reload: () => {
      if (userId) void loadWishlist(userId);
    },
  };
};

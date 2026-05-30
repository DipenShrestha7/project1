import { useEffect, useState } from "react";
import type { HistoryItem, Review } from "../../components/dashboard/types";
import { API_URL } from "../../config/api";

export const useTravelHistory = (userId?: number) => {
  const [travelHistoryItems, setTravelHistoryItems] = useState<HistoryItem[]>(
    [],
  );
  const [travelHistoryLocationIds, setTravelHistoryLocationIds] = useState<
    Set<number>
  >(new Set());
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
  const [deletingReviewLocationId, setDeletingReviewLocationId] = useState<
    number | null
  >(null);
  const [deletingHistoryLocationId, setDeletingHistoryLocationId] = useState<
    number | null
  >(null);
  const [confirmDeleteReviewLocationId, setConfirmDeleteReviewLocationId] =
    useState<number | null>(null);
  const [locationReviews, setLocationReviews] = useState<Review[]>([]);

  const loadLocationReviews = async (locationId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/location/${locationId}/reviews`);
      if (!res.ok) return;
      const data = await res.json();
      setLocationReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const loadTravelHistory = async (uid: number) => {
    try {
      const response = await fetch(`${API_URL}/api/history/${uid}`);
      if (!response.ok) return;
      const data: HistoryItem[] = await response.json();
      const latestByLocationId = new Map<number, HistoryItem>();
      data.forEach((item) => {
        if (!latestByLocationId.has(item.location_id))
          latestByLocationId.set(item.location_id, item);
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
    if (userId) void loadTravelHistory(userId);
  }, [userId]);

  useEffect(() => {
    // keep location reviews reset when travelHistory changes
    if (travelHistoryItems.length === 0) setLocationReviews([]);
  }, [travelHistoryItems.length]);

  const toggleReviewSection = (locationId: number) => {
    const item = travelHistoryItems.find((e) => e.location_id === locationId);
    setExpandedReviewLocationIds((prev) => {
      const updated = new Set(prev);
      const isOpening = !updated.has(locationId);
      if (isOpening) updated.add(locationId);
      else updated.delete(locationId);
      return updated;
    });
    if (!expandedReviewLocationIds.has(locationId)) {
      setReviewTextDrafts((prev) => ({
        ...prev,
        [locationId]: item?.review_text ?? "",
      }));
      setRatingDrafts((prev) => ({ ...prev, [locationId]: item?.rating ?? 1 }));
    }
  };

  const saveReviewForLocation = async (
    userIdParam: number | undefined,
    locationId: number,
  ) => {
    if (!userIdParam) return;
    const review_text = reviewTextDrafts[locationId]?.trim() ?? "";
    const rating = ratingDrafts[locationId] ?? 1;
    setSavingReviewLocationId(locationId);
    try {
      const response = await fetch(`${API_URL}/api/history/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userIdParam,
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
      await loadLocationReviews(locationId);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingReviewLocationId(null);
    }
  };

  const initiateDeleteReview = (locationId: number) =>
    setConfirmDeleteReviewLocationId(locationId);

  const deleteReviewForLocation = async (
    userIdParam: number | undefined,
    locationId: number,
  ) => {
    if (!userIdParam) return;
    setDeletingReviewLocationId(locationId);
    setConfirmDeleteReviewLocationId(null);
    try {
      const response = await fetch(`${API_URL}/api/history/review`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userIdParam, location_id: locationId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete review");
      }
      const updated: HistoryItem = await response.json();
      setTravelHistoryItems((prev) =>
        prev.map((i) => (i.location_id === locationId ? updated : i)),
      );
      setReviewTextDrafts((prev) => {
        const next = { ...prev };
        delete next[locationId];
        return next;
      });
      setRatingDrafts((prev) => {
        const next = { ...prev };
        delete next[locationId];
        return next;
      });
      await loadLocationReviews(locationId);
      setExpandedReviewLocationIds((prev) => {
        const next = new Set(prev);
        next.delete(locationId);
        return next;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingReviewLocationId(null);
    }
  };

  const removeLocationFromTravelHistory = async (
    userIdParam: number | undefined,
    locationId: number,
  ) => {
    if (!userIdParam) return;
    setDeletingHistoryLocationId(locationId);
    try {
      const response = await fetch(`${API_URL}/api/history/visited`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userIdParam, location_id: locationId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Failed to remove from travel history",
        );
      }
      if (userIdParam) await loadTravelHistory(userIdParam);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setDeletingHistoryLocationId(null);
    }
  };

  return {
    travelHistoryItems,
    travelHistoryLocationIds,
    expandedReviewLocationIds,
    reviewTextDrafts,
    setReviewTextDrafts,
    ratingDrafts,
    setRatingDrafts,
    savingReviewLocationId,
    saveReviewForLocation,
    deleteReviewForLocation,
    initiateDeleteReview,
    deletingReviewLocationId,
    confirmDeleteReviewLocationId,
    setConfirmDeleteReviewLocationId,
    locationReviews,
    loadLocationReviews,
    loadTravelHistory,
    toggleReviewSection,
    removeLocationFromTravelHistory,
    deletingHistoryLocationId,
  };
};

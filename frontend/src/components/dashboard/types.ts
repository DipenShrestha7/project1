export type User = {
  id?: number;
  name?: string;
  email?: string;
  profile_image?: string | null;
};

export type WishlistItem = {
  wishlist_id: number;
  user_id: number;
  city_id: number | null;
  location_id: number | null;
  created_at: string;
};

export type City = {
  city_id: number;
  city_name: string;
  description: string;
  created_at: string;
};

export type Cities = {
  id: number;
  name?: string;
  description?: string;
};

export type Location = {
  location_id: number;
  location_name: string;
  description: string;
  city_id: number;
  created_at: string;
  latitude: number | string;
  longitude: number | string;
};

export type Locations = {
  id: number;
  name: string;
  description: string;
  city_id: number;
  latitude: number | string;
  longitude: number | string;
};

export type Image = {
  image_id: number;
  location_id: number;
  image_url: string;
  image_description: string;
};

export type Images = {
  id: number;
  location_id: number;
  image_url: string;
  image_description: string;
};

export type HistoryItem = {
  travel_id: number;
  user_id: number;
  location_id: number;
  travel_date: string;
  review_text: string | null;
  rating: number | null;
};

export type ActiveSection = "cities" | "chatbot" | "wishlist" | "travelHistory";

export type AccountStats = {
  wishlistCount: number;
  visitedCount: number;
  reviewCount: number;
  chatSessionsCount: number;
};

export type Review = {
  user_name: string;
  profile_image: string | null;
  rating: number | null;
  review_text: string;
  travel_date: string;
};

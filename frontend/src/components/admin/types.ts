export type City = {
  city_id: string;
  city_name: string;
  description: string;
};

export type Location = {
  location_id: string;
  location_name: string;
  description: string;
  city_id: string;
  city_name: string;
  latitude: number;
  longitude: number;
};

export type Image = {
  image_id: string;
  location_id: string;
  image_url: string;
};

export type UserReport = {
  report_id: number;
  user_id: number | null;
  type: "bug" | "feedback" | "feature_requests";
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
};

export type NotificationType = "success" | "error" | "info";

export type Notification = {
  type: NotificationType;
  message: string;
};

export type InlineStatus = {
  type: NotificationType;
  message: string;
};

export type ReportStatus = "open" | "in_progress" | "resolved" | "closed";

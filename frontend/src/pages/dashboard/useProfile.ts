import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AccountStats, User } from "../../components/dashboard/types";
import { API_URL, getImageUrl } from "../../config/api";

const getProfileImageSrc = (profileImage?: string | null) => {
  if (!profileImage) return null;
  return getImageUrl(profileImage);
};

export const useProfile = () => {
  const [user, setUser] = useState<User>();
  const [preview, setPreview] = useState<string | null>(null);
  const [accountStats, setAccountStats] = useState<AccountStats>({
    wishlistCount: 0,
    visitedCount: 0,
    reviewCount: 0,
    chatSessionsCount: 0,
  });
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const getJsonAuthHeaders = () => ({
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const data = await response.json();
        setUser(data);
        setPreview(getProfileImageSrc(data.profile_image));
      } catch (error) {
        console.error(error);
      }
    };

    void fetchDashboard();
  }, [navigate]);

  useEffect(() => {
    const loadAccountStats = async () => {
      if (!user?.id) {
        setAccountStats({
          wishlistCount: 0,
          visitedCount: 0,
          reviewCount: 0,
          chatSessionsCount: 0,
        });
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/dashboard/stats`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) return;
        const data: AccountStats = await response.json();
        setAccountStats(data);
      } catch (error) {
        console.error("Failed to load account stats:", error);
      }
    };

    void loadAccountStats();
  }, [user?.id]);

  const uploadProfileImage = async (file: File) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/dashboard/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload image");
      }
      await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSaveProfile = async (name: string, email: string) => {
    const response = await fetch(`${API_URL}/api/dashboard/profile`, {
      method: "PATCH",
      headers: getJsonAuthHeaders(),
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(data.message || "Failed to update profile");
    setUser((prev) => ({
      ...(prev ?? {}),
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      profile_image: data.user.profile_image,
    }));
  };

  const handleDeleteAccount = async () => {
    const response = await fetch(`${API_URL}/api/dashboard/account`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(data.message || "Failed to delete account");
    localStorage.removeItem("token");
    navigate("/ghumphir");
  };

  const handleSubmitReport = async (
    type: "bug" | "feedback" | "feature_requests",
    message: string,
  ) => {
    const response = await fetch(`${API_URL}/api/reports`, {
      method: "POST",
      headers: getJsonAuthHeaders(),
      body: JSON.stringify({ type, message }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(data.message || "Failed to submit report");
  };

  return {
    user,
    setUser,
    preview,
    uploadProfileImage,
    accountStats,
    handleSaveProfile,
    handleDeleteAccount,
    handleSubmitReport,
  };
};

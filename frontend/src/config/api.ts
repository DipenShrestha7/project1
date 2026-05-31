export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

const rewriteLocalBackendUrl = (value: string) => {
  if (!API_URL) return value;

  try {
    const parsed = new URL(value);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return `${API_URL}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return value;
  }

  return value;
};

export const getImageUrl = (path?: string | null) => {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return rewriteLocalBackendUrl(path);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_URL ? `${API_URL}${normalizedPath}` : normalizedPath;
};

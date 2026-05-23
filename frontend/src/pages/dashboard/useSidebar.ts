import { useEffect, useRef, useState } from "react";

export const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 768,
  );
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);
  const sidebarCloseTimeoutRef = useRef<number | null>(null);

  const openSidebar = () => {
    if (sidebarCloseTimeoutRef.current) {
      window.clearTimeout(sidebarCloseTimeoutRef.current);
      sidebarCloseTimeoutRef.current = null;
    }
    setIsSidebarClosing(false);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsSidebarClosing(true);
      setIsSidebarOpen(false);
      if (sidebarCloseTimeoutRef.current)
        window.clearTimeout(sidebarCloseTimeoutRef.current);
      sidebarCloseTimeoutRef.current = window.setTimeout(
        () => setIsSidebarClosing(false),
        300,
      );
      return;
    }
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    return () => {
      if (sidebarCloseTimeoutRef.current)
        window.clearTimeout(sidebarCloseTimeoutRef.current);
    };
  }, []);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) closeSidebar();
  };

  return {
    isSidebarOpen,
    isSidebarClosing,
    openSidebar,
    closeSidebar,
    closeSidebarOnMobile,
  };
};

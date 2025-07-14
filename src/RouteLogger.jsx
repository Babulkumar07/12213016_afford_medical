import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { logEvent } from "./utils/logger"; // ✅ use your logger

const RouteLogger = () => {
  const location = useLocation();

  useEffect(() => {
    logEvent(`Navigated to: ${location.pathname}`, "info", "frontend", "navigation");
  }, [location]);

  return null; // this component does not render anything
};

export default RouteLogger;

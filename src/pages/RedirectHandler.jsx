import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { logEvent } from "../utils/logger"; // ✅ Import logger

const RedirectHandler = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem("shortLinks")) || [];
    const match = links.find(link => link.shortcode === shortcode);

    if (match) {
      const now = new Date();
      const expiry = new Date(match.expiresAt);

      if (now > expiry) {
        alert("This link has expired.");
        logEvent(`Attempted redirect with expired shortcode: ${shortcode}`, "warn", "frontend", "redirect");
        return;
      }

      match.clicks = match.clicks || [];
      match.clicks.push({
        timestamp: now.toISOString(),
        source: "direct",
        location: "India", // fake location for now
      });

      const updatedLinks = links.map(link =>
        link.shortcode === shortcode ? match : link
      );
      localStorage.setItem("shortLinks", JSON.stringify(updatedLinks));

      // ✅ Log successful redirection
      logEvent(`Redirected user with shortcode: ${shortcode}`, "info", "frontend", "redirect");

      window.location.href = match.originalUrl;
    } else {
      alert("Shortcode not found.");
      logEvent(`Redirect failed: shortcode not found - ${shortcode}`, "error", "frontend", "redirect");
    }
  }, [shortcode]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;

export const logEvent = async (message, level = "info", stack = "frontend", logPackage = "user") => {
  try {
    await fetch("http://localhost:5000/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, logPackage, message }),
    });
    console.log("✅ Log sent from React:", message);
  } catch (error) {
    console.error("❌ Logging failed:", error);
  }
};

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeNotifications } from "./hooks/useSettings";

// Initialize Capacitor notifications
initializeNotifications();

createRoot(document.getElementById("root")!).render(<App />);

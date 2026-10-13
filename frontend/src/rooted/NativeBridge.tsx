import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../store/calendar";
import { isNative, onNotificationTap, scheduleEventNotifications } from "./native";

/**
 * Mount once inside the router. In the native app it keeps local notifications
 * in step with the active profile's calendar and opens the right screen when a
 * notification is tapped. Renders nothing; does nothing on the web.
 */
export function NativeBridge(): null {
  const navigate = useNavigate();
  const events = useEvents(); // follows the active profile

  useEffect(() => {
    if (!isNative()) return;
    const id = setTimeout(() => void scheduleEventNotifications(events), 1000);
    return () => clearTimeout(id);
  }, [events]);

  useEffect(() => onNotificationTap((to) => navigate(to)), [navigate]);

  return null;
}

export default NativeBridge;

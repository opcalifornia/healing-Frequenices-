import type { CapacitorConfig } from "@capacitor/cli";

// Native iPhone app shell (see docs/PHASE_NATIVE_APP.md).
// appId is a placeholder bundle id: it can change freely until the first
// App Store Connect upload, after which it is permanent.
const config: CapacitorConfig = {
  appId: "app.rooted.health",
  appName: "Rooted",
  webDir: "dist",
  backgroundColor: "#0b0d0a",
  ios: {
    contentInset: "always",
    backgroundColor: "#0b0d0a",
  },
  plugins: {
    LocalNotifications: {
      iconColor: "#9cc59a",
    },
  },
};

export default config;

import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { useUser } from "./store/user";
import { useCatalogStore } from "./store/catalog";
import { MiniPlayer } from "./components/MiniPlayer";
import { SafetyNotice } from "./components/SafetyNotice";
import { useMediaSession } from "./hooks/useMediaSession";
import { usePlayer } from "./store/player";
import { HoverPreview } from "./components/HoverPreview";
import { BedtimeToast, useBedtimeReminder } from "./components/Bedtime";
import Hub from "./pages/Hub";
import { startSync } from "./rooted/sync";
import { apiEnabled } from "./api/client";
import { CrisisSheet } from "./rooted/Crisis";
import { FeedbackSheet } from "./rooted/FeedbackSheet";
import { GaiaButton } from "./rooted/Gaia";
import Profiles from "./pages/Profiles";

const Home = lazy(() => import("./pages/Home"));
const PlayerOverlay = lazy(() => import("./components/PlayerOverlay").then((m) => ({ default: m.PlayerOverlay })));
// Native-only code (notifications, haptics) loads only inside the iPhone app.
const NativeBridge = lazy(() => import("./rooted/NativeBridge"));
const isNativeShell = () => !!(window as unknown as { Capacitor?: { isNativePlatform?(): boolean } }).Capacitor?.isNativePlatform?.();
const Frequencies = lazy(() => import("./pages/Frequencies"));
const Shows = lazy(() => import("./pages/Shows"));
const Learn = lazy(() => import("./pages/Learn"));
const Article = lazy(() => import("./pages/Article"));
const MyStuff = lazy(() => import("./pages/MyStuff"));
const TitleDetail = lazy(() => import("./pages/TitleDetail"));
const Search = lazy(() => import("./pages/Search"));
const Build = lazy(() => import("./pages/Build"));
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Collection = lazy(() => import("./pages/Collection"));
const BrainGuide = lazy(() => import("./pages/BrainGuide"));
const Bedtime = lazy(() => import("./pages/Bedtime"));
const SleepGuide = lazy(() => import("./pages/SleepGuide"));
const SafetyGuide = lazy(() => import("./pages/SafetyGuide"));
const Nourish = lazy(() => import("./pages/Nourish"));
const Scan = lazy(() => import("./pages/Scan"));
const Breathe = lazy(() => import("./pages/Breathe"));
const Move = lazy(() => import("./pages/Move"));
const Welcome = lazy(() => import("./pages/Welcome"));
const Combos = lazy(() => import("./pages/Combos"));
const Support = lazy(() => import("./pages/Support"));
const Spirit = lazy(() => import("./pages/Spirit"));
const Garden = lazy(() => import("./pages/Garden"));
const Light = lazy(() => import("./pages/Light"));
const Nutrients = lazy(() => import("./pages/Nutrients"));
const AnimalProducts = lazy(() => import("./pages/AnimalProducts"));
const Program = lazy(() => import("./pages/Program"));
const YourData = lazy(() => import("./pages/YourData"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Places = lazy(() => import("./pages/Places"));
const Earth = lazy(() => import("./pages/Earth"));
import { track } from "./rooted/metrics";
import { UnlockNotice } from "./rooted/UnlockNotice";
import { markVisited, untrackedMatches } from "./rooted/features";
const Journey = lazy(() => import("./pages/Journey"));
const Guide = lazy(() => import("./pages/Guide"));
const FirstWin = lazy(() => import("./pages/FirstWin"));
const Join = lazy(() => import("./pages/Join"));
const Week = lazy(() => import("./pages/Week"));
const Legal = lazy(() => import("./pages/Legal"));

function RequireProfile({ children }: { children: JSX.Element }) {
  const active = useUser((s) => s.activeProfileId);
  const location = useLocation();
  if (!active) return <Navigate to="/profiles" replace state={{ from: location.pathname }} />;
  return children;
}

export default function App() {
  const location = useLocation();
  useEffect(() => track("app_open"), []);
  const loadCatalog = useCatalogStore((s) => s.load);
  const refresh = useUser((s) => s.refreshFromServer);
  const hasTrack = usePlayer((s) => s.current !== null);
  const onPicker = location.pathname === "/profiles" || location.pathname === "/account" || location.pathname === "/start";
  const token = useUser((s) => s.token);
  const activeProfile = useUser((s) => s.activeProfileId);
  useEffect(() => {
    if (!apiEnabled || !token || !activeProfile) return;
    return startSync(activeProfile);
  }, [token, activeProfile]);
  useMediaSession();
  useBedtimeReminder();

  useEffect(() => {
    loadCatalog();
    refresh();
  }, [loadCatalog, refresh]);

  // Opening a tool that leaves no data behind counts it as tried in the Guide.
  useEffect(() => {
    if (!activeProfile) return;
    for (const id of untrackedMatches(location.pathname, location.hash)) markVisited(id);
  }, [location.pathname, location.hash, activeProfile]);

  // New page: start at the top, or at the #section the link points to once it has drawn.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 30) {
        clearInterval(timer);
        if (!el) return;
        const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }
    }, 100);
    return () => clearInterval(timer);
  }, [location.pathname, location.hash]);

  // The mini player reserves space at the bottom of every page.
  useEffect(() => {
    document.documentElement.style.setProperty("--mini-h", hasTrack ? "72px" : "0px");
  }, [hasTrack]);

  return (
    <>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          // Works with both browser and hash routing.
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      {!onPicker && <NavBar />}
      {isNativeShell() && <Suspense fallback={null}><NativeBridge /></Suspense>}
      <Suspense fallback={<div className="page" />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/join" element={<Join />} />
            <Route path="/privacy" element={<Legal />} />
            <Route path="/terms" element={<Legal />} />
            <Route path="/disclaimer" element={<Legal />} />
            <Route path="/account" element={<Account />} />
            <Route path="/" element={<RequireProfile><Hub /></RequireProfile>} />
            <Route path="/healing" element={<RequireProfile><Home /></RequireProfile>} />
            <Route path="/nourish" element={<RequireProfile><Nourish /></RequireProfile>} />
            <Route path="/scan" element={<RequireProfile><Scan /></RequireProfile>} />
            <Route path="/breathe" element={<RequireProfile><Breathe /></RequireProfile>} />
            <Route path="/move" element={<RequireProfile><Move /></RequireProfile>} />
            <Route path="/places" element={<RequireProfile><Places /></RequireProfile>} />
            <Route path="/earth" element={<RequireProfile><Earth /></RequireProfile>} />
            <Route path="/journey" element={<RequireProfile><Journey /></RequireProfile>} />
            <Route path="/guide" element={<RequireProfile><Guide /></RequireProfile>} />
            <Route path="/start" element={<RequireProfile><FirstWin /></RequireProfile>} />
            <Route path="/week" element={<RequireProfile><Week /></RequireProfile>} />
            <Route path="/calendar" element={<RequireProfile><Calendar /></RequireProfile>} />
            <Route path="/your-data" element={<RequireProfile><YourData /></RequireProfile>} />
            <Route path="/program/:id" element={<RequireProfile><Program /></RequireProfile>} />
            <Route path="/nutrients" element={<RequireProfile><Nutrients /></RequireProfile>} />
            <Route path="/animal-products" element={<RequireProfile><AnimalProducts /></RequireProfile>} />
            <Route path="/light" element={<RequireProfile><Light /></RequireProfile>} />
            <Route path="/garden" element={<RequireProfile><Garden /></RequireProfile>} />
            <Route path="/spirit" element={<RequireProfile><Spirit /></RequireProfile>} />
            <Route path="/support" element={<RequireProfile><Support /></RequireProfile>} />
            <Route path="/combos" element={<RequireProfile><Combos /></RequireProfile>} />
            <Route path="/welcome" element={<RequireProfile><Welcome /></RequireProfile>} />
            <Route path="/about-you" element={<RequireProfile><Welcome /></RequireProfile>} />
            <Route path="/frequencies" element={<RequireProfile><Frequencies /></RequireProfile>} />
            <Route path="/shows" element={<RequireProfile><Shows /></RequireProfile>} />
            <Route path="/learn" element={<RequireProfile><Learn /></RequireProfile>} />
            <Route path="/learn/safety" element={<RequireProfile><SafetyGuide /></RequireProfile>} />
            <Route path="/learn/sleep" element={<RequireProfile><SleepGuide /></RequireProfile>} />
            <Route path="/bedtime" element={<RequireProfile><Bedtime /></RequireProfile>} />
            <Route path="/learn/brain" element={<RequireProfile><BrainGuide /></RequireProfile>} />
            <Route path="/learn/:slug" element={<RequireProfile><Article /></RequireProfile>} />
            <Route path="/my-stuff" element={<RequireProfile><MyStuff /></RequireProfile>} />
            <Route path="/title/:id" element={<RequireProfile><TitleDetail /></RequireProfile>} />
            <Route path="/collection/:sectionId/:railId" element={<RequireProfile><Collection /></RequireProfile>} />
            <Route path="/search" element={<RequireProfile><Search /></RequireProfile>} />
            <Route path="/build" element={<RequireProfile><Build /></RequireProfile>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      {!onPicker && <MiniPlayer />}
      <HoverPreview />
      <PlayerGate />
      {!onPicker && activeProfile && <UnlockNotice />}
      <SafetyNotice />
      <CrisisSheet />
      <FeedbackSheet />
      {!onPicker && activeProfile && <GaiaButton />}
      {!onPicker && <BedtimeToast />}
    </>
  );
}

/** The full-screen player loads the first time something is expanded. */
function PlayerGate() {
  const open = usePlayer((s) => s.expanded && !!s.current);
  const [seen, setSeen] = useState(false);
  useEffect(() => { if (open) setSeen(true); }, [open]);
  if (!seen && !open) return null;
  return <Suspense fallback={null}><PlayerOverlay /></Suspense>;
}

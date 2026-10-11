import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { RootedLogo } from "./RootedLogo";
import { APP_NAME, HF_NAME } from "../brand";
import { inHealing } from "../rooted/sections";
import { HelpButton } from "../rooted/Crisis";
import { Icon, type IconName } from "./Icon";
import { Avatar } from "./Avatar";
import { useActiveProfile, useUser } from "../store/user";
import { apiEnabled } from "../api/client";
import "./NavBar.css";

export const NAV_ITEMS: { to: string; label: string; icon: IconName }[] = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/healing", label: "Healing", icon: "wave" },
  { to: "/light", label: "Light", icon: "sparkle" },
  { to: "/breathe", label: "Breathe", icon: "timer" },
  { to: "/nourish", label: "Nourish", icon: "sparkle" },
  { to: "/move", label: "Move", icon: "replay" },
  { to: "/combos", label: "Combos", icon: "sparkle" },
  { to: "/calendar", label: "Calendar", icon: "calendar" },
  { to: "/learn", label: "Learn", icon: "book" },
  { to: "/my-stuff", label: "My Stuff", icon: "bookmark" },
];

/** Sub-navigation inside the Healing Frequencies section. */
export const HEALING_ITEMS = [
  { to: "/healing", label: "Home" },
  { to: "/frequencies", label: "Frequencies" },
  { to: "/shows", label: "Shows" },
  { to: "/bedtime", label: "Bedtime" },
  { to: "/build", label: "Build Your Own" },
];

function HealingNav() {
  return (
    <motion.nav
      className="hnav"
      aria-label={HF_NAME}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <Link to="/healing" className="hnav__brand" aria-label={`${HF_NAME} home`}><Logo /></Link>
      <div className="hnav__links">
        {HEALING_ITEMS.map((i) => (
          <NavLink key={i.to} to={i.to} className="hnav__link">{i.label}</NavLink>
        ))}
      </div>
    </motion.nav>
  );
}

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = useActiveProfile();
  const profiles = useUser((s) => s.profiles);
  const selectProfile = useUser((s) => s.selectProfile);
  const account = useUser((s) => s.account);
  const signOut = useUser((s) => s.signOut);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const healing = inHealing(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
        <Link to="/" className="nav__logo" aria-label={`${APP_NAME} home`}>
          <RootedLogo />
        </Link>
        <nav className="nav__links" aria-label="Primary">
          {NAV_ITEMS.filter((i) => i.to !== "/my-stuff").map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `nav__link ${isActive || (item.to === "/healing" && healing) ? "active" : ""}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav__right">
          <HelpButton />
          <NavLink to="/search" className="nav__icon" aria-label="Search">
            <Icon name="search" />
          </NavLink>
          <div className="nav__profile" ref={menuRef}>
            <button
              className="nav__avatar"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={profile ? `Profile: ${profile.name}` : "Choose profile"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {profile ? <Avatar profile={profile} size={34} /> : <Icon name="user" />}
              <Icon name="chevronDown" size={16} className={`nav__caret ${menuOpen ? "is-open" : ""}`} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="nav__menu"
                  role="menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {profiles
                    .filter((p) => p.id !== profile?.id)
                    .map((p) => (
                      <button key={p.id} role="menuitem" className="nav__menu-item" onClick={() => selectProfile(p.id)}>
                        <Avatar profile={p} size={28} /> {p.name}
                      </button>
                    ))}
                  <button role="menuitem" className="nav__menu-item" onClick={() => navigate("/profiles")}>
                    <Icon name="edit" size={20} /> Manage Profiles
                  </button>
                  <div className="nav__menu-sep" />
                  <Link role="menuitem" className="nav__menu-item" to="/calendar">
                    <Icon name="calendar" size={20} /> Health calendar
                  </Link>
                  <Link role="menuitem" className="nav__menu-item" to="/move">
                    <Icon name="replay" size={20} /> Move
                  </Link>
                  <Link role="menuitem" className="nav__menu-item" to="/support">
                    <Icon name="heart" size={20} /> Support &amp; crisis lines
                  </Link>
                  <Link role="menuitem" className="nav__menu-item" to="/about-you">
                    <Icon name="user" size={20} /> About you &amp; goals
                  </Link>
                  <Link role="menuitem" className="nav__menu-item" to="/your-data">
                    <Icon name="bookmark" size={20} /> Your data
                  </Link>
                  <Link role="menuitem" className="nav__menu-item" to="/my-stuff">
                    <Icon name="bookmark" size={20} /> My Stuff
                  </Link>
                  <Link role="menuitem" className="nav__menu-item" to="/bedtime">
                    <Icon name="timer" size={20} /> Bedtime routine
                  </Link>
                  <Link role="menuitem" className="nav__menu-item" to="/build">
                    <Icon name="sliders" size={20} /> Build Your Own
                  </Link>
                  {apiEnabled &&
                    (account ? (
                      <button role="menuitem" className="nav__menu-item" onClick={signOut}>
                        <Icon name="user" size={20} /> Sign out ({account.email})
                      </button>
                    ) : (
                      <Link role="menuitem" className="nav__menu-item" to="/account">
                        <Icon name="user" size={20} /> Sign in
                      </Link>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      <AnimatePresence>{healing && <HealingNav />}</AnimatePresence>

      <nav className="tabbar" aria-label="Primary">
        {NAV_ITEMS.filter((i) => !["/learn", "/my-stuff", "/combos", "/light", "/move"].includes(i.to)).map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `tabbar__item ${isActive || (item.to === "/healing" && healing) ? "active" : ""}`}>
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

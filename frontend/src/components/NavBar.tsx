import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { Icon, type IconName } from "./Icon";
import { Avatar } from "./Avatar";
import { useActiveProfile, useUser } from "../store/user";
import { apiEnabled } from "../api/client";
import "./NavBar.css";

export const NAV_ITEMS: { to: string; label: string; icon: IconName }[] = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/frequencies", label: "Frequencies", icon: "wave" },
  { to: "/shows", label: "Shows", icon: "tv" },
  { to: "/learn", label: "Learn", icon: "book" },
  { to: "/my-stuff", label: "My Stuff", icon: "bookmark" },
];

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
        <Link to="/" className="nav__logo" aria-label="Healing Frequencies home">
          <Logo />
        </Link>
        <nav className="nav__links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className="nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav__right">
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

      <nav className="tabbar" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className="tabbar__item">
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

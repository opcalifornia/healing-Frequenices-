import { APP_NAME } from "../brand";
import { Link, useLocation } from "react-router-dom";
import { RootedLogo } from "./RootedLogo";
import { inHealing } from "../rooted/sections";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import "./Footer.css";

export function SafetyList() {
  return (
    <ul className="safety-list">
      <li><Icon name="headphones" size={18} /> Headphones are required for binaural beats.</li>
      <li><Icon name="volume" size={18} /> Keep the volume low and comfortable.</li>
      <li><Icon name="close" size={18} /> Do not listen while driving or operating machinery.</li>
      <li><Icon name="info" size={18} /> If you have epilepsy or a seizure disorder, check with a doctor before listening.</li>
    </ul>
  );
}

export function Footer() {
  const healing = inHealing(useLocation().pathname);
  if (!healing) {
    return (
      <footer className="footer">
        <div className="footer__top">
          <RootedLogo />
          <nav className="footer__links" aria-label="Footer">
            <Link to="/learn">Learn</Link>
            <Link to="/learn/safety">Frequencies &amp; your health</Link>
            <Link to="/about-you">About you &amp; goals</Link>
            <Link to="/healing">Healing Frequencies</Link>
          </nav>
        </div>
        <p className="footer__fine">
          {APP_NAME} shares general wellness information based on published research, with the strength of evidence shown. It is not medical advice and
          is not a substitute for care from a qualified professional. Talk to your doctor before making changes if you have a health condition, are
          pregnant, or take medicine. In a crisis in the US, call or text 988.
        </p>
        <p className="footer__fine">© {new Date().getFullYear()} {APP_NAME}. Your goals, lists and reflections are stored on this device.</p>
      </footer>
    );
  }
  return (
    <footer className="footer">
      <div className="footer__top">
        <Logo />
        <nav className="footer__links" aria-label="Footer">
          <Link to="/learn">How it works</Link>
          <Link to="/learn/what-the-research-says">Research</Link>
          <Link to="/learn/listening-safely">Listening safely</Link>
          <Link to="/build">Build Your Own</Link>
        </nav>
      </div>
      <SafetyList />
      <p className="footer__fine">
        Healing Frequencies sessions may support relaxation, focus, or sleep. They are not medical treatment and are not
        intended to diagnose, treat, cure, or prevent any condition. Research on binaural beats is mixed.
      </p>
      <p className="footer__fine">© {new Date().getFullYear()} {APP_NAME}. All audio and artwork are generated live in your browser.</p>
    </footer>
  );
}

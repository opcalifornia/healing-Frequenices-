import { Link } from "react-router-dom";
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
      <p className="footer__fine">© {new Date().getFullYear()} Healing Frequencies. All audio and artwork are generated live in your browser.</p>
    </footer>
  );
}

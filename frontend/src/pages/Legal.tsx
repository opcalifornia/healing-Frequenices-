import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, ZoomPage } from "../rooted/motion";
import { Footer } from "../components/Footer";
import { APP_NAME } from "../brand";
import "../rooted/rooted.css";
import "./Legal.css";

/**
 * Privacy policy, terms and health disclaimer. These are plain-language
 * drafts written to match how the app actually works today. They must be
 * reviewed by a lawyer before public launch (see docs/LAUNCH.md).
 */

const UPDATED = "October 2026";
const CONTACT = "privacy@rooted.app"; // Replace with the real support address before launch.

type Doc = "privacy" | "terms" | "disclaimer";
const TITLES: Record<Doc, string> = { privacy: "Privacy policy", terms: "Terms of use", disclaimer: "Health disclaimer" };

export default function Legal() {
  const path = useLocation().pathname;
  const doc: Doc = path.includes("terms") ? "terms" : path.includes("disclaimer") ? "disclaimer" : "privacy";
  return (
    <ZoomPage className="rooted legal">
      <header className="sec-hero legal__hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{APP_NAME} · Legal</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>{TITLES[doc]}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Plain language. Last updated {UPDATED}.</motion.p>
        </div>
      </header>
      <nav className="legal__tabs" aria-label="Legal documents">
        {(Object.keys(TITLES) as Doc[]).map((d) => (
          <Link key={d} to={`/${d}`} className={d === doc ? "is-on" : ""} aria-current={d === doc ? "page" : undefined}>{TITLES[d]}</Link>
        ))}
      </nav>
      <article className="sec-block legal__body">
        <p className="legal__draft">Draft for legal review. This text describes how {APP_NAME} works today and will be finalized before public launch.</p>
        {doc === "privacy" && <Privacy />}
        {doc === "terms" && <Terms />}
        {doc === "disclaimer" && <Disclaimer />}
      </article>
      <Footer />
    </ZoomPage>
  );
}

function Privacy() {
  return (
    <>
      <h2>The short version</h2>
      <ul>
        <li>Your wellness data is yours. We never sell it, and we never use it for advertising.</li>
        <li>Without an account, everything stays on your device.</li>
        <li>With an account, we store your data so it follows you across devices. You can download or delete it any time.</li>
        <li>Private notes (journal, safety plan, mood check-ins) only leave your device if you turn on private backup.</li>
        <li>A work calendar you import stays on your device and is never uploaded.</li>
      </ul>

      <h2>What we collect</h2>
      <h3>Without an account</h3>
      <p>Nothing about you is sent to us. Your profiles, goals, health considerations, shopping list, practice log, calendar and notes are saved in your browser or app storage on your device.</p>
      <h3>With an account</h3>
      <ul>
        <li><strong>Account details:</strong> your email address and a securely hashed password.</li>
        <li><strong>Profiles:</strong> names and colors you choose.</li>
        <li><strong>Wellness data you create:</strong> goals and health considerations, shopping list and water, practice log and check-ins, program progress, garden, bedtime routine, health calendar events, pledges and good deeds, and listening history.</li>
        <li><strong>Private data, only if you opt in:</strong> journal entries, your safety plan and mood check-ins.</li>
      </ul>
      <h3>What we do not collect</h3>
      <ul>
        <li>Your location. The store finder uses it only to open a map on your device; it is never saved or sent to us.</li>
        <li>Camera images. The heart check processes the camera on your device and keeps only the result.</li>
        <li>Your imported work calendar.</li>
        <li>Advertising identifiers. There are no ad trackers in {APP_NAME}.</li>
      </ul>
      <h3>Anonymous usage counts</h3>
      <p>To learn which parts of {APP_NAME} help people, the app adds one to a daily total when a feature is used, such as "finished a first session" or "opened the app today". Each count is a feature name from a fixed list and, for opening the app, a rough "days since first opened on this device" range (same day, next day, 2 to 6, 7 to 29, or 30 or more days).</p>
      <p>Counts are never linked to you or your account: no name, email, profile or device ID, and your IP address is used only to stop abuse and is not stored. They never include health data, moods, notes, goals or anything you type. You can turn them off on <Link to="/your-data">Your data</Link>, and they start off if your browser sends Do Not Track or Global Privacy Control.</p>

      <h3>Product scans</h3>
      <p>When you scan or type a barcode, the app asks Open Food Facts, an open food database, for that product. The barcode number is sent, along with your IP address as with any web request. Nothing else is sent: not your name, profile, health considerations or anything else in the app. To suggest better choices, it also asks for popular products in the same category, which sends only a category name. Camera images stay on your device and are only used to read the barcode, and your recent scans are saved on your device only.</p>

      <h3>Feedback you send</h3>
      <p>If you use "Send feedback", we receive what you type, the type of note you chose, and the screen you were on. We store nothing that identifies your account, profile or device. A way to reply is stored only if you choose to type one. Please don't include health details or passwords in a note.</p>

      <h2>How we use it</h2>
      <p>Only to run the app for you: syncing across your devices, building your daily plan, and serving your calendar link if you create one. We do not share your data with third parties except the service providers that host the app (hosting and database), under contracts that limit them to that purpose.</p>

      <h2>Calendar links</h2>
      <p>If you create a live calendar link, anyone who has that link can see the health events on it. You can make a new link at any time, which turns the old one off.</p>

      <h2>Your choices and rights</h2>
      <ul>
        <li><strong>See and download:</strong> the <Link to="/your-data">Your data</Link> page shows what is kept and lets you download it.</li>
        <li><strong>Delete:</strong> delete data from this device or from your account on the same page. Deleting your account removes everything stored with it.</li>
        <li><strong>Private backup:</strong> on or off, your choice, any time.</li>
      </ul>
      <p>Depending on where you live (for example California, Washington, the EU or the UK), you may have additional rights, including the right to know, correct and delete your data, and to withdraw consent. Contact us to use them.</p>

      <h2>Health data laws</h2>
      <p>{APP_NAME} is a consumer wellness app, not a healthcare provider, so HIPAA generally does not apply. We follow the FTC Health Breach Notification Rule and consumer health data laws such as Washington's My Health My Data Act: we collect only what the app needs, ask before collecting sensitive data, and tell you promptly if a breach ever affects you.</p>

      <h2>Children</h2>
      <p>{APP_NAME} is meant for adults. Kids' profiles may be created by a parent or guardian on the parent's account. We do not knowingly collect data from children under 13 without a parent.</p>

      <h2>Security</h2>
      <p>Data is encrypted in transit, passwords are hashed, and access to our database is restricted. No system is perfect; if something goes wrong, we will tell you.</p>

      <h2>Contact</h2>
      <p>Questions or requests: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
    </>
  );
}

function Terms() {
  return (
    <>
      <h2>Using {APP_NAME}</h2>
      <p>{APP_NAME} offers wellness education and tools: breathing, movement, food, sound, light, rituals, programs and a health calendar. By using it, you agree to these terms.</p>

      <h2>Not medical care</h2>
      <p>{APP_NAME} is for general wellness and education. It does not diagnose, treat, cure or prevent any disease, and it is not a substitute for a doctor, therapist or other licensed professional. Read the <Link to="/disclaimer">health disclaimer</Link>.</p>

      <h2>Your account</h2>
      <ul>
        <li>Keep your password private. You are responsible for activity on your account.</li>
        <li>You must be 18 or older to create an account, or have a parent or guardian create a profile for you.</li>
        <li>You can delete your account at any time from <Link to="/your-data">Your data</Link>.</li>
      </ul>

      <h2>Your content</h2>
      <p>Your notes, lists, plans and calendar are yours. You give us permission to store and process them only to run the app for you.</p>

      <h2>Fair use</h2>
      <p>Do not misuse the service: no attempts to break in, overload it, scrape it, or use it to harm others.</p>

      <h2>Professional programs</h2>
      <p>Some programs may be created by outside professionals. They are educational. Any individual care you arrange with a professional is between you and them.</p>

      <h2>Links to other sites</h2>
      <p>We link to nonprofits, research, maps and stores. We do not control those sites and are not responsible for them.</p>

      <h2>Subscriptions</h2>
      <p>If paid features are offered, prices, renewal and cancellation terms will be shown before you pay, and you can cancel any time.</p>

      <h2>No warranty and limits</h2>
      <p>{APP_NAME} is provided "as is". To the extent the law allows, we are not liable for indirect or consequential losses arising from use of the app. Nothing in these terms limits rights you have under consumer protection law.</p>

      <h2>Changes</h2>
      <p>If we change these terms in a meaningful way, we will tell you in the app before the change takes effect.</p>

      <h2>Contact</h2>
      <p><a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
    </>
  );
}

function Disclaimer() {
  return (
    <>
      <div className="legal__crisis">
        <strong>In crisis or thinking about suicide?</strong> In the US, call or text <a href="tel:988">988</a> any time. If you are in immediate danger, call <a href="tel:911">911</a>. <Link to="/support">More lines and support</Link>.
      </div>
      <h2>Education, not medical advice</h2>
      <p>Everything in {APP_NAME} is general information based on published research, with the strength of evidence shown. It is not medical advice and is not tailored to your medical situation.</p>

      <h2>Talk to a professional first if you</h2>
      <ul>
        <li>are pregnant or breastfeeding</li>
        <li>have a heart condition, high or low blood pressure, epilepsy or a seizure disorder, diabetes, or a breathing condition</li>
        <li>take medicines, especially blood thinners, blood pressure or diabetes medicines, antidepressants, or sedatives</li>
        <li>have, or have had, an eating disorder</li>
        <li>have an injury, recent surgery or limited mobility</li>
      </ul>
      <p>{APP_NAME} uses the health considerations you share to hide or flag practices that may not suit you, but this cannot replace individual advice.</p>

      <h2>Stop and get help if</h2>
      <p>you feel dizzy, faint, short of breath, chest pain, numbness, or unusual pain during any practice. Stop right away. Get emergency help for chest pain or trouble breathing.</p>

      <h2>Herbs, foods and supplements</h2>
      <p>{APP_NAME} never gives supplement or herb doses. Natural does not always mean safe: herbs can interact with medicines. Ask a pharmacist or doctor before starting any herb or supplement.</p>

      <h2>Sound and light</h2>
      <p>Keep volume low. Do not listen to binaural beats while driving or operating machinery. If you have epilepsy or photosensitivity, check with a doctor before using sound or light sessions.</p>

      <h2>Heart check</h2>
      <p>The camera heart rate and HRV check is an estimate for wellness use only. It is not a medical device and must not be used to diagnose or monitor a condition.</p>

      <h2>Evidence labels</h2>
      <p>Labels like "Strong", "Moderate", "Mixed" and "Early" describe the research behind a claim, not a promise of results. Many traditional practices are shared for their cultural value and are labeled as tradition.</p>
    </>
  );
}

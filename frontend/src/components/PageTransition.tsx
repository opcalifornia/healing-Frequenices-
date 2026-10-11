import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Route-level fade, matching the reference's quick cross-fade between pages. */
export function PageTransition({ children, padded = false }: { children: ReactNode; padded?: boolean }) {
  return (
    <motion.main
      id="main"
      tabIndex={-1}
      className={`page ${padded ? "page--padded" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.main>
  );
}

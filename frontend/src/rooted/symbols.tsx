import type { ReactNode } from "react";

/**
 * Healing symbols for profile pictures. Simple line drawings on a 100x100
 * canvas, drawn to sit on the Rooted gradient. The ids are stored on the
 * profile, so never rename or reuse one.
 */

export interface Symbol {
  id: string;
  label: string;
  art: ReactNode;
}

const S = { fill: "none", stroke: "#fff", strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const SYMBOLS: Symbol[] = [
  { id: "crystal", label: "Crystal", art: (<g {...S}><path d="M50 16 70 36 62 78H38L30 36Z" /><path d="M30 36h40M42 36 50 16 58 36M42 36l-4 42M58 36l4 42" strokeWidth={3} opacity={0.75} /></g>) },
  { id: "tree", label: "Tree", art: (<g {...S}><path d="M50 82V52" /><path d="M50 56c-14 0-22-9-22-20 0-9 7-17 15-17 3-6 12-6 15 0 8 0 14 8 14 17 0 11-8 20-22 20Z" /><path d="M50 66 40 58M50 62l9-8" strokeWidth={3} /></g>) },
  { id: "wave", label: "Ocean wave", art: (<g {...S}><path d="M14 58c8-14 20-18 30-10s20 6 30-8" /><path d="M14 72c8-8 18-10 28-4s20 4 30-4" opacity={0.8} /><path d="M28 40c4-12 18-16 30-8" opacity={0.65} strokeWidth={3} /></g>) },
  { id: "lotus", label: "Lotus", art: (<g {...S}><path d="M50 24c-10 10-10 30 0 42 10-12 10-32 0-42Z" /><path d="M50 66C36 62 24 50 22 36c14 0 24 8 28 20M50 66c14-4 26-16 28-30-14 0-24 8-28 20" opacity={0.85} /><path d="M24 74h52" opacity={0.6} strokeWidth={3} /></g>) },
  { id: "moon", label: "Moon", art: (<g {...S}><path d="M62 20C42 22 30 38 34 58s24 28 42 20C56 76 46 58 52 42c3-9 6-16 10-22Z" /><circle cx="70" cy="34" r="2" fill="#fff" /><circle cx="78" cy="50" r="1.5" fill="#fff" /></g>) },
  { id: "sun", label: "Sun", art: (<g {...S}><circle cx="50" cy="50" r="16" /><path d="M50 18v8M50 74v8M18 50h8M74 50h8M27 27l6 6M67 67l6 6M73 27l-6 6M33 67l-6 6" /></g>) },
  { id: "mountain", label: "Mountain", art: (<g {...S}><path d="M12 76 38 34l14 20 10-14 26 36Z" /><path d="m33 42 5-8 5 7" strokeWidth={3} opacity={0.75} /></g>) },
  { id: "feather", label: "Feather", art: (<g {...S}><path d="M72 18C48 20 30 36 28 62l-4 14" /><path d="M72 18c4 22-6 40-28 46" /><path d="M28 62c10-2 20-8 28-18M40 50c6 0 12-2 18-8" strokeWidth={3} opacity={0.75} /></g>) },
  { id: "leaf", label: "Leaf", art: (<g {...S}><path d="M22 74C20 40 40 22 78 22c0 38-18 58-48 54" /><path d="M22 78 54 46M44 56v-16M56 46h12" strokeWidth={3} opacity={0.8} /></g>) },
  { id: "flame", label: "Flame", art: (<g {...S}><path d="M50 18c4 14 22 22 22 42a22 22 0 0 1-44 0c0-10 6-16 10-22 2 8 6 10 10 10 0-12-2-20 2-30Z" /><path d="M50 78c-6 0-10-4-10-10 0-6 6-10 10-16 4 6 10 10 10 16 0 6-4 10-10 10Z" strokeWidth={3} opacity={0.8} /></g>) },
  { id: "stone", label: "Balanced stones", art: (<g {...S}><ellipse cx="50" cy="72" rx="26" ry="9" /><ellipse cx="50" cy="52" rx="19" ry="8" /><ellipse cx="50" cy="34" rx="12" ry="6" /></g>) },
  { id: "seedling", label: "Seedling", art: (<g {...S}><path d="M50 80V50" /><path d="M50 56c-4-14-16-20-28-18 2 12 12 20 28 18ZM50 48c2-12 12-20 26-20-2 14-12 22-26 20Z" /><path d="M32 80h36" opacity={0.65} strokeWidth={3} /></g>) },
  { id: "shell", label: "Shell", art: (<g {...S}><path d="M50 78C24 74 16 52 24 36c6-10 18-16 26-16s20 6 26 16c8 16 0 38-26 42Z" /><path d="M50 78V22M50 78 32 28M50 78 68 28M50 78 22 40M50 78 78 40" strokeWidth={3} opacity={0.7} /></g>) },
  { id: "star", label: "Star", art: (<g {...S}><path d="m50 18 9 22 24 2-18 16 6 24-21-13-21 13 6-24-18-16 24-2Z" /></g>) },
  { id: "heart", label: "Heart", art: (<g {...S}><path d="M50 80C24 62 16 46 22 33c5-10 20-12 28 0 8-12 23-10 28 0 6 13-2 29-28 47Z" /></g>) },
  { id: "bowl", label: "Singing bowl", art: (<g {...S}><path d="M18 46h64c0 20-14 32-32 32S18 66 18 46Z" /><path d="M36 30c4-6 4-10 0-14M50 30c4-6 4-10 0-14M64 30c4-6 4-10 0-14" strokeWidth={3} opacity={0.7} /></g>) },
];

export const SYMBOL_IDS = SYMBOLS.map((s) => s.id);
export const symbolById = (id?: string | null) => SYMBOLS.find((s) => s.id === id);

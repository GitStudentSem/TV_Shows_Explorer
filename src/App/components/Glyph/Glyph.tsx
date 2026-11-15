import type { ReactNode } from "react";
import styles from "./Glyph.module.css";

export interface GlyphProps {
  children: ReactNode;
}

/** Значок-символ (✦, ✧, ←) рядом с текстом: крупнее текста и по центру строки. */
export function Glyph({ children }: GlyphProps) {
  return <span className={styles.glyph}>{children}</span>;
}

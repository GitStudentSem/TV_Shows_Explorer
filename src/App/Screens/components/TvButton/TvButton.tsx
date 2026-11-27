import type { ComponentPropsWithoutRef } from "react";
import styles from "./TvButton.module.css";

type TvButtonProps = Pick<
  ComponentPropsWithoutRef<"button">,
  "aria-pressed" | "children" | "onClick"
>;

export function TvButton(props: TvButtonProps) {
  return <button {...props} type="button" className={styles.button} />;
}

import type { ComponentPropsWithoutRef } from "react";
import styles from "./TvButton.module.css";

type TvButtonProps = Pick<
  ComponentPropsWithoutRef<"button">,
  "aria-pressed" | "children" | "disabled" | "onClick" | "type"
>;

export function TvButton({ type = "button", ...props }: TvButtonProps) {
  return <button {...props} type={type} className={styles.button} />;
}

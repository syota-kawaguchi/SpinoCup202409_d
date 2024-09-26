import { useEffect, useRef } from "react";
import styles from "./finishPage.module.css";

export const FinishPageModal = ({
  isGameFinished,
}: {
  isGameFinished: boolean;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isGameFinished) {
      previousActiveElementRef.current = document.activeElement;
      if (modalRef.current) {
        modalRef.current.focus();
      }
      // フォーカスをモーダル内に閉じ込める
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (e.key === "Tab" && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            (firstElement as HTMLElement).focus();
          } else if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            (lastElement as HTMLElement).focus();
          }
        }
      };

      document.addEventListener("keydown", handleFocusTrap);
      return () => {
        document.removeEventListener("keydown", handleFocusTrap);
      };
    } else if (previousActiveElementRef.current) {
      (previousActiveElementRef.current as HTMLElement).focus();
    }
  }, [isGameFinished]);

  if (!isGameFinished) return null;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.container} ref={modalRef} tabIndex={-1}>
        <h2 className={styles.h2}>TIME OUT</h2>

        <a href="/vue/score" className={styles.link}>
          結果画面へ
        </a>
      </div>
    </div>
  );
};

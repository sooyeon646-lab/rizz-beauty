type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/** Layout wrapper only — no scroll animation (kept for existing call sites). */
export default function ScrollReveal({
  children,
  className = "",
}: ScrollRevealProps) {
  if (!className) return <>{children}</>;
  return <div className={className}>{children}</div>;
}

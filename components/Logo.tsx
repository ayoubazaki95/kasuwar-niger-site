export default function Logo({ size = 22, name }: { size?: number; name?: string }) {
  const displayName = name || "KASUWAR NIGER";
  const parts = displayName.split(" ");
  const firstWord = parts[0];
  const rest = parts.slice(1).join(" ");

  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path d="M10 16h28l2 26a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4l2-26z" stroke="var(--brand-primary, #F5740F)" strokeWidth="3" fill="none" />
        <path d="M16 16v-2a8 8 0 0 1 16 0v2" stroke="var(--brand-primary, #F5740F)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M13 33l6-6 4 4 9-10" stroke="var(--brand-secondary, #129447)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M27 19h5v5" stroke="var(--brand-secondary, #129447)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-display font-extrabold tracking-tight" style={{ fontSize: size * 0.6 }}>
        <span className="text-ink">{firstWord}</span>
        {rest && <span style={{ color: "var(--brand-secondary, #129447)" }}> {rest}</span>}
      </span>
    </div>
  );
}

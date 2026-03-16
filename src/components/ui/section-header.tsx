export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">
        {eyebrow}
      </p>
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

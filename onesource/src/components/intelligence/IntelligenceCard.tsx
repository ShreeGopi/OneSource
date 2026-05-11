type IntelligenceCardProps = {
  title?: string;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

export function IntelligenceCard({
  title,
  subtitle,
  badge,
  onClick,
  className,
  children,
}: IntelligenceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-gray-800 bg-[#111] p-4 transition ${
        onClick ? "cursor-pointer hover:border-gray-600" : ""
      } ${className ?? ""}`}
    >
      {(title || subtitle || badge) && (
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <p className="text-sm font-semibold text-white">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <span className="inline-flex rounded-full bg-gray-900 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-400">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="space-y-3 text-sm text-gray-300">
        {children}
      </div>
    </div>
  );
}

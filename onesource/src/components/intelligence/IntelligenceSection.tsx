type IntelligenceSectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export function IntelligenceSection({
  title,
  subtitle,
  children,
  className,
}: IntelligenceSectionProps) {
  return (
    <section className={`mb-8 rounded-2xl border border-gray-800 bg-[#111] overflow-hidden ${className ?? ""}`}>

      {/* HEADER */}

      <div className="border-b border-gray-800 px-5 py-4">

        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* CONTENT */}

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Optional emoji or small visual above title */
  adornment?: ReactNode;
  align?: "center" | "start";
  className?: string;
};

export function PageHeader({
  title,
  subtitle,
  adornment,
  align = "start",
  className = "",
}: PageHeaderProps) {
  const alignCls = align === "center" ? "text-center" : "text-left";

  return (
    <header className={`mb-8 md:mb-10 ${alignCls} ${className}`}>
      {adornment ? (
        <div className={`mb-4 flex ${align === "center" ? "justify-center" : "justify-start"}`}>
          {adornment}
        </div>
      ) : null}
      <h1 className="font-[var(--font-outfit)] text-3xl font-extrabold tracking-tight text-rk-ink md:text-4xl lg:text-5xl">
        {title}
      </h1>
      {subtitle ? (
        <p
          className={`mt-2 max-w-2xl text-base font-medium text-rk-muted md:text-lg ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

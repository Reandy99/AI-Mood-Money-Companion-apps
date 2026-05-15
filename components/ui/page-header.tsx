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
    <header className={`mb-6 md:mb-7 ${alignCls} ${className}`}>
      {adornment ? (
        <div className={`mb-2.5 flex ${align === "center" ? "justify-center" : "justify-start"}`}>
          {adornment}
        </div>
      ) : null}
      <h1 className="font-[var(--font-outfit)] text-2xl font-extrabold tracking-tight text-rk-ink md:text-3xl lg:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p
          className={`mt-1.5 max-w-2xl text-sm font-medium leading-snug text-rk-muted md:text-[15px] md:leading-snug ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
};

const pad: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-3.5",
  md: "p-5",
  lg: "p-6 md:p-8",
};

export function Card({
  children,
  className = "",
  padding = "sm",
  ...rest
}: CardProps) {
  return (
    <div
      className={`rk-card rounded-rk-xl border border-white/70 bg-white/95 text-rk-ink shadow-rk-card backdrop-blur-sm transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-rk-card-hover ${pad[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

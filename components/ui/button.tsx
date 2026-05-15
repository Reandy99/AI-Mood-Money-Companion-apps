import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

type Size = "sm" | "md";

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** Default `sm` — compact, matches app typography scale */
  size?: Size;
};

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  type?: never;
  disabled?: boolean;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "group inline-flex items-center justify-center rounded-full font-bold tracking-tight transition-[transform,box-shadow,opacity] duration-200 ease-out focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[var(--rk-focus)] disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-[0.98]";

const sizes: Record<Size, string> = {
  sm: "min-h-10 gap-1.5 px-5 py-2 text-sm",
  md: "min-h-12 gap-2 px-8 py-3 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "rk-btn-primary text-white shadow-rk-btn-primary motion-safe:hover:shadow-rk-btn-primary-hover motion-safe:hover:-translate-y-0.5",
  secondary:
    "border-2 border-[var(--rk-border-soft)] bg-white/90 text-rk-ink shadow-sm motion-safe:hover:border-[var(--rk-mint)] motion-safe:hover:bg-[var(--rk-mint-faint)]",
};

export function Button(props: ButtonProps) {
  const { children, className = "", variant = "primary", size = "sm" } = props;
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    const { href, disabled } = props;
    return (
      <Link
        href={href}
        className={cls}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {children}
      </Link>
    );
  }

  const {
    type = "button",
    children: _stripChildren,
    className: _stripClassName,
    variant: _stripVariant,
    size: _stripSize,
    ...htmlRest
  } = props as ButtonAsButton;

  void _stripChildren;
  void _stripClassName;
  void _stripVariant;
  void _stripSize;

  return (
    <button type={type} className={cls} {...htmlRest}>
      {children}
    </button>
  );
}

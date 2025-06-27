import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <a
      className={className}
      href={href}
      rel="noopener noreferrer">
      <h2>{title}</h2>
      <div>{children}</div>
    </a>
  );
}

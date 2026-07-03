interface LogoMarkProps {
  className?: string;
  title?: string;
}

/**
 * Wallet Recovery Agent brand mark — stylized `>_` prompt in a rounded tile.
 * Colors use `currentColor` for the glyph so the mark inherits the surrounding text color.
 */
export function LogoMark({ className, title = "Wallet Recovery Agent" }: LogoMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <rect x="0" y="0" width="64" height="64" rx="12" ry="12" fill="#0A0A0A" />
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="11"
        ry="11"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <path
        d="M18 18 L34 32 L18 46"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <rect x="30" y="43" width="20" height="6" fill="currentColor" />
    </svg>
  );
}

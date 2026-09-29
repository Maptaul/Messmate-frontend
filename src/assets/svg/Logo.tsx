export default function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <g
        className="stroke-primary-foreground"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m20 20.5-11.5-11.5a2.9 2.9 0 0 0 0 4.1l6.3 6.3a2.9 2.9 0 0 0 4.1 0" />
        <path d="m18.5 17.6 5.5 5.9" />
        <path d="m8 23.5 7-7" />
        <path d="m23.5 8-5.2 5.2a2 2 0 0 1-2.8 0 2 2 0 0 1 0-2.8L20.7 5.2" />
      </g>
    </svg>
  );
}

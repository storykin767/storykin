export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Storykin"
    >
      {/* Left page */}
      <path d="M32 22C26 17 18 16 12 17.5V47C18 45.5 26 46.5 32 51V22Z" fill="#7C3AED" />
      {/* Right page */}
      <path d="M32 22C38 17 46 16 52 17.5V47C46 45.5 38 46.5 32 51V22Z" fill="#9333EA" />
      {/* Spine */}
      <path d="M32 22V51" stroke="#5B21B6" strokeWidth="2.5" strokeLinecap="round" />
      {/* Star rising from the page */}
      <path
        d="M32 3.5L35.4 12.3L44.5 12.9L37.4 18.9L39.7 28L32 22.9L24.3 28L26.6 18.9L19.5 12.9L28.6 12.3L32 3.5Z"
        fill="#FCD34D"
      />
    </svg>
  );
}

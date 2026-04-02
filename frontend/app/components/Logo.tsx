export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book base */}
      <rect x="6" y="8" width="28" height="26" rx="3" fill="#7C3AED"/>
      {/* Book spine */}
      <rect x="6" y="8" width="5" height="26" rx="2" fill="#6D28D9"/>
      {/* Pages */}
      <rect x="13" y="12" width="16" height="2" rx="1" fill="white" opacity="0.8"/>
      <rect x="13" y="17" width="16" height="2" rx="1" fill="white" opacity="0.6"/>
      <rect x="13" y="22" width="10" height="2" rx="1" fill="white" opacity="0.4"/>
      {/* Star */}
      <circle cx="30" cy="12" r="6" fill="#FCD34D"/>
      <path d="M30 7.5L31.2 10.8H34.5L31.8 12.9L32.9 16.2L30 14.1L27.1 16.2L28.2 12.9L25.5 10.8H28.8L30 7.5Z" fill="#F59E0B"/>
    </svg>
  );
}
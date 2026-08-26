import React from 'react';

interface TikTokIconProps {
  className?: string;
}

export default function TikTokIcon({ className = "w-5 h-5" }: TikTokIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.15 1.02.85 2.25 1.3 3.53 1.38v3.91a9.017 9.017 0 0 1-4.7-1.37V14.5a8.5 8.5 0 1 1-10.15-8.38v3.97a4.5 4.5 0 1 0 6.15 4.38V0h-3.63V.02h3.26z" />
    </svg>
  );
}

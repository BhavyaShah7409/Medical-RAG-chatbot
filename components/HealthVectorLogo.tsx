'use client'

interface HealthVectorLogoProps {
  className?: string
  size?: number
}

export default function HealthVectorLogo({ className = "", size = 24 }: HealthVectorLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* White background circle */}
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="white"
      />
      
      {/* Medical Cross */}
      <rect
        x="20"
        y="40"
        width="60"
        height="20"
        fill="#14B8A6"
        rx="2"
      />
      <rect
        x="40"
        y="20"
        width="20"
        height="60"
        fill="#14B8A6"
        rx="2"
      />
    </svg>
  )
}

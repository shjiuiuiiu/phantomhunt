"use client"

import { useEffect, useState } from "react"

export function SnakeLogo({ className = "", animated = true }: { className?: string; animated?: boolean }) {
  const [glowIntensity, setGlowIntensity] = useState(0.5)

  useEffect(() => {
    if (!animated) return

    const interval = setInterval(() => {
      setGlowIntensity(Math.random() * 0.5 + 0.5)
    }, 2000)

    return () => clearInterval(interval)
  }, [animated])

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: animated
          ? `drop-shadow(0 0 ${glowIntensity * 20}px #00f3ff) drop-shadow(0 0 ${glowIntensity * 10}px #ff00c8)`
          : undefined,
      }}
    >
      {/* Snake body - coiled around a geometric shape */}
      <defs>
        <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#00f3ff", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#0099cc", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ff00c8", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ff00c8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ff0066", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Hexagonal background element */}
      <path
        d="M100 20 L160 55 L160 125 L100 160 L40 125 L40 55 Z"
        fill="none"
        stroke="#00f3ff"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Snake body path - sleek, coiled design */}
      <path
        d="M 100 40 
           Q 140 50, 145 80
           Q 148 110, 130 130
           Q 110 145, 90 140
           Q 70 135, 60 115
           Q 55 100, 65 85
           Q 75 75, 85 75
           Q 95 75, 100 82
           Q 105 88, 100 95
           Q 95 100, 90 98"
        fill="none"
        stroke="url(#snakeGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? "animate-pulse-slow" : ""}
      />

      {/* Snake head */}
      <ellipse cx="100" cy="40" rx="12" ry="10" fill="url(#snakeGradient)" />

      {/* Snake eyes - glowing */}
      <circle cx="95" cy="38" r="2.5" fill="url(#eyeGlow)">
        {animated && <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />}
      </circle>
      <circle cx="105" cy="38" r="2.5" fill="url(#eyeGlow)">
        {animated && <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />}
      </circle>

      {/* Forked tongue */}
      <path
        d="M 100 45 L 100 52 M 98 52 L 96 56 M 102 52 L 104 56"
        stroke="#ff00c8"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      >
        {animated && <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />}
      </path>

      {/* Geometric accent lines */}
      <line x1="40" y1="55" x2="50" y2="70" stroke="#00f3ff" strokeWidth="1" opacity="0.5" />
      <line x1="160" y1="55" x2="150" y2="70" stroke="#ff00c8" strokeWidth="1" opacity="0.5" />
      <line x1="40" y1="125" x2="50" y2="110" stroke="#ff00c8" strokeWidth="1" opacity="0.5" />
      <line x1="160" y1="125" x2="150" y2="110" stroke="#00f3ff" strokeWidth="1" opacity="0.5" />

      {/* Snake tail detail - scales pattern */}
      <g opacity="0.6">
        <circle cx="88" cy="98" r="2" fill="#00f3ff" />
        <circle cx="92" cy="102" r="1.5" fill="#00f3ff" />
        <circle cx="86" cy="104" r="1.5" fill="#0099cc" />
      </g>

      {/* Cyberpunk scan lines overlay */}
      {animated && (
        <g opacity="0.1">
          <line x1="0" y1="50" x2="200" y2="50" stroke="#00f3ff" strokeWidth="0.5">
            <animate attributeName="y1" values="0;200" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y2" values="0;200" dur="4s" repeatCount="indefinite" />
          </line>
        </g>
      )}
    </svg>
  )
}

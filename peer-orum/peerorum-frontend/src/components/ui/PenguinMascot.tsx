export default function PenguinMascot({ className = 'h-24 w-24' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <ellipse cx="50" cy="55" rx="30" ry="34" fill="#1e293b" />
      <ellipse cx="50" cy="60" rx="19" ry="24" fill="#ffffff" />
      <circle cx="41" cy="42" r="4" fill="#1e293b" />
      <circle cx="59" cy="42" r="4" fill="#1e293b" />
      <path d="M46 48 L54 48 L50 54 Z" fill="#f59e0b" />
      <ellipse cx="27" cy="58" rx="6" ry="10" fill="#1e293b" />
      <ellipse cx="73" cy="58" rx="6" ry="10" fill="#1e293b" />
      <ellipse cx="41" cy="86" rx="7" ry="4" fill="#f59e0b" />
      <ellipse cx="59" cy="86" rx="7" ry="4" fill="#f59e0b" />
    </svg>
  )
}

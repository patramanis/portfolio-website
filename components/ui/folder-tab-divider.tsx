export function FolderTabDivider() {
  return (
    <div className="relative h-20 w-full">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 80"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.5" />
            <stop offset="35%" stopColor="#71717a" />
            <stop offset="55%" stopColor="#d4d4d8" />
            <stop offset="75%" stopColor="#a1a1aa" />
            <stop offset="100%" stopColor="#52525b" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/*
          Line starts high (y=12) on the far left (image side),
          curves down to y=60 right at x=600 (where headings begin),
          then runs flat to the right edge — looks like a folder opening below.
        */}
        <path
          d="M0,12 Q280,64 600,64 L1200,64"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

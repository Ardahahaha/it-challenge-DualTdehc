"use client"

interface BadgeCardProps {
  name: string
  unlocked?: boolean
  icon?: string
}

export default function BadgeCard({ name, unlocked = false, icon = "★" }: BadgeCardProps) {
  return (
    <div 
      className={`relative glass rounded-xl p-5 text-center cursor-pointer transition-all duration-400 ${
        unlocked 
          ? "border-2 border-primary/40 card-hover shadow-lg" 
          : "border border-border/30 opacity-60 hover:opacity-80 hover:border-primary/20"
      }`}
    >
      {unlocked && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg animate-bounce glow-subtle">
          ✓
        </div>
      )}
      <div 
        className={`text-5xl mb-3 transition-all duration-300 ${
          unlocked 
            ? "filter-none scale-110" 
            : "grayscale opacity-40"
        }`}
      >
        {unlocked && <div className="animate-pulse">{icon}</div>}
        {!unlocked && icon}
      </div>
      <div className={`text-xs font-semibold leading-tight ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
        {name}
      </div>
      {unlocked && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-[oklch(0.5_0.22_285)] to-[oklch(0.4_0.2_290)] opacity-50 rounded-b-xl"></div>
      )}
    </div>
  )
}
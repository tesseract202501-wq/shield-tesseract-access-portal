"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"

interface LeaderboardWidgetProps {
  topHeroes: { teamName: string; votes: number }[]
}

export function LeaderboardWidget({ topHeroes }: LeaderboardWidgetProps) {
  const medals = ["🥇", "🥈", "🥉"]
  const medalColors = [
    "from-yellow-400 to-yellow-600",
    "from-gray-300 to-gray-400",
    "from-amber-600 to-amber-800"
  ]

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 w-80"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="leaderboard-widget rounded-lg p-4 backdrop-blur-md bg-black/80 border border-cyan-500/30">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-500/30">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-cyan-300 tracking-wider">TOP 3 HEROES</h3>
        </div>
        
        <div className="space-y-3">
          {topHeroes.slice(0, 3).map((hero, index) => (
            <motion.div
              key={hero.teamName}
              className={`flex items-center gap-3 p-3 rounded-md bg-gradient-to-r ${medalColors[index]} bg-opacity-20 border border-white/10`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            >
              <div className="text-2xl">{medals[index]}</div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">{hero.teamName}</div>
                <div className="text-xs text-cyan-300">{hero.votes} votes</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
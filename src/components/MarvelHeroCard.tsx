"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

interface MarvelHeroCardProps {
  teamName: string
  demoUrl: string
  isLocked?: boolean
  votes: number
  onVote: () => void
  hasVoted?: boolean
}

export function MarvelHeroCard({ 
  teamName, 
  demoUrl, 
  isLocked = false, 
  votes,
  onVote,
  hasVoted = false
}: MarvelHeroCardProps) {
  const [isHovering, setIsHovering] = useState(false)

  const handleVote = () => {
    if (!isLocked && !hasVoted) {
      onVote()
    }
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Holographic Border */}
      <div className="holographic-border p-[2px] rounded-lg">
        <div className="bg-[#0a0e1a] rounded-lg overflow-hidden relative">
          {/* Team Name Header */}
          <div className="p-4 border-b border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <h3 className="metallic-text text-xl font-bold tracking-wider text-center">
              {teamName}
            </h3>
          </div>

          {/* Demo Iframe */}
          <div className="relative aspect-video bg-black/50">
            {!isLocked ? (
              <iframe
                src={demoUrl}
                className="w-full h-full border-0 scan-lines"
                title={`${teamName} Demo`}
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-80" />
                <div className="relative z-10 text-center">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <div className="classified-stamp">CLASSIFIED</div>
                </div>
              </div>
            )}
          </div>

          {/* Vote Button */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-blue-300">Current Votes: <span className="font-bold text-cyan-400">{votes}</span></span>
            </div>
            <motion.button
              onClick={handleVote}
              disabled={isLocked || hasVoted}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className={`w-full py-3 px-6 rounded-md font-bold text-sm tracking-wider transition-all duration-300 relative overflow-hidden ${
                isLocked || hasVoted
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "repulsor-button text-white"
              }`}
              whileHover={!isLocked && !hasVoted ? { scale: 1.02 } : {}}
              whileTap={!isLocked && !hasVoted ? { scale: 0.98 } : {}}
            >
              {isLocked ? (
                "🔒 LOCKED"
              ) : hasVoted ? (
                "✓ VOTED"
              ) : (
                <>
                  <span className="relative z-10">CAST YOUR VOTE</span>
                  {isHovering && <div className="repulsor-glow" />}
                </>
              )}
            </motion.button>
          </div>

          {/* Locked Overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          )}
        </div>
      </div>
    </motion.div>
  )
}
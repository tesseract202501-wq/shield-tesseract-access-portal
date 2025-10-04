"use client"

import { useState } from "react"
import { MarvelHeroCard } from "./MarvelHeroCard"
import { TesseractShard } from "./TesseractShard"
import { LeaderboardWidget } from "./LeaderboardWidget"
import { TesseractBurst } from "./TesseractBurst"
import { Toaster, toast } from "sonner"

interface Hero {
  id: string
  teamName: string
  demoUrl: string
  isLocked: boolean
  votes: number
}

const initialHeroes: Hero[] = [
  {
    id: "1",
    teamName: "STARK INDUSTRIES",
    demoUrl: "https://example.com/demo1",
    isLocked: false,
    votes: 42
  },
  {
    id: "2",
    teamName: "WAKANDA TECH",
    demoUrl: "https://example.com/demo2",
    isLocked: false,
    votes: 38
  },
  {
    id: "3",
    teamName: "PYM PARTICLES",
    demoUrl: "https://example.com/demo3",
    isLocked: false,
    votes: 35
  },
  {
    id: "4",
    teamName: "ASGARD INNOVATIONS",
    demoUrl: "https://example.com/demo4",
    isLocked: true,
    votes: 0
  },
  {
    id: "5",
    teamName: "SHIELD SYSTEMS",
    demoUrl: "https://example.com/demo5",
    isLocked: false,
    votes: 28
  },
  {
    id: "6",
    teamName: "HYDRA LABS",
    demoUrl: "https://example.com/demo6",
    isLocked: true,
    votes: 0
  }
]

export function MarvelHeroGallery() {
  const [heroes, setHeroes] = useState<Hero[]>(initialHeroes)
  const [votedHeroes, setVotedHeroes] = useState<Set<string>>(new Set())
  const [showBurst, setShowBurst] = useState(false)

  const handleVote = (heroId: string) => {
    if (votedHeroes.has(heroId)) return

    // Show burst animation
    setShowBurst(true)

    // Update votes
    setHeroes(prev =>
      prev.map(hero =>
        hero.id === heroId ? { ...hero, votes: hero.votes + 1 } : hero
      )
    )

    // Mark as voted
    setVotedHeroes(prev => new Set(prev).add(heroId))

    // Show toast notification
    setTimeout(() => {
      toast.success("VOTE RECORDED BY S.H.I.E.L.D.", {
        description: "Your vote has been successfully registered",
        icon: "✓",
        duration: 3000,
      })
    }, 600)
  }

  const topHeroes = [...heroes]
    .filter(h => !h.isLocked)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3)

  // Get IDs of top 3 heroes to hide them
  const topHeroIds = new Set(topHeroes.map(h => h.id))
  
  // Filter out top 3 heroes from display
  const displayedHeroes = heroes.filter(hero => !topHeroIds.has(hero.id))

  return (
    <div className="min-h-screen cosmic-background relative overflow-hidden">
      <Toaster position="top-center" theme="dark" />
      
      {/* Tesseract Shards */}
      <TesseractShard position="top-left" />
      <TesseractShard position="top-right" />
      <TesseractShard position="bottom-left" />
      
      {/* Burst Animation */}
      <TesseractBurst show={showBurst} onComplete={() => setShowBurst(false)} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white tracking-wider marvel-title">
            MARVEL HERO GALLERY
          </h1>
          <p className="text-cyan-300 text-lg">Cast your vote for the best Avenger project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayedHeroes.map(hero => (
            <MarvelHeroCard
              key={hero.id}
              teamName={hero.teamName}
              demoUrl={hero.demoUrl}
              isLocked={hero.isLocked}
              votes={hero.votes}
              onVote={() => handleVote(hero.id)}
              hasVoted={votedHeroes.has(hero.id)}
            />
          ))}
        </div>
      </div>

      {/* Leaderboard Widget */}
      <LeaderboardWidget topHeroes={topHeroes} />
    </div>
  )
}
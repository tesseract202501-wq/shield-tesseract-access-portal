"use client"

import { motion } from "framer-motion"

interface TesseractShardProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export function TesseractShard({ position }: TesseractShardProps) {
  const positionClasses = {
    "top-left": "top-8 left-8",
    "top-right": "top-8 right-8",
    "bottom-left": "bottom-8 left-8",
    "bottom-right": "bottom-8 right-8"
  }

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} w-24 h-24 z-0 pointer-events-none`}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="tesseract-shard w-full h-full" />
    </motion.div>
  )
}
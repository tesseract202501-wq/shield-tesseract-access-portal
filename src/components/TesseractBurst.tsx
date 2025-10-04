"use client"

import { motion, AnimatePresence } from "framer-motion"

interface TesseractBurstProps {
  show: boolean
  onComplete: () => void
}

export function TesseractBurst({ show, onComplete }: TesseractBurstProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            className="tesseract-burst"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1.5, 2],
              rotate: [0, 180, 360],
              opacity: [1, 0.8, 0]
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
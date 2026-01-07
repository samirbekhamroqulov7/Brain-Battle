"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { CrosswordPvP } from "@/components/games/pvp/crossword/game"

export default function CrosswordPvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP Crossword" gameType="crossword">
      <CrosswordPvP />
    </PvPGameWrapper>
  )
}

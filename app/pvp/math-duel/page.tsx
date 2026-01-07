"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { MathDuelPvP } from "@/components/games/pvp/math-duel/game"

export default function MathDuelPvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP Math Duel" gameType="math-duel">
      <MathDuelPvP />
    </PvPGameWrapper>
  )
}

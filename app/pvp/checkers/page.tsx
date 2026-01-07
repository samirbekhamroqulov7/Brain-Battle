"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { CheckersPvP } from "@/components/games/pvp/checkers/game"

export default function CheckersPvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP Checkers" gameType="checkers">
      <CheckersPvP />
    </PvPGameWrapper>
  )
}

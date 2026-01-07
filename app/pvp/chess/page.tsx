"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { ChessPvP } from "@/components/games/pvp/chess/game"

export default function ChessPvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP Chess" gameType="chess">
      <ChessPvP />
    </PvPGameWrapper>
  )
}

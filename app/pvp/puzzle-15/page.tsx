"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { Puzzle15PvP } from "@/components/games/pvp/puzzle-15/game"

export default function Puzzle15PvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP 15 Puzzle" gameType="puzzle-15">
      <Puzzle15PvP />
    </PvPGameWrapper>
  )
}

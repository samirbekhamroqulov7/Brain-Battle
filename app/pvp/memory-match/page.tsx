"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { MemoryMatchPvP } from "@/components/games/pvp/memory-match/game"

export default function MemoryMatchPvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP Memory Match" gameType="memory-match">
      <MemoryMatchPvP />
    </PvPGameWrapper>
  )
}

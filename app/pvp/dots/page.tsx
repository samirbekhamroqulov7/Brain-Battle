"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { DotsPvP } from "@/components/games/pvp/dots/game"

export default function DotsPvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP Dots" gameType="dots">
      <DotsPvP />
    </PvPGameWrapper>
  )
}

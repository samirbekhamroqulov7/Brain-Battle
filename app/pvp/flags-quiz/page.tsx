"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { FlagsQuizPvP } from "@/components/games/pvp/flags-quiz/game"

export default function FlagsQuizPvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP Flags Quiz" gameType="flags-quiz">
      <FlagsQuizPvP />
    </PvPGameWrapper>
  )
}

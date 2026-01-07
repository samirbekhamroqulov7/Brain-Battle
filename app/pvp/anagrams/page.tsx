"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { AnagramsPvP } from "@/components/games/pvp/anagrams/game"

export default function AnagramsPvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP Anagrams" gameType="anagrams">
      <AnagramsPvP />
    </PvPGameWrapper>
  )
}

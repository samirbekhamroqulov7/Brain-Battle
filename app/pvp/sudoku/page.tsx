"use client"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { SudokuPvP } from "@/components/games/pvp/sudoku/game"

export default function SudokuPvPPage() {
  return (
    <PvPGameWrapper gameTitle="PvP Sudoku" gameType="sudoku">
      <SudokuPvP />
    </PvPGameWrapper>
  )
}

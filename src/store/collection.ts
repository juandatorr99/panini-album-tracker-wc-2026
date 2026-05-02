import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CollectionState = {
  counts: Record<string, number>
  showCokeInsert: boolean
  groupAssignments: Record<string, string>
  increment: (code: string) => void
  decrement: (code: string) => void
  setCount: (code: string, n: number) => void
  setGroup: (teamCode: string, group: string) => void
  removeGroup: (teamCode: string) => void
  toggleCoke: () => void
  reset: () => void
}

export const useCollection = create<CollectionState>()(
  persist(
    (set) => ({
      counts: {},
      showCokeInsert: false,
      groupAssignments: {},

      increment: (code) =>
        set((s) => ({ counts: { ...s.counts, [code]: (s.counts[code] ?? 0) + 1 } })),

      decrement: (code) =>
        set((s) => {
          const current = s.counts[code] ?? 0
          if (current <= 0) return s
          const next = { ...s.counts, [code]: current - 1 }
          if (next[code] === 0) delete next[code]
          return { counts: next }
        }),

      setCount: (code, n) =>
        set((s) => {
          const next = { ...s.counts }
          if (n <= 0) delete next[code]
          else next[code] = n
          return { counts: next }
        }),

      setGroup: (teamCode, group) =>
        set((s) => ({ groupAssignments: { ...s.groupAssignments, [teamCode]: group } })),

      removeGroup: (teamCode) =>
        set((s) => {
          const next = { ...s.groupAssignments }
          delete next[teamCode]
          return { groupAssignments: next }
        }),

      toggleCoke: () => set((s) => ({ showCokeInsert: !s.showCokeInsert })),

      reset: () => set({ counts: {} }),
    }),
    { name: 'panini-wc-2026' }
  )
)

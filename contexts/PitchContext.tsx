"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Pitch {
  id: string
  title: string
  description: string
  category: string
  fundingGoal: number
  currentFunding: number
  founderId: string
  founderName: string
  founderEmail: string
  pitchDeckUrl?: string
  status: "active" | "funded" | "closed"
  createdAt: string
  interestedInvestors: string[]
  tags: string[]
}

interface PitchContextType {
  pitches: Pitch[]
  addPitch: (pitch: Omit<Pitch, "id" | "createdAt" | "currentFunding" | "interestedInvestors">) => void
  updatePitch: (id: string, updates: Partial<Pitch>) => void
  deletePitch: (id: string) => void
  expressInterest: (pitchId: string, investorId: string) => void
  getPitchById: (id: string) => Pitch | undefined
}

const PitchContext = createContext<PitchContextType | undefined>(undefined)

// Mock pitches data
const mockPitches: Pitch[] = [
  {
    id: "1",
    title: "EcoTech Solutions",
    description:
      "Revolutionary solar panel technology that increases efficiency by 40% while reducing costs. Our patented nano-coating technology represents the future of renewable energy.",
    category: "CleanTech",
    fundingGoal: 500000,
    currentFunding: 125000,
    founderId: "1",
    founderName: "John Doe",
    founderEmail: "john@ecotech.com",
    pitchDeckUrl: "https://example.com/pitch-deck-1.pdf",
    status: "active",
    createdAt: "2024-01-15",
    interestedInvestors: ["2"],
    tags: ["Solar", "Renewable Energy", "Hardware"],
  },
  {
    id: "2",
    title: "HealthAI Platform",
    description:
      "AI-powered diagnostic platform that helps doctors make faster, more accurate diagnoses. Reduces diagnostic time by 60% and improves accuracy by 35%.",
    category: "HealthTech",
    fundingGoal: 1000000,
    currentFunding: 750000,
    founderId: "1",
    founderName: "John Doe",
    founderEmail: "john@healthai.com",
    pitchDeckUrl: "https://example.com/pitch-deck-2.pdf",
    status: "active",
    createdAt: "2024-01-10",
    interestedInvestors: ["2"],
    tags: ["AI", "Healthcare", "SaaS"],
  },
  {
    id: "3",
    title: "FoodTech Delivery",
    description:
      "Sustainable food delivery platform connecting local farms directly to consumers. Zero-waste packaging and carbon-neutral delivery.",
    category: "FoodTech",
    fundingGoal: 300000,
    currentFunding: 300000,
    founderId: "1",
    founderName: "John Doe",
    founderEmail: "john@foodtech.com",
    status: "funded",
    createdAt: "2024-01-05",
    interestedInvestors: ["2"],
    tags: ["Food", "Sustainability", "Logistics"],
  },
]

export function PitchProvider({ children }: { children: React.ReactNode }) {
  const [pitches, setPitches] = useState<Pitch[]>(mockPitches)

  const addPitch = (pitchData: Omit<Pitch, "id" | "createdAt" | "currentFunding" | "interestedInvestors">) => {
    const newPitch: Pitch = {
      ...pitchData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      currentFunding: 0,
      interestedInvestors: [],
    }
    setPitches((prev) => [newPitch, ...prev])
  }

  const updatePitch = (id: string, updates: Partial<Pitch>) => {
    setPitches((prev) => prev.map((pitch) => (pitch.id === id ? { ...pitch, ...updates } : pitch)))
  }

  const deletePitch = (id: string) => {
    setPitches((prev) => prev.filter((pitch) => pitch.id !== id))
  }

  const expressInterest = (pitchId: string, investorId: string) => {
    setPitches((prev) =>
      prev.map((pitch) =>
        pitch.id === pitchId
          ? {
              ...pitch,
              interestedInvestors: pitch.interestedInvestors.includes(investorId)
                ? pitch.interestedInvestors.filter((id) => id !== investorId)
                : [...pitch.interestedInvestors, investorId],
            }
          : pitch,
      ),
    )
  }

  const getPitchById = (id: string) => {
    return pitches.find((pitch) => pitch.id === id)
  }

  return (
    <PitchContext.Provider
      value={{
        pitches,
        addPitch,
        updatePitch,
        deletePitch,
        expressInterest,
        getPitchById,
      }}
    >
      {children}
    </PitchContext.Provider>
  )
}

export function usePitch() {
  const context = useContext(PitchContext)
  if (context === undefined) {
    throw new Error("usePitch must be used within a PitchProvider")
  }
  return context
}

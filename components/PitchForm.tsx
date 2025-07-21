"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { usePitch } from "@/contexts/PitchContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

interface PitchFormProps {
  pitchId?: string | null
  onClose: () => void
}

const categories = [
  "FinTech",
  "HealthTech",
  "EdTech",
  "CleanTech",
  "FoodTech",
  "E-commerce",
  "SaaS",
  "AI/ML",
  "Blockchain",
  "IoT",
  "Other",
]

export function PitchForm({ pitchId, onClose }: PitchFormProps) {
  const { user } = useAuth()
  const { addPitch, updatePitch, getPitchById } = usePitch()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    fundingGoal: "",
    pitchDeckUrl: "",
    tags: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (pitchId) {
      const pitch = getPitchById(pitchId)
      if (pitch) {
        setFormData({
          title: pitch.title,
          description: pitch.description,
          category: pitch.category,
          fundingGoal: pitch.fundingGoal.toString(),
          pitchDeckUrl: pitch.pitchDeckUrl || "",
          tags: pitch.tags.join(", "),
        })
      }
    }
  }, [pitchId, getPitchById])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    if (!formData.title || !formData.description || !formData.category || !formData.fundingGoal) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const fundingGoal = Number.parseFloat(formData.fundingGoal)
    if (isNaN(fundingGoal) || fundingGoal <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid funding goal",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const pitchData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fundingGoal,
        founderId: user.id,
        founderName: user.name,
        founderEmail: user.email,
        pitchDeckUrl: formData.pitchDeckUrl,
        status: "active" as const,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      }

      if (pitchId) {
        updatePitch(pitchId, pitchData)
        toast({
          title: "Success",
          description: "Pitch updated successfully!",
        })
      } else {
        addPitch(pitchData)
        toast({
          title: "Success",
          description: "Pitch created successfully!",
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pitch",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{pitchId ? "Edit Pitch" : "Create New Pitch"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Pitch Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your pitch title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your business idea, problem you're solving, and your solution"
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingGoal">Funding Goal ($) *</Label>
                <Input
                  id="fundingGoal"
                  type="number"
                  value={formData.fundingGoal}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fundingGoal: e.target.value }))}
                  placeholder="100000"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pitchDeckUrl">Pitch Deck URL</Label>
              <Input
                id="pitchDeckUrl"
                type="url"
                value={formData.pitchDeckUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, pitchDeckUrl: e.target.value }))}
                placeholder="https://example.com/your-pitch-deck.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="AI, SaaS, B2B, Healthcare"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : pitchId ? "Update Pitch" : "Create Pitch"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

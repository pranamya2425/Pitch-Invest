"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { usePitch } from "@/contexts/PitchContext"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Trash2, Eye, DollarSign, Users, TrendingUp } from "lucide-react"
import { PitchForm } from "@/components/PitchForm"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EntrepreneurDashboard() {
  const { user } = useAuth()
  const { pitches, deletePitch } = usePitch()
  const [showPitchForm, setShowPitchForm] = useState(false)
  const [editingPitch, setEditingPitch] = useState<string | null>(null)
  const { toast } = useToast()

  if (!user || user.role !== "entrepreneur") {
    return <div>Access denied</div>
  }

  const userPitches = pitches.filter((pitch) => pitch.founderId === user.id)

  const totalFunding = userPitches.reduce((sum, pitch) => sum + pitch.currentFunding, 0)
  const totalGoal = userPitches.reduce((sum, pitch) => sum + pitch.fundingGoal, 0)
  const totalInterest = userPitches.reduce((sum, pitch) => sum + pitch.interestedInvestors.length, 0)

  const handleDeletePitch = (pitchId: string) => {
    if (confirm("Are you sure you want to delete this pitch?")) {
      deletePitch(pitchId)
      toast({
        title: "Success",
        description: "Pitch deleted successfully",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "funded":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pitches</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPitches.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFunding.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funding Goal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalGoal.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interested Investors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInterest}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <Button onClick={() => setShowPitchForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Pitch
          </Button>
        </div>

        {/* Pitches List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Pitches</h2>

          {userPitches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't created any pitches yet.</p>
                <Button onClick={() => setShowPitchForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Pitch
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {userPitches.map((pitch) => (
                <Card key={pitch.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{pitch.title}</CardTitle>
                        <CardDescription className="mt-2">{pitch.description.substring(0, 150)}...</CardDescription>
                      </div>
                      <Badge className={getStatusColor(pitch.status)}>{pitch.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Funding Progress</span>
                        <span>
                          ${pitch.currentFunding.toLocaleString()} / ${pitch.fundingGoal.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(pitch.currentFunding / pitch.fundingGoal) * 100} className="w-full" />

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span>Category: {pitch.category}</span>
                          <span>Interested: {pitch.interestedInvestors.length}</span>
                        </div>

                        <div className="flex space-x-2">
                          <Link href={`/pitch/${pitch.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => setEditingPitch(pitch.id)}>
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeletePitch(pitch.id)}>
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pitch Form Modal */}
      {(showPitchForm || editingPitch) && (
        <PitchForm
          pitchId={editingPitch}
          onClose={() => {
            setShowPitchForm(false)
            setEditingPitch(null)
          }}
        />
      )}
    </div>
  )
}

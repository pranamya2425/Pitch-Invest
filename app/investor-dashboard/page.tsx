"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { usePitch } from "@/contexts/PitchContext"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Eye, Search, Filter, TrendingUp, Users, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function InvestorDashboard() {
  const { user } = useAuth()
  const { pitches, expressInterest } = usePitch()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [fundingFilter, setFundingFilter] = useState("all")

  if (!user || user.role !== "investor") {
    return <div>Access denied</div>
  }

  // Filter pitches
  const filteredPitches = pitches.filter((pitch) => {
    const matchesSearch =
      pitch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pitch.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || pitch.category === categoryFilter
    const matchesFunding =
      fundingFilter === "all" ||
      (fundingFilter === "under100k" && pitch.fundingGoal < 100000) ||
      (fundingFilter === "100k-500k" && pitch.fundingGoal >= 100000 && pitch.fundingGoal <= 500000) ||
      (fundingFilter === "over500k" && pitch.fundingGoal > 500000)

    return matchesSearch && matchesCategory && matchesFunding
  })

  const categories = [...new Set(pitches.map((pitch) => pitch.category))]
  const totalPitches = pitches.length
  const interestedPitches = pitches.filter((pitch) => pitch.interestedInvestors.includes(user.id)).length
  const activePitches = pitches.filter((pitch) => pitch.status === "active").length

  const handleExpressInterest = (pitchId: string) => {
    expressInterest(pitchId, user.id)
    const pitch = pitches.find((p) => p.id === pitchId)
    const isInterested = pitch?.interestedInvestors.includes(user.id)

    toast({
      title: isInterested ? "Interest Removed" : "Interest Expressed",
      description: isInterested
        ? "You've removed your interest in this pitch"
        : "The entrepreneur will be notified of your interest",
    })
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
          <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
          <p className="text-gray-600">Discover your next investment opportunity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pitches</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPitches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pitches</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePitches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Interests</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{interestedPitches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter Pitches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search pitches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Funding Range</label>
                <Select value={fundingFilter} onValueChange={setFundingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Ranges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="under100k">Under $100K</SelectItem>
                    <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                    <SelectItem value="over500k">Over $500K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pitches Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Available Pitches ({filteredPitches.length})</h2>
          </div>

          {filteredPitches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No pitches match your current filters.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("all")
                    setFundingFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredPitches.map((pitch) => (
                <Card key={pitch.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{pitch.title}</CardTitle>
                          <Badge className={getStatusColor(pitch.status)}>{pitch.status}</Badge>
                        </div>
                        <CardDescription className="text-base">
                          {pitch.description.substring(0, 200)}...
                        </CardDescription>
                      </div>
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

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{pitch.category}</Badge>
                        {pitch.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <div className="text-sm text-gray-600">
                          <p>By: {pitch.founderName}</p>
                          <p>Interested: {pitch.interestedInvestors.length} investors</p>
                        </div>

                        <div className="flex space-x-2">
                          <Link href={`/pitch/${pitch.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-1 h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant={pitch.interestedInvestors.includes(user.id) ? "default" : "outline"}
                            onClick={() => handleExpressInterest(pitch.id)}
                          >
                            <Heart
                              className={`mr-1 h-4 w-4 ${pitch.interestedInvestors.includes(user.id) ? "fill-current" : ""}`}
                            />
                            {pitch.interestedInvestors.includes(user.id) ? "Interested" : "Express Interest"}
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
    </div>
  )
}

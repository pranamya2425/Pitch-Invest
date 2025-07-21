"use client"

import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { usePitch } from "@/contexts/PitchContext"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, ExternalLink, Calendar, DollarSign, Users, Target, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function PitchDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const { getPitchById, expressInterest } = usePitch()
  const { toast } = useToast()

  const pitchId = params.id as string
  const pitch = getPitchById(pitchId)

  if (!pitch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Pitch Not Found</h1>
              <p className="text-gray-600 mb-6">The pitch you're looking for doesn't exist.</p>
              <Link href={user?.role === "investor" ? "/investor-dashboard" : "/"}>
                <Button>Go Back</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleExpressInterest = () => {
    if (!user || user.role !== "investor") {
      toast({
        title: "Access Denied",
        description: "Only investors can express interest",
        variant: "destructive",
      })
      return
    }

    expressInterest(pitchId, user.id)
    const isInterested = pitch.interestedInvestors.includes(user.id)

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

  const fundingPercentage = (pitch.currentFunding / pitch.fundingGoal) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-3xl">{pitch.title}</CardTitle>
                      <Badge className={getStatusColor(pitch.status)}>{pitch.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {pitch.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{pitch.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Pitch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{pitch.description}</p>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {pitch.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pitch Deck */}
            {pitch.pitchDeckUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Pitch Deck</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">View Pitch Deck</p>
                      <p className="text-sm text-gray-600">Access the full presentation</p>
                    </div>
                    <a href={pitch.pitchDeckUrl} target="_blank" rel="noopener noreferrer">
                      <Button>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Deck
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Funding Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${pitch.currentFunding.toLocaleString()}</div>
                  <div className="text-gray-600">raised of ${pitch.fundingGoal.toLocaleString()} goal</div>
                </div>

                <Progress value={fundingPercentage} className="w-full" />

                <div className="text-center text-sm text-gray-600">{fundingPercentage.toFixed(1)}% funded</div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">{pitch.interestedInvestors.length}</div>
                    <div className="text-sm text-gray-600">Interested Investors</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      ${(pitch.fundingGoal - pitch.currentFunding).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </div>

                {user?.role === "investor" && (
                  <Button
                    className="w-full"
                    variant={pitch.interestedInvestors.includes(user.id) ? "default" : "outline"}
                    onClick={handleExpressInterest}
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${pitch.interestedInvestors.includes(user.id) ? "fill-current" : ""}`}
                    />
                    {pitch.interestedInvestors.includes(user.id) ? "Remove Interest" : "Express Interest"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Founder Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Founder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {pitch.founderName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{pitch.founderName}</div>
                    <div className="text-sm text-gray-600">Founder & CEO</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{pitch.founderEmail}</span>
                  </div>
                </div>

                {user?.role === "investor" && (
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Founder
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Investment Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Minimum Investment</span>
                    <span className="font-semibold">$5,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valuation</span>
                    <span className="font-semibold">$2.5M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Equity Offered</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Investment Type</span>
                    <span className="font-semibold">Seed Round</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

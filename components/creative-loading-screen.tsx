"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Database,
  Brain,
  Zap,
  Sparkles,
  Users,
  BookOpen,
  Microscope,
  Laptop,
  Globe,
  TrendingUp,
  Award,
  Lightbulb,
  Target,
  Network,
  ArrowRight,
} from "lucide-react"

interface CreativeLoadingScreenProps {
  isVisible: boolean
  currentStage: string
  onComplete?: () => void
}

const CreativeLoadingScreen: React.FC<CreativeLoadingScreenProps> = ({ isVisible, currentStage, onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [networkNodes, setNetworkNodes] = useState<Array<{ id: number; x: number; y: number; connected: boolean }>>([])
  const [animationPhase, setAnimationPhase] = useState(0)

  const loadingStages = [
    {
      icon: Search,
      title: "Analyzing your research query...",
      description: "Understanding your research interests and collaboration needs",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Database,
      title: "Searching academic databases...",
      description: "Scanning millions of publications and researcher profiles",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Brain,
      title: "Finding potential collaborators...",
      description: "AI matching based on research compatibility",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Zap,
      title: "Processing research matches...",
      description: "Evaluating collaboration potential and expertise alignment",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Sparkles,
      title: "Generating recommendations...",
      description: "Creating personalized collaboration suggestions",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ]

  const researchFacts = [
    {
      icon: Users,
      fact: "90% of successful research involves collaboration across different expertise areas",
      stat: "90%",
    },
    {
      icon: TrendingUp,
      fact: "Cross-disciplinary research leads to 50% more citations than single-field studies",
      stat: "50%",
    },
    {
      icon: Globe,
      fact: "International collaborations produce 2x more impactful research outcomes",
      stat: "2x",
    },
    {
      icon: Award,
      fact: "75% of Nobel Prize winners collaborated with researchers from other institutions",
      stat: "75%",
    },
    {
      icon: Network,
      fact: "Researchers with diverse networks publish 40% more papers annually",
      stat: "40%",
    },
    {
      icon: BookOpen,
      fact: "Collaborative papers receive 3x more citations than solo-authored work",
      stat: "3x",
    },
  ]

  const researchTips = [
    {
      icon: Lightbulb,
      title: "Start with Shared Interests",
      tip: "Look for researchers who share your passion, not just your exact field",
    },
    {
      icon: Target,
      title: "Complementary Skills Matter",
      tip: "The best collaborations combine different expertise areas for stronger outcomes",
    },
    {
      icon: Users,
      title: "Build Long-term Relationships",
      tip: "Great collaborations often lead to multiple projects and lasting partnerships",
    },
    {
      icon: Globe,
      title: "Think Beyond Borders",
      tip: "International collaborations bring diverse perspectives and resources",
    },
    {
      icon: Network,
      title: "Leverage Your Network",
      tip: "Your collaborators' networks can introduce you to even more opportunities",
    },
  ]

  const successStories = [
    {
      title: "AI + Medicine Breakthrough",
      description: "Stanford CS professor + Johns Hopkins MD discovered new cancer treatment using ML",
      impact: "Published in Nature, 500+ citations",
    },
    {
      title: "Climate Science Revolution",
      description: "MIT engineer + Berkeley climatologist created revolutionary carbon capture tech",
      impact: "$50M funding, 3 patents filed",
    },
    {
      title: "Quantum Computing Advance",
      description: "IBM physicist + Oxford mathematician solved quantum error correction",
      impact: "Science cover story, industry adoption",
    },
  ]

  // Initialize network nodes
  useEffect(() => {
    const nodes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      connected: false,
    }))
    setNetworkNodes(nodes)
  }, [])

  // Progress simulation
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 0.8, 100) // Complete in ~2 minutes
        if (newProgress >= 100 && onComplete) {
          setTimeout(onComplete, 1000)
        }
        return newProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, onComplete])

  // Rotate facts and tips
  useEffect(() => {
    if (!isVisible) return

    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % researchFacts.length)
    }, 4000)

    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % researchTips.length)
    }, 6000)

    return () => {
      clearInterval(factInterval)
      clearInterval(tipInterval)
    }
  }, [isVisible])

  // Network animation
  useEffect(() => {
    if (!isVisible) return

    const networkInterval = setInterval(() => {
      setNetworkNodes((prev) =>
        prev.map((node, index) => ({
          ...node,
          connected: index <= Math.floor((progress / 100) * prev.length),
        })),
      )
      setAnimationPhase((prev) => (prev + 1) % 4)
    }, 2000)

    return () => clearInterval(networkInterval)
  }, [isVisible, progress])

  const getCurrentStageIndex = () => {
    return loadingStages.findIndex((stage) => stage.title === currentStage)
  }

  const currentStageIndex = getCurrentStageIndex()
  const currentStageData = loadingStages[currentStageIndex] || loadingStages[0]

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Main Progress Section */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Current Stage Display */}
            <div className="text-center mb-8">
              <div
                className={`w-20 h-20 ${currentStageData.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}
              >
                <currentStageData.icon className={`w-10 h-10 ${currentStageData.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStageData.title}</h2>
              <p className="text-gray-600">{currentStageData.description}</p>
            </div>

            {/* Progress Bar with Stages */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {loadingStages.map((stage, index) => {
                  const StageIcon = stage.icon
                  const isActive = index <= currentStageIndex
                  const isCurrent = index === currentStageIndex

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isActive ? `${stage.bgColor} ${stage.color} scale-110` : "bg-gray-100 text-gray-400 scale-100"
                        } ${isCurrent ? "animate-bounce" : ""}`}
                      >
                        <StageIcon className="w-6 h-6" />
                      </div>
                      <div className="w-16 h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isActive ? "bg-orange-500 w-full" : "bg-gray-200 w-0"
                          }`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <Progress value={progress} className="h-3 bg-gray-200" />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Starting analysis...</span>
                <span className="font-medium">{Math.round(progress)}% Complete</span>
                <span>Almost ready!</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Research Facts */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Research Insights</h3>
              </div>
              <div className="space-y-4">
                {researchFacts.map((item, index) => {
                  const ItemIcon = item.icon
                  const isActive = index === currentFactIndex

                  return (
                    <div
                      key={index}
                      className={`transition-all duration-500 ${
                        isActive ? "opacity-100 scale-100" : "opacity-30 scale-95"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <ItemIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {item.stat}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700">{item.fact}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Network Visualization */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Building Connections</h3>
              </div>
              <div className="relative h-48 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden">
                <svg className="w-full h-full">
                  {/* Connection Lines */}
                  {networkNodes.map((node, index) =>
                    networkNodes
                      .slice(index + 1)
                      .filter((_, i) => node.connected && networkNodes[index + i + 1]?.connected)
                      .map((targetNode, targetIndex) => (
                        <line
                          key={`${index}-${targetIndex}`}
                          x1={node.x}
                          y1={node.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke="#8B5CF6"
                          strokeWidth="1"
                          opacity="0.3"
                          className="animate-pulse"
                        />
                      )),
                  )}

                  {/* Nodes */}
                  {networkNodes.map((node, index) => (
                    <circle
                      key={node.id}
                      cx={node.x}
                      cy={node.y}
                      r={node.connected ? "6" : "4"}
                      fill={node.connected ? "#8B5CF6" : "#D1D5DB"}
                      className={`transition-all duration-500 ${node.connected ? "animate-pulse" : ""}`}
                    />
                  ))}
                </svg>

                {/* Floating Icons */}
                <div className="absolute inset-0 pointer-events-none">
                  <Microscope
                    className={`absolute top-4 left-4 w-6 h-6 text-purple-400 transition-all duration-1000 ${
                      animationPhase === 0 ? "scale-110 text-purple-600" : "scale-100"
                    }`}
                  />
                  <Laptop
                    className={`absolute top-8 right-8 w-6 h-6 text-purple-400 transition-all duration-1000 ${
                      animationPhase === 1 ? "scale-110 text-purple-600" : "scale-100"
                    }`}
                  />
                  <BookOpen
                    className={`absolute bottom-8 left-8 w-6 h-6 text-purple-400 transition-all duration-1000 ${
                      animationPhase === 2 ? "scale-110 text-purple-600" : "scale-100"
                    }`}
                  />
                  <Globe
                    className={`absolute bottom-4 right-4 w-6 h-6 text-purple-400 transition-all duration-1000 ${
                      animationPhase === 3 ? "scale-110 text-purple-600" : "scale-100"
                    }`}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Connecting {networkNodes.filter((n) => n.connected).length} of {networkNodes.length} research nodes
              </p>
            </CardContent>
          </Card>

          {/* Research Tips */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-gray-900">Collaboration Tips</h3>
              </div>
              <div className="space-y-4">
                {researchTips.map((tip, index) => {
                  const TipIcon = tip.icon
                  const isActive = index === currentTipIndex

                  return (
                    <div
                      key={index}
                      className={`transition-all duration-500 ${
                        isActive ? "opacity-100 scale-100" : "opacity-30 scale-95"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <TipIcon className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                          <p className="text-sm text-gray-600">{tip.tip}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories Carousel */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Success Stories</h3>
              <Badge variant="outline" className="ml-auto">
                While You Wait
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {successStories.map((story, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200"
                >
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600" />
                    {story.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">{story.description}</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    {story.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Encouraging Message */}
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold text-orange-600">Great things take time!</span> We're finding the perfect
            collaborators for you.
          </p>
          <p className="text-sm text-gray-500">
            Your research journey is about to get more exciting with the right partnerships.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreativeLoadingScreen

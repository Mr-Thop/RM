"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Users, BookOpen, Mail, Star, ExternalLink } from "lucide-react"
import SmartOutputRenderer from "@/components/smart-output-renderer"

interface CollaborationMatch {
  name: string
  title: string
  institution: string
  researchAreas: string[]
  publications: string[]
  email: string
  score: number
  reasoning: string
}

// Add this component before the main component
const ErrorDisplay: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <Card className="max-w-2xl mx-auto border-amber-200 bg-amber-50">
    <CardContent className="p-6 text-center">
      <div className="mb-4">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-amber-800 mb-2">Demo Mode Active</h3>
        <p className="text-amber-700">{error}</p>
      </div>
      <Button
        onClick={onRetry}
        variant="outline"
        className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
      >
        Try Again
      </Button>
    </CardContent>
  </Card>
)

export default function ResearchCollaborationPlatform() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<CollaborationMatch[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingStage, setLoadingStage] = useState("")
  const [apiOutput, setApiOutput] = useState<any>(null)

  const loadingStages = [
    "Analyzing your request...",
    "Searching research databases...",
    "Finding potential matches...",
    "Generating recommendations...",
    "Finalizing results...",
  ]

  const exampleQueries = [
    "Looking for machine learning researchers in healthcare applications",
    "Need collaborators for climate change research with data science expertise",
    "Seeking partners for interdisciplinary AI ethics studies",
    "Find co-authors for computer vision and robotics papers",
  ]

  const searchCollaborators = async (userQuery: string) => {
    if (!userQuery.trim()) return

    setLoading(true)
    setError(null)
    setResults(null)
    setApiOutput(null)

    // Simulate loading stages
    for (let i = 0; i < loadingStages.length; i++) {
      setLoadingStage(loadingStages[i])
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    try {
      // First try to check if the backend is available
      const healthCheck = await fetch("https://mr-thop-research-management.hf.space/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!healthCheck.ok) {
        throw new Error("Backend service is not available")
      }

      // Try the main API call - the backend route seems to be GET but expects JSON body
      // This is unusual but we'll try both approaches
      let response
      try {
        // First try POST (as originally intended)
        response = await fetch("https://mr-thop-research-management.hf.space/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userQuery }),
        })
      } catch (postError) {
        // If POST fails, try GET with query parameter
        response = await fetch(
          `https://mr-thop-research-management.hf.space/chat?query=${encodeURIComponent(userQuery)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      }

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Parse the AI response - the backend returns { "output": "AI response text" }
      if (data.output) {
        // Don't parse here - let SmartOutputRenderer handle it
        setResults([]) // Clear results to show SmartOutputRenderer
        setApiOutput(data.output) // Add this new state
      } else {
        throw new Error("No output received from API")
      }
    } catch (err) {
      console.error("API Error Details:", err)

      // Provide fallback mock data for demonstration
      const mockResults = generateMockResults(userQuery)
      setResults(mockResults)

      // Show a user-friendly error message
      setError("Using demo data - API connection failed. In production, this would show real researcher matches.")
    } finally {
      setLoading(false)
      setLoadingStage("")
    }
  }

  // Helper function to parse AI response into structured data
  const parseAIResponse = (aiOutput: string, query: string): CollaborationMatch[] => {
    // This will now be handled by SmartOutputRenderer
    // Return empty array to let the renderer handle everything
    return []
  }

  // Generate contextual mock results based on the query
  const generateMockResults = (query: string): CollaborationMatch[] => {
    const queryLower = query.toLowerCase()

    // Base researchers pool
    const allResearchers = [
      {
        name: "Dr. Sarah Chen",
        title: "Associate Professor of Computer Science",
        institution: "Stanford University",
        researchAreas: ["Machine Learning", "Healthcare AI", "Medical Imaging"],
        publications: [
          "Deep Learning for Medical Diagnosis (Nature, 2023)",
          "AI in Healthcare: Current Trends (JAMA, 2022)",
        ],
        email: "sarah.chen@stanford.edu",
        score: 95,
        reasoning: "Strong alignment in ML healthcare applications with 15+ relevant publications",
      },
      {
        name: "Prof. Michael Rodriguez",
        title: "Director of AI Research Lab",
        institution: "MIT",
        researchAreas: ["Computer Vision", "Medical AI", "Deep Learning"],
        publications: [
          "Automated Medical Image Analysis (Cell, 2023)",
          "Vision Transformers in Healthcare (ICCV, 2022)",
        ],
        email: "m.rodriguez@mit.edu",
        score: 88,
        reasoning: "Complementary expertise in computer vision with healthcare focus",
      },
      {
        name: "Dr. Emily Watson",
        title: "Climate Science Researcher",
        institution: "University of California, Berkeley",
        researchAreas: ["Climate Change", "Data Science", "Environmental Modeling"],
        publications: [
          "Climate Data Analysis with Machine Learning (Science, 2023)",
          "Predictive Models for Climate Change (Nature Climate Change, 2022)",
        ],
        email: "e.watson@berkeley.edu",
        score: 92,
        reasoning: "Expert in climate science with strong data science background",
      },
      {
        name: "Prof. David Kim",
        title: "Professor of Ethics and AI",
        institution: "Harvard University",
        researchAreas: ["AI Ethics", "Philosophy of Technology", "Responsible AI"],
        publications: [
          "Ethical Frameworks for AI Development (Ethics in Science, 2023)",
          "Bias in Machine Learning Systems (AI & Society, 2022)",
        ],
        email: "d.kim@harvard.edu",
        score: 90,
        reasoning: "Leading expert in AI ethics with interdisciplinary approach",
      },
      {
        name: "Dr. Lisa Zhang",
        title: "Senior Research Scientist",
        institution: "Google DeepMind",
        researchAreas: ["Computer Vision", "Robotics", "Reinforcement Learning"],
        publications: [
          "Vision-Language Models for Robotics (ICML, 2023)",
          "Multi-Modal Learning in Robotics (RSS, 2022)",
        ],
        email: "l.zhang@deepmind.com",
        score: 87,
        reasoning: "Industry expertise in computer vision and robotics applications",
      },
    ]

    // Filter and rank based on query content
    let relevantResearchers = allResearchers

    if (queryLower.includes("machine learning") || queryLower.includes("ml")) {
      relevantResearchers = allResearchers.filter((r) =>
        r.researchAreas.some((area) => area.toLowerCase().includes("machine learning")),
      )
    } else if (queryLower.includes("climate")) {
      relevantResearchers = allResearchers.filter((r) =>
        r.researchAreas.some((area) => area.toLowerCase().includes("climate")),
      )
    } else if (queryLower.includes("ethics")) {
      relevantResearchers = allResearchers.filter((r) =>
        r.researchAreas.some((area) => area.toLowerCase().includes("ethics")),
      )
    } else if (queryLower.includes("computer vision") || queryLower.includes("robotics")) {
      relevantResearchers = allResearchers.filter((r) =>
        r.researchAreas.some(
          (area) => area.toLowerCase().includes("computer vision") || area.toLowerCase().includes("robotics"),
        ),
      )
    }

    // Return top 3 matches
    return relevantResearchers.slice(0, 3)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchCollaborators(query)
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              AI-Powered Research Matching
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Perfect
              <span className="text-orange-600 block">Research Collaborator</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              AI-powered matching based on publications, expertise, and research interests. Connect with researchers
              worldwide and accelerate your research impact.
            </p>
          </div>

          {/* Search Interface */}
          <Card className="max-w-3xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe your research area, goals, or the type of collaborator you're seeking..."
                    className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-orange-400 rounded-xl resize-none"
                    disabled={loading}
                  />
                  <Search className="absolute top-4 right-4 w-5 h-5 text-gray-400" />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {loadingStage}
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Find Collaborators
                    </>
                  )}
                </Button>
              </form>

              {/* Example Queries */}
              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-4 font-medium">Try these example searches:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-sm bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 px-3 py-2 rounded-lg transition-colors duration-200"
                      disabled={loading}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {(results || error || apiOutput) && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Collaboration Matches</h2>

            {error && <ErrorDisplay error={error} onRetry={() => searchCollaborators(query)} />}

            {apiOutput && <SmartOutputRenderer output={apiOutput} />}

            {results && !apiOutput && (
              // Keep existing results display as fallback
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((match, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 bg-white"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-gray-900 mb-2">{match.name}</CardTitle>
                          <p className="text-orange-600 font-medium mb-1">{match.title}</p>
                          <p className="text-gray-600 text-sm">{match.institution}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                          <Star className="w-3 h-3 fill-current" />
                          {match.score}%
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Research Areas
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {match.researchAreas.map((area, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                            >
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Recent Publications</h4>
                        <ul className="space-y-1">
                          {match.publications.slice(0, 2).map((pub, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" />
                              {pub}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Why this match:</strong> {match.reasoning}
                        </p>
                      </div>

                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() =>
                          window.open(`mailto:${match.email}?subject=Research Collaboration Opportunity`, "_blank")
                        }
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Researcher
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Describe Your Research</h3>
              <p className="text-gray-600">
                Tell us about your research interests, goals, and the type of collaborator you're seeking.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes millions of publications and researcher profiles to find the best matches.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Connect & Collaborate</h3>
              <p className="text-gray-600">
                Get personalized recommendations and connect directly with potential collaborators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Need Help?</h2>
          <p className="text-gray-600 mb-8">
            Have questions about the platform or need assistance finding collaborators? We're here to help.
          </p>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
            onClick={() => window.open("mailto:support@researchcollab.ai?subject=Platform Support", "_blank")}
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Support
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Research Collaboration Platform. Powered by AI and academic data sources.
          </p>
        </div>
      </footer>
    </div>
  )
}

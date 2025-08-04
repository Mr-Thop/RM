"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, ExternalLink, BookOpen, Building, Star, Users, MapPin, Phone, Globe, FileText } from "lucide-react"

interface ContentPatterns {
  emails: string[]
  institutions: string[]
  publications: string[]
  researchers: string[]
  scores: string[]
  urls: string[]
  phoneNumbers: string[]
  locations: string[]
}

interface SmartOutputRendererProps {
  output: any
}

const SmartOutputRenderer: React.FC<SmartOutputRendererProps> = ({ output }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Content detection patterns
  const detectContentPatterns = (content: string): ContentPatterns => {
    const patterns = {
      emails: content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [],
      institutions:
        content.match(/\b(?:university|institute|college|research center|laboratory|lab)\b[^.!?]*[.!?]/gi) || [],
      publications: content.match(/(?:journal|paper|article|publication|doi|arxiv)[^.!?]*[.!?]/gi) || [],
      researchers: content.match(/(?:prof\.|dr\.|professor|researcher)[^.!?]*[.!?]/gi) || [],
      scores: content.match(/\b\d+(?:\.\d+)?%?\b/g) || [],
      urls: content.match(/https?:\/\/[^\s]+/g) || [],
      phoneNumbers: content.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g) || [],
      locations:
        content.match(/\b(?:USA|US|United States|UK|Canada|Germany|France|Japan|China|Australia)[^.!?]*[.!?]/gi) || [],
    }
    return patterns
  }

  // Main rendering logic
  const renderOutput = (data: any): React.ReactNode => {
    // 1. Try JSON parsing first if string
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data)
        return renderStructuredData(parsed)
      } catch {
        return renderTextContent(data)
      }
    }

    // 2. Handle objects/arrays
    if (typeof data === "object" && data !== null) {
      return renderStructuredData(data)
    }

    // 3. Fallback to text
    return renderTextContent(String(data))
  }

  // Text content renderer with smart parsing
  const renderTextContent = (text: string): React.ReactNode => {
    const patterns = detectContentPatterns(text)
    const sections = parseTextIntoSections(text)

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        {(patterns.emails.length > 0 || patterns.researchers.length > 0 || patterns.institutions.length > 0) && (
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 text-sm">
                {patterns.researchers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">{patterns.researchers.length} Researchers</span>
                  </div>
                )}
                {patterns.institutions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">{patterns.institutions.length} Institutions</span>
                  </div>
                )}
                {patterns.publications.length > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">{patterns.publications.length} Publications</span>
                  </div>
                )}
                {patterns.emails.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">{patterns.emails.length} Contacts</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Sections */}
        {sections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="prose prose-gray max-w-none">{renderEnhancedText(section, patterns)}</div>
            </CardContent>
          </Card>
        ))}

        {/* Extracted Information Cards */}
        {patterns.emails.length > 0 && <ContactCard emails={patterns.emails} />}
      </div>
    )
  }

  // Enhanced text rendering with pattern highlighting
  const renderEnhancedText = (text: string, patterns: ContentPatterns): React.ReactNode => {
    let processedText = text

    // Replace emails with clickable links
    patterns.emails.forEach((email) => {
      processedText = processedText.replace(
        new RegExp(email, "g"),
        `<a href="mailto:${email}" class="text-orange-600 hover:text-orange-700 font-medium">${email}</a>`,
      )
    })

    // Replace URLs with clickable links
    patterns.urls.forEach((url) => {
      processedText = processedText.replace(
        new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 font-medium">${url}</a>`,
      )
    })

    // Highlight researcher names
    patterns.researchers.forEach((researcher) => {
      const cleanName = researcher.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      processedText = processedText.replace(
        new RegExp(cleanName, "gi"),
        `<span class="bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">${researcher}</span>`,
      )
    })

    // Convert bullet points to proper lists
    if (processedText.includes("•") || processedText.includes("-")) {
      const lines = processedText.split("\n")
      const listItems = lines.filter((line) => line.trim().startsWith("•") || line.trim().startsWith("-"))

      if (listItems.length > 0) {
        const listHtml = listItems.map((item) => `<li class="mb-2">${item.replace(/^[•-]\s*/, "")}</li>`).join("")

        processedText = processedText.replace(
          listItems.join("\n"),
          `<ul class="list-disc list-inside space-y-2 my-4">${listHtml}</ul>`,
        )
      }
    }

    return <div dangerouslySetInnerHTML={{ __html: processedText }} />
  }

  // Structured data renderer
  const renderStructuredData = (data: any): React.ReactNode => {
    if (Array.isArray(data)) {
      return renderArrayData(data)
    }

    if (typeof data === "object") {
      return renderObjectData(data)
    }

    return renderTextContent(String(data))
  }

  // Array data renderer
  const renderArrayData = (data: any[]): React.ReactNode => {
    // Detect if it's a list of researchers/collaborators
    if (data.some((item) => typeof item === "object" && (item.name || item.researcher || item.author || item.email))) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <ResearcherCard key={index} data={item} />
          ))}
        </div>
      )
    }

    // Generic array rendering
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">{renderOutput(item)}</CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Object data renderer
  const renderObjectData = (data: any): React.ReactNode => {
    const keys = Object.keys(data)

    // Check if it looks like a researcher profile
    if (
      keys.some((key) => ["name", "email", "institution", "publications", "research_areas"].includes(key.toLowerCase()))
    ) {
      return <ResearcherCard data={data} />
    }

    // Generic object rendering
    return (
      <div className="space-y-4">
        {keys.map((key) => (
          <Card key={key} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg capitalize flex items-center gap-2">
                {getIconForKey(key)}
                {formatKey(key)}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderOutput(data[key])}</CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Helper functions
  const parseTextIntoSections = (text: string): string[] => {
    // Split by double line breaks or clear section markers
    const sections = text.split(/\n\s*\n|\n(?=\d+\.|\*\*|##)/).filter((section) => section.trim())
    return sections.length > 1 ? sections : [text]
  }

  const formatKey = (key: string): string => {
    return key.replace(/[_-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getIconForKey = (key: string): React.ReactNode => {
    const keyLower = key.toLowerCase()
    if (keyLower.includes("name") || keyLower.includes("researcher")) return <User className="w-4 h-4" />
    if (keyLower.includes("email") || keyLower.includes("contact")) return <Mail className="w-4 h-4" />
    if (keyLower.includes("institution") || keyLower.includes("university")) return <Building className="w-4 h-4" />
    if (keyLower.includes("publication") || keyLower.includes("paper")) return <BookOpen className="w-4 h-4" />
    if (keyLower.includes("score") || keyLower.includes("rating")) return <Star className="w-4 h-4" />
    if (keyLower.includes("location") || keyLower.includes("address")) return <MapPin className="w-4 h-4" />
    if (keyLower.includes("phone")) return <Phone className="w-4 h-4" />
    if (keyLower.includes("website") || keyLower.includes("url")) return <Globe className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <div className="space-y-6">
      <ErrorBoundary fallback={<GenericTextDisplay output={output} />}>{renderOutput(output)}</ErrorBoundary>
    </div>
  )
}

// Specialized components
const ResearcherCard: React.FC<{ data: any }> = ({ data }) => {
  const name = data.name || data.researcher || data.author || "Unknown Researcher"
  const email = data.email || data.contact || ""
  const institution = data.institution || data.university || data.affiliation || ""
  const publications = data.publications || data.papers || []
  const researchAreas = data.research_areas || data.areas || data.fields || []
  const score = data.score || data.rating || data.match_score || null

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              {name}
            </CardTitle>
            {institution && (
              <p className="text-orange-600 font-medium mb-1 flex items-center gap-2">
                <Building className="w-4 h-4" />
                {institution}
              </p>
            )}
          </div>
          {score && (
            <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
              <Star className="w-3 h-3 fill-current" />
              {score}%
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {researchAreas.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Research Areas
            </h4>
            <div className="flex flex-wrap gap-1">
              {researchAreas.map((area: string, i: number) => (
                <Badge key={i} variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {publications.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Recent Publications</h4>
            <ul className="space-y-1">
              {publications.slice(0, 3).map((pub: string, i: number) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" />
                  {pub}
                </li>
              ))}
            </ul>
          </div>
        )}

        {email && (
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => window.open(`mailto:${email}?subject=Research Collaboration Opportunity`, "_blank")}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Researcher
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

const ContactCard: React.FC<{ emails: string[] }> = ({ emails }) => (
  <Card className="bg-blue-50 border-blue-200">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Mail className="w-5 h-5 text-blue-600" />
        Contact Information
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {emails.map((email, index) => (
          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
            <span className="font-medium">{email}</span>
            <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${email}`, "_blank")}>
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

const GenericTextDisplay: React.FC<{ output: any }> = ({ output }) => (
  <Card className="bg-gray-50 border-gray-200">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <FileText className="w-5 h-5 text-gray-600" />
        Raw Output
      </CardTitle>
    </CardHeader>
    <CardContent>
      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-4 rounded-lg overflow-auto">
        {typeof output === "string" ? output : JSON.stringify(output, null, 2)}
      </pre>
    </CardContent>
  </Card>
)

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("SmartOutputRenderer Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export default SmartOutputRenderer

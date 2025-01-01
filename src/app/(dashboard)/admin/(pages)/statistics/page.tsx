"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'


export default function Statistics() {
  const [response, setResponse] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // Prepare data for the chart
  const chartData = [
    { rating: "1 Star", count: 1 },
    { rating: "2 Stars", count: 1 },
    { rating: "3 Stars", count: 1 },
    { rating: "4 Stars", count: 0 },
    { rating: "5 Stars", count: 1 },
  ]

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-feedbacks/")
      if (response.ok) {
        const data = await response.json()
        setResponse(data)
        setLoading(false)
      } else {
        console.error("Error fetching feedback")
      }
    } catch (error) {
      console.error("Error:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-7xl">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Summary Card */}
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Quick overview of feedback statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-medium">Average Rating: 2.75/5</p>
              <p className="text-sm text-muted-foreground">Based on 4 total reviews</p>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution Card */}
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of ratings by star count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Suggested actions based on user feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Implement a review mechanism to confirm if there were any mistakes in user ratings.</li>
            <li>Educate users on the rating scale to ensure they understand that higher numbers indicate better reviews.</li>
            <li>Engage with users who provided low ratings to understand their concerns better.</li>
            <li>Encourage more descriptive feedback, especially for lower ratings.</li>
            <li>Consider revising the feedback collection process to gather more detailed information.</li>
            <li>Investigate the discrepancy between positive comments and low ratings.</li>
            <li>Explore potential usability issues that might not be apparent from the current feedback.</li>
            <li>Conduct user interviews or surveys to gain deeper insights into user experiences.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Detailed Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
          <CardDescription>Comprehensive feedback analysis report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {response.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


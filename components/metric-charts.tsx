"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MetricsChartsProps {
  biotechData: any[]
  drugPipelineData: any[]
  clinicalTrialsData: any[]
}

export default function MetricsCharts({ biotechData, drugPipelineData, clinicalTrialsData }: MetricsChartsProps) {
  const [activeTab, setActiveTab] = useState("categories")

  // Prepare data for category distribution chart
  const prepareCategoryData = () => {
    const categoryCounts = {}

    biotechData.forEach((item) => {
      if (item.Category) {
        categoryCounts[item.Category] = (categoryCounts[item.Category] || 0) + 1
      }
    })

    return Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 10) // Top 10 categories
  }

  // Prepare data for city distribution chart
  const prepareCityData = () => {
    const cityCounts = {}

    biotechData.forEach((item) => {
      if (item.City) {
        cityCounts[item.City] = (cityCounts[item.City] || 0) + 1
      }
    })

    return Object.entries(cityCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 10) // Top 10 cities
  }

  // Prepare data for drug phase distribution chart
  const prepareDrugPhaseData = () => {
    const phaseCounts = {}

    drugPipelineData.forEach((item) => {
      if (item.phase) {
        phaseCounts[item.phase] = (phaseCounts[item.phase] || 0) + 1
      }
    })

    return Object.entries(phaseCounts).map(([name, value]) => ({ name, value }))
  }

  // Prepare data for clinical trial status chart
  const prepareTrialStatusData = () => {
    const statusCounts = {}

    clinicalTrialsData.forEach((item) => {
      if (item["Overall Recruitment Status"]) {
        statusCounts[item["Overall Recruitment Status"]] = (statusCounts[item["Overall Recruitment Status"]] || 0) + 1
      }
    })

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  }

  const categoryData = prepareCategoryData()
  const cityData = prepareCityData()
  const drugPhaseData = prepareDrugPhaseData()
  const trialStatusData = prepareTrialStatusData()

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#8DD1E1",
    "#A4DE6C",
    "#D0ED57",
  ]

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="cities">Cities</TabsTrigger>
        <TabsTrigger value="drugPhases">Drug Phases</TabsTrigger>
        <TabsTrigger value="trialStatus">Trial Status</TabsTrigger>
      </TabsList>

      <TabsContent value="categories">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Number of Companies" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="cities">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityData} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Number of Companies" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="drugPhases">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={drugPhaseData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {drugPhaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="trialStatus">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trialStatusData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {trialStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}


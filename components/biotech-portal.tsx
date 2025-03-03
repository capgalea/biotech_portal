"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FilterControls from "@/components/filter-controls"
import CompanyMap from "@/components/company-map"
import CompanyTable from "@/components/company-table"
import DrugPipelineTable from "@/components/drug-pipeline-table"
import ClinicalTrialsTable from "@/components/clinical-trials-table"
import MetricsCharts from "@/components/metrics-charts"
import { fetchBiotechData, fetchClinicalTrialsData, fetchDrugPipelineData } from "@/lib/data"

export default function BiotechPortal() {
  const [biotechData, setBiotechData] = useState([])
  const [drugPipelineData, setDrugPipelineData] = useState([])
  const [clinicalTrialsData, setClinicalTrialsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    company: "",
    city: "",
    category: "",
    disease: "",
  })

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [biotech, drugPipeline, clinicalTrials] = await Promise.all([
          fetchBiotechData(),
          fetchDrugPipelineData(),
          fetchClinicalTrialsData(),
        ])

        setBiotechData(biotech)
        setDrugPipelineData(drugPipeline)
        setClinicalTrialsData(clinicalTrials)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter data based on selected filters
  const filteredBiotechData = biotechData.filter((item) => {
    return (
      (filters.company === "" || item.Companies?.toLowerCase().includes(filters.company.toLowerCase())) &&
      (filters.city === "" || item.City?.toLowerCase() === filters.city.toLowerCase()) &&
      (filters.category === "" || item.Category?.toLowerCase() === filters.category.toLowerCase())
    )
  })

  const filteredDrugPipelineData = drugPipelineData.filter((item) => {
    return (
      (filters.company === "" || item.company?.toLowerCase().includes(filters.company.toLowerCase())) &&
      (filters.disease === "" || item.description?.toLowerCase().includes(filters.disease.toLowerCase()))
    )
  })

  const filteredClinicalTrialsData = clinicalTrialsData.filter((item) => {
    return (
      (filters.company === "" ||
        item["Organization Full Name"]?.toLowerCase().includes(filters.company.toLowerCase())) &&
      (filters.disease === "" ||
        item["Brief Title"]?.toLowerCase().includes(filters.disease.toLowerCase()) ||
        item["Conditions"]?.toLowerCase().includes(filters.disease.toLowerCase()))
    )
  })

  // Get unique values for filters
  const getUniqueValues = (data, field) => {
    if (!data || !data.length) return []
    const values = data.map((item) => item[field]).filter(Boolean)
    return [...new Set(values)].sort()
  }

  const companies = getUniqueValues(biotechData, "Companies")
  const cities = getUniqueValues(biotechData, "City")
  const categories = getUniqueValues(biotechData, "Category")

  // Extract diseases from drug pipeline descriptions and clinical trial conditions
  const extractDiseases = () => {
    const diseaseSet = new Set()

    drugPipelineData.forEach((item) => {
      if (item.description) {
        const words = item.description.split(/\s+/)
        words.forEach((word) => {
          if (word.length > 5 && /^[A-Z]/.test(word)) {
            diseaseSet.add(word.replace(/[.,;:]/g, ""))
          }
        })
      }
    })

    clinicalTrialsData.forEach((item) => {
      if (item.Conditions) {
        const conditions = item.Conditions.split(",")
        conditions.forEach((condition) => {
          condition = condition.trim()
          if (condition) {
            diseaseSet.add(condition)
          }
        })
      }
    })

    return [...diseaseSet].sort()
  }

  const diseases = extractDiseases()

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      company: "",
      city: "",
      category: "",
      disease: "",
    })
  }

  if (loading) {
    return <div className="p-8 text-center">Loading biotech data...</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Biotech Industry Portal</h1>

      <FilterControls
        companies={companies}
        cities={cities}
        categories={categories}
        diseases={diseases}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Locations</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <CompanyMap data={filteredBiotechData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industry Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricsCharts
              biotechData={filteredBiotechData}
              drugPipelineData={filteredDrugPipelineData}
              clinicalTrialsData={filteredClinicalTrialsData}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="companies">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="drugPipelines">Drug Pipelines</TabsTrigger>
          <TabsTrigger value="clinicalTrials">Clinical Trials</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyTable data={filteredBiotechData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drugPipelines" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Drug Pipeline Information</CardTitle>
            </CardHeader>
            <CardContent>
              <DrugPipelineTable data={filteredDrugPipelineData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinicalTrials" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Trials Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ClinicalTrialsTable data={filteredClinicalTrialsData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


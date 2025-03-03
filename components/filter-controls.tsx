"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FilterControlsProps {
  companies: string[]
  cities: string[]
  categories: string[]
  diseases: string[]
  filters: {
    company: string
    city: string
    category: string
    disease: string
  }
  onFilterChange: (filterType: string, value: string) => void
  onResetFilters: () => void
}

export default function FilterControls({
  companies,
  cities,
  categories,
  diseases,
  filters,
  onFilterChange,
  onResetFilters,
}: FilterControlsProps) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company-select">Company</Label>
          <Select value={filters.company} onValueChange={(value) => onFilterChange("company", value)}>
            <SelectTrigger id="company-select">
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city-select">City</Label>
          <Select value={filters.city} onValueChange={(value) => onFilterChange("city", value)}>
            <SelectTrigger id="city-select">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category-select">Business Category</Label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange("category", value)}>
            <SelectTrigger id="category-select">
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
          <Label htmlFor="disease-select">Disease</Label>
          <Select value={filters.disease} onValueChange={(value) => onFilterChange("disease", value)}>
            <SelectTrigger id="disease-select">
              <SelectValue placeholder="All Diseases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Diseases</SelectItem>
              {diseases.map((disease) => (
                <SelectItem key={disease} value={disease}>
                  {disease}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onResetFilters} className="flex items-center gap-2">
          Reset Filters
        </Button>
      </div>
    </div>
  )
}


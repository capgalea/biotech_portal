// Function to fetch biotech company data
export async function fetchBiotechData() {
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bioTech_data-6hrJP7nwyvQbZ4nnJpk4n0CVWYPzQa.csv",
      )
      const csvText = await response.text()
      return parseCSV(csvText)
    } catch (error) {
      console.error("Error fetching biotech data:", error)
      return []
    }
  }
  
  // Function to fetch drug pipeline data
  export async function fetchDrugPipelineData() {
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Drug_Pipelines-cYgCD7KcDR0DPbWIOHr5jz60X1ZoH3.csv",
      )
      const csvText = await response.text()
      return parseCSV(csvText)
    } catch (error) {
      console.error("Error fetching drug pipeline data:", error)
      return []
    }
  }
  
  // Function to fetch clinical trials data
  export async function fetchClinicalTrialsData() {
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clinical_trials-0jM09P8SssU9ONKPpHTUadkJy4fp7V.csv",
      )
      const csvText = await response.text()
      return parseCSV(csvText)
    } catch (error) {
      console.error("Error fetching clinical trials data:", error)
      return []
    }
  }
  
  // Helper function to parse CSV data
  function parseCSV(csvText: string) {
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((header) => header.trim().replace(/^"|"$/g, ""))
  
    const result = []
  
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
  
      // Handle quoted fields with commas inside them
      const row: Record<string, string> = {}
      let currentPosition = 0
      let fieldValue = ""
      let insideQuotes = false
  
      for (let j = 0; j < headers.length; j++) {
        // Skip to the next field if we've reached the end of the line
        if (currentPosition >= lines[i].length) {
          row[headers[j]] = ""
          continue
        }
  
        fieldValue = ""
        insideQuotes = false
  
        // Check if the field starts with a quote
        if (lines[i][currentPosition] === '"') {
          insideQuotes = true
          currentPosition++
        }
  
        while (
          currentPosition < lines[i].length &&
          (insideQuotes || (lines[i][currentPosition] !== "," && currentPosition < lines[i].length))
        ) {
          // Handle escaped quotes
          if (insideQuotes && lines[i][currentPosition] === '"' && lines[i][currentPosition + 1] === '"') {
            fieldValue += '"'
            currentPosition += 2
            continue
          }
  
          // End of quoted field
          if (insideQuotes && lines[i][currentPosition] === '"') {
            insideQuotes = false
            currentPosition++
            continue
          }
  
          fieldValue += lines[i][currentPosition]
          currentPosition++
        }
  
        // Move past the comma
        currentPosition++
  
        row[headers[j]] = fieldValue.trim()
      }
  
      result.push(row)
    }
  
    return result
  }
  
  
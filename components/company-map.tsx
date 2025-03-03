"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

// Fix Leaflet marker icon issue
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

interface CompanyMapProps {
  data: any[]
}

export default function CompanyMap({ data }: CompanyMapProps) {
  const mapRef = useRef(null)

  useEffect(() => {
    fixLeafletIcon()
  }, [])

  // Filter out entries without valid coordinates
  const validData = data.filter(
    (item) =>
      item.Latitude &&
      item.Longitude &&
      !isNaN(Number.parseFloat(item.Latitude)) &&
      !isNaN(Number.parseFloat(item.Longitude)),
  )

  // Calculate map center based on available data
  const getMapCenter = () => {
    if (validData.length === 0) {
      // Default to Australia if no valid data
      return [-25.2744, 133.7751]
    }

    // Calculate average of coordinates
    const sumLat = validData.reduce((sum, item) => sum + Number.parseFloat(item.Latitude), 0)
    const sumLng = validData.reduce((sum, item) => sum + Number.parseFloat(item.Longitude), 0)

    return [sumLat / validData.length, sumLng / validData.length]
  }

  const mapCenter = getMapCenter()
  const defaultZoom = 4

  if (typeof window === "undefined") {
    return <div className="h-full bg-muted flex items-center justify-center">Map loading...</div>
  }

  return (
    <div className="h-full w-full">
      {validData.length > 0 ? (
        <MapContainer
          center={mapCenter as [number, number]}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validData.map((item, index) => (
            <Marker
              key={`${item.Companies}-${index}`}
              position={[Number.parseFloat(item.Latitude), Number.parseFloat(item.Longitude)]}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{item.Companies}</h3>
                  <p className="text-muted-foreground">{item.Category}</p>
                  <p>{item.Location}</p>
                  <p>{item.City}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mt-1 block"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div className="h-full bg-muted flex items-center justify-center">
          No location data available for the selected filters
        </div>
      )}
    </div>
  )
}


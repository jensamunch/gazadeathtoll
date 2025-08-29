'use client'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState } from 'react'

// Default marker icon fix for Leaflet when bundled
const defaultIcon = new L.Icon({
  iconUrl:
    typeof window !== 'undefined'
      ? 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
      : '',
  iconRetinaUrl:
    typeof window !== 'undefined'
      ? 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'
      : '',
  shadowUrl:
    typeof window !== 'undefined'
      ? 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      : '',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = defaultIcon

type Props = {
  lat: number
  lon: number
  onChange: (pos: { lat: number; lon: number }) => void
}

function ClickHandler({ onChange }: { onChange: Props['onChange'] }) {
  useMapEvents({
    click: (e) => onChange({ lat: e.latlng.lat, lon: e.latlng.lng }),
  })
  return null
}

export function LeafletPicker({ lat, lon, onChange }: Props) {
  const [pos, setPos] = useState<{ lat: number; lon: number }>({ lat, lon })

  const handleChange = (p: { lat: number; lon: number }) => {
    setPos(p)
    onChange(p)
  }

  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border">
      <MapContainer center={[31.5, 34.45]} zoom={11} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[pos.lat, pos.lon]}
          draggable
          eventHandlers={{
            dragend: (e) =>
              handleChange({ lat: e.target.getLatLng().lat, lon: e.target.getLatLng().lng }),
          }}
        />
        <ClickHandler onChange={handleChange} />
      </MapContainer>
    </div>
  )
}

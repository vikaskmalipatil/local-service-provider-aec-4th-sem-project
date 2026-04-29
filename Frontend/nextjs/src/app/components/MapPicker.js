"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultCenter = [13.3409, 74.7421];

function FixMap() {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);

    return null;
}

function LocationMarker({ onSelect }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            const pos = [lat, lng];

            setPosition(pos);
            onSelect({ lat, lng });
        },
    });

    return position ? <Marker position={position} draggable /> : null;
}

export default function MapPicker({ onSelect }) {
    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FixMap />
            <LocationMarker onSelect={onSelect} />
        </MapContainer>
    );
}
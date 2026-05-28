"use client";

import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";

import { useState, useEffect } from "react";
import L from "leaflet";

// Fix marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultCenter: [number, number] = [13.3409, 74.7421];

function FixMap() {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);

    return null;
}

function LocationMarker({
    onSelect,
    defaultLocation,
}: {
    onSelect?: (location: { lat: number; lng: number }) => void;
    defaultLocation?: [number, number] | null;
}) {
    const [position, setPosition] = useState<[number, number] | null>(
        defaultLocation || null
    );

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            const pos: [number, number] = [lat, lng];

            setPosition(pos);

            if (onSelect) {
                onSelect({ lat, lng });
            }
        },
    });

    useEffect(() => {
        if (defaultLocation) {
            setPosition(defaultLocation);
        }
    }, [defaultLocation]);

    return position ? <Marker position={position} draggable /> : null;
}

export default function MapPicker({
    onSelect,
    defaultLocation,
}: {
    onSelect?: (location: { lat: number; lng: number }) => void;
    defaultLocation?: [number, number] | null;
}) {
    return (
        <div style={{ zIndex: 10, position: "relative" }}>
            <MapContainer
                center={defaultLocation || defaultCenter}
                zoom={13}
                style={{
                    height: "300px",
                    width: "100%",
                    borderRadius: "0.5rem",
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FixMap />

                <LocationMarker
                    onSelect={onSelect}
                    defaultLocation={defaultLocation}
                />
            </MapContainer>
        </div>
    );
}
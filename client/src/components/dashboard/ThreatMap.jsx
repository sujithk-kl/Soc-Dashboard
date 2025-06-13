// client/src/components/dashboard/ThreatMap.jsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Card from '../ui/Card';

// Helper to create custom colored markers based on severity
const getMarkerIcon = (severity) => {
    let color;
    switch (severity) {
        case 'critical':
            color = 'var(--danger)';
            break;
        case 'high':
            color = 'var(--warning)';
            break;
        case 'medium':
            color = 'var(--info)';
            break;
        default:
            color = 'var(--gray)';
    }
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="map-marker" style="background-color: ${color};"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24] // Point of the marker
    });
};

// A component for the marker that includes a self-removing timeout for a cool effect
const FadingMarker = ({ marker }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 15000); // Marker disappears after 15 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <Marker position={marker.pos} icon={getMarkerIcon(marker.severity)}>
            <Popup>
                <b>{marker.title}</b><br />Severity: {marker.severity}
            </Popup>
        </Marker>
    );
};

const ThreatMap = ({ markers }) => { // <-- Receive markers as a prop
    return (
        <Card title="Global Threat Map">
            <div className="h-[300px] rounded-lg overflow-hidden">
                <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {/* Map over the markers from props */}
                    {markers.map(marker => (
                        <FadingMarker key={marker.id} marker={marker} />
                    ))}
                </MapContainer>
            </div>
        </Card>
    );
};

export default ThreatMap;
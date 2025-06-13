import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Card from '../ui/Card';

// Dummy data for threats
const threats = [
    { id: 1, pos: [40.7128, -74.0060], severity: 'critical', title: 'DDoS Attack' },
    { id: 2, pos: [51.5074, -0.1278], severity: 'high', title: 'Data Breach' },
    { id: 3, pos: [35.6895, 139.6917], severity: 'critical', title: 'Ransomware' },
];

const getMarkerIcon = (severity) => {
    const color = severity === 'critical' ? 'var(--danger)' : 'var(--warning)';
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="map-marker" style="background-color: ${color};"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });
};

const ThreatMap = () => {
    return (
        <Card title="Global Threat Map">
            <div className="h-[300px] rounded-lg overflow-hidden">
                <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {threats.map(threat => (
                        <Marker key={threat.id} position={threat.pos} icon={getMarkerIcon(threat.severity)}>
                            <Popup>
                                <b>{threat.title}</b><br />Severity: {threat.severity}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </Card>
    );
};

export default ThreatMap;
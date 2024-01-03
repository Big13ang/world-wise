import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';

import { useCities } from '../contexts/CitiesContext';
import { PropTypes } from 'prop-types';

function Map() {
    const [searchParams] = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    const [mapPosition, setMapPosition] = useState([4, 0]);
    const { cities } = useCities();

    useEffect(() => {
        if (!lat || !lng) return;
        const currentPosition = [lat, lng];

        setMapPosition(currentPosition);
    }, [lat, lng, setMapPosition])

    return (
        <div className={styles.mapContainer} >
            <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.mapContainer}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map(city => {
                    return (<Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                        <Popup>
                            <span>{city.emoji}</span>
                            <span>{city.cityName}</span>
                        </Popup>
                    </Marker>)
                })}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    )
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    });
}

ChangeCenter.propTypes = {
    position: PropTypes.array,
};

export default Map
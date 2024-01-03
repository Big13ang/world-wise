import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { PropTypes } from 'prop-types';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';


function Map() {
    const { cities } = useCities();
    const [searchParams] = useSearchParams();
    const [mapPosition, setMapPosition] = useState([4, 0]);
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition: getGeolocationPosition
    } = useGeolocation();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    useEffect(() => {
        if (!lat || !lng) return;
        const currentPosition = [lat, lng];

        setMapPosition(currentPosition);
    }, [lat, lng, setMapPosition]);


    useEffect(() => {
        if (!geolocationPosition) return;
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }, [geolocationPosition]);

    return (
        <div className={styles.mapContainer} >
            {!geolocationPosition && <Button type='position' onClick={getGeolocationPosition}>
                {isLoadingPosition ? 'Loading ...' : "Use your position"}
            </Button>}
            <MapContainer center={mapPosition} zoom={13} scrollWheelZoom={true} className={styles.mapContainer}>
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
    map.flyTo(position, map.getZoom())

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
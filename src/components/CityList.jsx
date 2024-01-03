/* eslint-disable react/prop-types */

import styles from './CityList.module.css'
import Spinner from './Spinner';
import CityItem from './CityItem';
import PropTypes from 'prop-types';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';

function CityList() {
    const { isLoading, cities } = useCities();
    if (isLoading) return <Spinner />
    if (!cities.length) return <Message message="Add your first city by a city on the map" />
    return (
        <ul className={styles.cityList}>
            {cities.map(city => <CityItem city={city} key={city.id} />)}
        </ul>
    );
}

CityList.propTypes = {
    isLoading: PropTypes.bool,
    cities: PropTypes.array,
    message: PropTypes.string,
};

export default CityList

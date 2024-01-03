/* eslint-disable react/prop-types */

import styles from './CountryList.module.css'
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import PropTypes from 'prop-types';
import Message from './Message';

function CountryList({ isLoading, cities }) {
    if (isLoading) return <Spinner />
    if (!cities.length) return <Message message="Add your first Country by a Country on the map" />
    const countries = cities.reduce((arr, city) => {
        if (!arr.map(el => el.country).includes(city.country)) {
            return [...arr, { country: city.country, emoji: city.emoji }];
        } else return arr;
    }, []);
    return (
        <ul className={styles.countryList}>
            {countries.map(country => <CountryItem country={country} key={country.country} />)}
        </ul>
    );
}

CountryList.propTypes = {
    isLoading: PropTypes.bool,
    cities: PropTypes.array,
    message: PropTypes.string,
};

export default CountryList

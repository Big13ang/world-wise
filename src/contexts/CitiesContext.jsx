import { createContext, useContext, useState, useEffect } from "react";
import { PropTypes } from 'prop-types';

const CitiesContext = createContext();

const BASE_URL = 'http://localhost:9000';

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data);
            } catch (error) {
                alert('There is an error to loading data ...');
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities();
    }, [setIsLoading, setCities]);

    const getCity = id => {
        const fetchCity = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                setCurrentCity(data);
            } catch (error) {
                alert('There is an error to loading data ...');
            } finally {
                setIsLoading(false);
            }
        }
        fetchCity();
    }

    const createCity = newCity => {
        const postCity = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`, {
                    method: "POST",
                    body: JSON.stringify(newCity),
                    headers: {
                        "Content-Type": "Application/json"
                    }
                });
                const data = await res.json();
                setCities(cities => [...cities, data]);
            } catch (error) {
                alert('There is an error to loading data ...');
            } finally {
                setIsLoading(false);
            }
        }
        postCity();
    }

    const deleteCity = async id => {
        try {
            setIsLoading(true);
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE"
            });
            setCities(cities => cities.filter(city => city.id !== id));
        } catch (error) {
            alert('There was an erorr deleting city !');
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <CitiesContext.Provider value={{
            cities,
            isLoading,
            getCity,
            currentCity,
            createCity,
            deleteCity
        }}>
            {children}
        </CitiesContext.Provider>
    )
}

function useCities() {
    const value = useContext(CitiesContext);
    if (value === undefined) throw new Error('Your using useCities out of its scope !!!');
    return value;
}


CitiesProvider.propTypes = {
    children: PropTypes.any,
};

export { CitiesProvider, useCities };
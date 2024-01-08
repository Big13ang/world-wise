import { createContext, useContext, useEffect, useReducer } from "react";
import { PropTypes } from 'prop-types';

const CitiesContext = createContext();

const BASE_URL = 'https://json-server-khaki.vercel.app';

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    erorr: ""
}

const CitiesReducer = (state, action) => {

    switch (action.type) {
        case 'loading':
            return {
                ...state,
                isLoading: true
            }
        case 'cities/loaded':
            return {
                ...state,
                isLoading: false,
                cities: action.payload
            }
        case 'city/loaded':
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload
            }
        case 'city/created':
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload,
                cities: [...state.cities, action.payload]
            }
        case 'city/deleted':
            return {
                ...state,
                isLoading: false,
                currentCity: {},
                cities: state.cities.filter(city => city.id !== action.payload)
            }
        case 'rejected':
            return {
                ...state,
                isLoading: false,
                currentCity: {},
                error: action.payload
            }
        default:
            throw new Error('unknown action !');
    }
}

function CitiesProvider({ children }) {
    const [{ cities, isLoading, currentCity }, dispatch] = useReducer(CitiesReducer, initialState);

    useEffect(() => {
        const fetchCities = async () => {
            dispatch({ type: 'loading' });
            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                dispatch({ type: 'cities/loaded', payload: data });
            } catch (error) {
                dispatch({ type: 'rejected', payload: 'There is an error to load cities data ...' })
            }
        }
        fetchCities();
    }, [dispatch]);

    const getCity = id => {
        if (Number(id) === Number(currentCity.id)) return;

        const fetchCity = async () => {
            dispatch({ type: 'loading' });
            try {
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                console.log("City/loaded", data);
                dispatch({ type: 'city/loaded', payload: data });
            } catch (error) {
                dispatch({ type: 'rejected', payload: 'There is an error to load city data ...' })
            }
        }
        fetchCity();
    }

    const createCity = newCity => {
        const postCity = async () => {
            dispatch({ type: 'loading' });
            try {
                const res = await fetch(`${BASE_URL}/cities`, {
                    method: "POST",
                    body: JSON.stringify(newCity),
                    headers: {
                        "Content-Type": "Application/json"
                    }
                });
                const data = await res.json();
                dispatch({ type: 'city/created', payload: data })
            } catch (error) {
                dispatch({ type: 'rejected', payload: 'There is an error create city ...' })
            }
        }
        postCity();
    }

    const deleteCity = async id => {
        dispatch({ type: 'loading' });
        try {
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE"
            });
            dispatch({ type: 'city/deleted', payload: id });
        } catch (error) {
            dispatch({ type: 'rejected', payload: 'There is an error deleting city !' })
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
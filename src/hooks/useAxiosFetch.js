import axios from 'axios';
import { useEffect, useReducer, useRef } from 'react';

const mainUrl = import.meta.env.VITE_API_URL;

export default function useAxiosFetch(url) {
    const isMounted = useRef(false);
    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "INIT": {
                    return {...state, isLoading: true, isError: false};
                }
                case "SUCCESS": {
                    return {...state, isLoading: false, isError: false, data: action.payload};
                }
                case "ERROR": {
                    return {...state, isLoading: false, isError: true, errorStatus: action.error, errorMessage: action.errorText};
                }
                default: {
                    return state;
                }
            }
        },
        { isLoading: false, isError: false, data: null, errorStatus: null, errorMessage: null }
    );

    const fetchData = async () => {
        dispatch({ type: "INIT" });

        try {
            const result = await axios.get(`${mainUrl}${url}`, { withCredentials: true });

            if (isMounted.current) {
                dispatch({ type: "SUCCESS", payload: result.data });
                console.log("Axios resuld data",result.data)
            }
        } catch (error) {
            if (isMounted.current) {
                dispatch({ type: "ERROR", error: error.response.status, errorText: error.response?.data.message });
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchData();

        return () => {
            isMounted.current = false;
        };
    }, [url]);

    const refetch = () => {
        fetchData();
    };

    return { ...state, refetch };
}
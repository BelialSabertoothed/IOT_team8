import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    const refresh = () => {
        console.log("REFRESH!!");
        fetchData(url);
    };

    const fetchData = (url) => {
        const abortCont = new AbortController();
        fetch(url, { signal: abortCont.signal})
            .then(res => {
                if (!res.ok) {
                    throw Error('Could not fetch data for that resource.');
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                setError(null);
                setIsPending(false);
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    console.log('fetch aborted');
                } else {
                    setError(err.message);
                    setIsPending(false);
                }
            })
        
        return () => abortCont.abort();
    };

    useEffect(() => {
        fetchData(url);
    }, [url]);

    return [data, isPending, error, refresh];
}

export default useFetch;
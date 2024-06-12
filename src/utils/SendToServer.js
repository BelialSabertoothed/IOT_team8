import axios from "axios";

const mainUrl = import.meta.env.VITE_API_URL;

const sendToServer = async (url, data, setLoading, setErrorOpen, setErrorMessage) => {
    if (setLoading) setLoading(true);
    try {
        const result = await axios.post(`${mainUrl}${url}`, data, { withCredentials: true });
        if (setLoading) setLoading(false);
        return result.data;
    } catch (e) {
        console.log(e);
        if (setErrorMessage) setErrorMessage(e.response?.data.message);
        console.log(e.response?.data.message)
        if (setErrorOpen) setErrorOpen(true);
    }
    if (setLoading) setLoading(false);
}

export default sendToServer;
import axios from "axios";

const axios_client = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
});

// If a token is in the local storage we can use it
// This allows to remain connected after reload outside the login page
const token = window.sessionStorage.getItem("token");
if (token !== null) {
    axios_client.defaults.headers.common['Authorization'] = "Token " + token;
}

export default axios_client;
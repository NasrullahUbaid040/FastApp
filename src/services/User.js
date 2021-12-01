import axios from "axios"

import API_URL from '../config/constants.json';

const User = {
    Login: (email, password) =>
    {
        return axios.post(`${API_URL}/login`, {email, password})
    },
    Register: (name, email, password) =>
    {
        return axios.post(`${API_URL}/register`, {name, email, password})
    }
}

export default User;
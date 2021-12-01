import axios from "axios"
import API_URL from '../config/constants';

const Auth = {
    Register: (username, email, password, phone, newUserType, type, callingCode) => {
        console.log('phone', phone)
        return axios.post(`${API_URL}/user/auth/register`,
            {
                username,
                email,
                password,
                phone: {
                    code: callingCode,
                    number: phone
                },
                loginType: "local",
                type,
                _type: newUserType

            })
    },

    Social: (email, id, imageUrl, type, username) => {
        console.log('..............', email, id, imageUrl, type, username)
        return axios.post(`${API_URL}/user/auth/social-login`,
            {
                email,
                id,
                imageUrl: imageUrl,
                type,
                firstName: username,
                lastName: '',
            })
    },


    Login: (email, password) => {
        console.log('email===>', email, 'password===>', password)
        return axios.post(`${API_URL}/user/auth/login`,
            {
                email,
                password,
                loginType: "local"
            })

    },
    ForgotPassword: (email) => {
        console.log('email...>',email)
        return axios.post(`${API_URL}/user/auth/forget-password`,
            {
                email
            })
    },
    ForgotPasswordCode: (digit, email) => {
        console.log('digit form auth*********', digit, email)
        return axios.post(`${API_URL}/user/auth/verifyOTP`,
            {
                email: email,
                otp: digit
            })
    },
    UpdatePassword: (password, email) => {
        console.log('digit form password', email, password)
        return axios.post(`${API_URL}/user/auth/reset-password`,
            {
                email: email,
                password: password
            })
    },
}
export default Auth;
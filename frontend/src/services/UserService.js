import axios from "axios";
import {SERVER_API_URL} from "../constants";

class UserService {
    config = {
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": '*'
        }
    }
    registrar = async (values) => {
        try {
            return await axios.post(
                SERVER_API_URL + '/users/local',
                {
                    email: values.email,
                    password: values.password,
                },
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    fullRegistrar = async (values) => {
        try {
            return await axios.put(
                SERVER_API_URL + '/users/local/full',
                {
                    email: values.email,
                    companyName: values.companyName,
                    phone: values.phone,
                    inn: values.inn
                },
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }

    login = async (login, password) => {
        try {
            axios.defaults.withCredentials = true
            return await axios.post(
                SERVER_API_URL + '/login/local',
                {
                    email: login,
                    password: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    passwordRecoverySendCode = async (email) => {
        try {
            return await axios.get(
                SERVER_API_URL + '/password-recovery/' + email,
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    passwordRecoveryCheckCode = async (email, code) => {
        try {
            axios.defaults.withCredentials = true
            return await axios.post(
                SERVER_API_URL + '/password-recovery/check-code',
                {
                    email: email,
                    code: code
                },
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    passwordRecoveryReset = async (email, password) => {
        try {
            return await axios.put(
                SERVER_API_URL + '/password-recovery/reset',
                {
                    email: email,
                    password: password
                },
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    isFullUserInformation = async (email) => {
        try {
            return await axios.get(
                SERVER_API_URL + '/is-full-partner-info/' + email,
                {
                    email: email,
                },
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }

    async logOut() {
        try {
            axios.defaults.withCredentials = true
            return await axios.get(
                SERVER_API_URL + '/logout',
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    isLoggetIn() {
        try {
            axios.defaults.withCredentials = true
            return axios.get(
                SERVER_API_URL + '/is-auth',
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
}

export default UserService;

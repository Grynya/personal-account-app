import axios from "axios";
import {SERVER_API_URL} from "../constants";

class RegistrarService {
    config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    async getAllRegistrarsAndPaymentsByClientId(clientId) {
        try {
            axios.defaults.withCredentials = true
            return await axios.get(
                SERVER_API_URL + '/payments/' + clientId,
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    async getStatus(registrarId, clientId) {
        try {
            axios.defaults.withCredentials = true
            let res = await axios.get(
                SERVER_API_URL + '/registrars/is-blocked/'+registrarId+'/'+clientId,
                this.config
            );
            if (res.data) return "BLOCKED";
            else return "ACTIVE"
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    async updateStatus(requestBody) {
        try {
            axios.defaults.withCredentials = true
            if (requestBody.status === "BLOCKED") return await axios.post(
                SERVER_API_URL + '/registrars/block',
                requestBody,
                this.config
            );
            return await axios.delete(
                SERVER_API_URL + '/registrars/unblock/'
                + requestBody.registrarId + '/' + requestBody.clientId,
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
}

export default RegistrarService;

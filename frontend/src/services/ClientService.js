import axios from "axios";
import {SERVER_API_URL} from "../constants";

class ClientService {
    config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    add = async (values) => {
        try {
            axios.defaults.withCredentials = true
            return await axios.put(
                SERVER_API_URL + '/users/add/client/' + values.userId,
                {
                    name: values.name,
                    company: values.company,
                    phone: values.phone,
                    email: values.email,
                    comment: values.comment
                },
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }

    async getAllClients(userId) {
        try {
            axios.defaults.withCredentials = true
            return await axios.get(
                SERVER_API_URL + '/users/clients/' + userId,
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    async getAllDeletedClients(userId) {
        try {
            axios.defaults.withCredentials = true
            return await axios.get(
                SERVER_API_URL + '/users/clients/deleted/' + userId,
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    async updateClient(clientId, newClientData) {
        try {
            axios.defaults.withCredentials = true
            let res = await axios.put(
                SERVER_API_URL + '/clients/' + clientId,
                newClientData,
                this.config
            );
            return res;
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
    async deleteClient(clientId) {
        try {
            axios.defaults.withCredentials = true
            let res = await axios.delete(
                SERVER_API_URL + '/clients/' + clientId,
                this.config
            );
            return res;
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
}

export default ClientService;

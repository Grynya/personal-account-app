import axios from "axios";
import {SERVER_API_URL} from "../constants";

class PaymentService {
    config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    async createPayment(payment) {
        try {
            axios.defaults.withCredentials = true
            return await axios.post(
                SERVER_API_URL + '/payments',
                payment,
                this.config
            );
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }

}

export default PaymentService;

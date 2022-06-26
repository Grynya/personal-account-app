import {useState} from "react";
import {
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import {faUser} from '@fortawesome/fontawesome-free-solid'
import {Container, FormSelect} from "react-bootstrap";
import PaymentService from "../../services/PaymentService";
import {useLocation} from "react-router";
import {useNavigate} from "react-router-dom";

fontawesome.library.add(faUser);
const AddPaymentForm = () => {
    let navigator = useNavigate();
    const {state} = useLocation();
    const [isValid, setIsValid] = useState(false)
    const [inputs, setInputs] = useState({
        registrarId: state.registrarId,
        clientId: state.clientId,
        paidFrom: "",
        duration: ""
    });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name==="duration" && value && inputs.paidFrom) setIsValid(true)
        else if (name==="paidFrom" && value && inputs.duration) setIsValid(true)
        else setIsValid(false)

        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let res = await new PaymentService().createPayment(inputs);
        if (res.status === 200) navigator("/registrars")
    }

    return (
        <Row>
            <Col lg={4} className="mx-auto">
                <Card className="mt-5 mx-auto p-4 bg-light">
                    <FormGroup className="d-flex justify-content-center mt-3">
                        <span className="text-1">Добавление нового клиента</span>
                    </FormGroup>
                    <CardBody>
                        <Container>
                            <form onSubmit={handleSubmit}>
                                <Row>
                                    <FormGroup>
                                        <Label for="registrarId">Номер кассы</Label>
                                        <Input
                                            type="text"
                                            name="registrarId"
                                            id="registrarId"
                                            value={inputs.registrarId}
                                            disabled={true}
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <Label for="clientId">ID клиента</Label>
                                        <Input
                                            type="text"
                                            name="clientId"
                                            id="clientId"
                                            value={inputs.clientId}
                                            disabled={true}
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <Label for="paidFrom">Дата начала</Label>
                                        <Input
                                            type="date"
                                            name="paidFrom"
                                            id="paidFrom"
                                            value={inputs.paidFrom || ""}
                                            onChange={handleChange}
                                            required={true}
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <Label for="duration">Период</Label>
                                        <FormSelect name="duration"
                                                    id="duration"
                                                    onChange={handleChange}
                                                    required={true}
                                        >
                                            <option value="">Период</option>
                                            <option value="1 month">1 месяц</option>
                                            <option value="1 year">1 год</option>
                                        </FormSelect>
                                    </FormGroup>
                                </Row>
                                <Row className="d-flex justify-content-center">
                                    <Col md={6}>
                                        <FormGroup>
                                            <button type="submit"
                                                    className="btn btn-warning menu-btn"
                                            disabled={!isValid}>
                                                <FontAwesomeIcon icon="fa-solid fa-user-plus"/>
                                                Добавить оплату
                                            </button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-center">
                                    <Col md={6}>
                                        <FormGroup>
                                            <a type="button" href="/registrars/"
                                               className="btn btn-secondary menu-btn">Отменить</a>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </form>
                        </Container>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

const AddClient = () => {
    return (<div className="App">
        <AddPaymentForm/>
    </div>);
}

export default AddClient;

import fontawesome from '@fortawesome/fontawesome'
import {faUser, faClone, faPenSquare, faTrash} from '@fortawesome/fontawesome-free-solid'
import {FormGroup, Row, Container, Col} from "reactstrap";
import ClientService from "../../services/ClientService";
import {useEffect, useState} from "react";
import RegistrarService from "../../services/RegistrarService";
import RegistrarsAccordion from "./RegistrarsAccordion";

fontawesome.library.add(faUser, faClone, faPenSquare, faTrash);

export default function ClientsWithRegistrars() {
    const [clientsWithRegistrars, initClientsWithRegistrars] = useState([]);

    const fetchClientsData = async () => {
        const response = await new ClientService().getAllClients(localStorage.getItem("userId"))
        if (response.status !== 200) {
            throw new Error('Data could not be fetched!')
        } else {
            let clients = response.data;
            let tmpClientsWithRegistrars = []
            for (let client of clients) {
                let registrarPayments = await new RegistrarService()
                    .getAllRegistrarsAndPaymentsByClientId(client.id)
                tmpClientsWithRegistrars.push({
                    client: {
                        name: client.name,
                        id: client.id,
                        company: client.company,
                        status: client.status,
                        registrarsWithPayments: registrarPayments.data
                    },
                })
            }
            return tmpClientsWithRegistrars;
        }
    }
    useEffect(() => {
        fetchClientsData()
            .then((res) => {
                initClientsWithRegistrars(res);
            })
            .catch((e) => {
                console.log(e.message)
            })
    }, [])
    return (
        <Container>
            <Row lg={5} className="d-flex justify-content-center mt-3">
                <FormGroup>
                    <a href="/home" className="btn btn-outline-dark menu-btn">Назад</a>
                </FormGroup>
            </Row>
            <Row className="d-flex justify-content-center mt-3">
                <Col lg={12}>
                    <Container>
                        {clientsWithRegistrars.map((clientEntity, idx) => {
                            return <RegistrarsAccordion
                                client={clientEntity.client}
                                idx={idx}
                                />
                        })}
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

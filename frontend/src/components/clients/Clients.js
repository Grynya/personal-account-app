import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import {faUser, faClone, faPenSquare, faTrash} from '@fortawesome/fontawesome-free-solid'
import {FormGroup, Row, Container, Col} from "reactstrap";
import ClientService from "../../services/ClientService";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ClientInfoDropdown from "./ClientInfoDropdown";
import {CopyToClipboard} from "react-copy-to-clipboard";
import ClientStatusDropdown from "./ClientStatusDropdown";

fontawesome.library.add(faUser, faClone, faPenSquare, faTrash);

export default function Clients() {
    const [clients, initClients] = useState([]);

    const fetchData = async () => {
        const response = await new ClientService().getAllClients(localStorage.getItem("userId"))
        if (response.status !== 200) {
            throw new Error('Data could not be fetched!')
        } else {
            return response.data;
        }
    }
    useEffect(() => {
        fetchData()
            .then((res) => {
                initClients(res)
            })
            .catch((e) => {
                console.log(e.message)
            })
    }, [])

    function ClientRow(props) {
        const navigate = useNavigate();
        const [idColor, setIdColor] = useState("black")
        let idStyle = {color: idColor}
        return (
            <p>
            <Row>
                <Col lg={4} className="to-center">
                    <ClientInfoDropdown client={props.client}/>
                </Col>
                <Col lg={4}
                     className="to-center"
                     id={props.idx.toString()}
                     style={idStyle}>{props.client.id}
                    <CopyToClipboard
                        text={props.client.id}
                        onCopy={() => {
                            setIdColor('green')
                            setTimeout(() => setIdColor('black'), 500)
                        }}>
                        <FontAwesomeIcon title="Копировать" icon="fa-solid fa-clone"/>
                    </CopyToClipboard>
                </Col>
                <Col lg={2} className="to-center">
                    <ClientStatusDropdown clientId={props.client.id}
                                          status={props.client.status}
                    />
                </Col>
                <Col lg={1} className="to-center">
                    <FontAwesomeIcon
                        icon="fa-solid fa-pen-square"
                        title="Редактировать"
                        onClick={() => {
                            navigate("/clients/edit",
                                {state: {client: props.client}})
                        }}/>
                </Col>
                <Col lg={1} className="to-center">
                    <FontAwesomeIcon icon="fa-solid fa-trash"
                                     title="Удалить"
                                     onClick={async () => {
                                         await new ClientService().deleteClient(props.client.id)
                                         fetchData()
                                             .then((res) => {
                                                 initClients(res)
                                             })
                                             .catch((e) => {
                                                 console.log(e.message)
                                             })
                                     }}/>
                </Col>
            </Row>
            </p>
        )
    }


    return (
        <Container>
            <Row lg={5} className="d-flex justify-content-center mt-3">
                <FormGroup>
                    <a href="/home" className="btn btn-outline-dark menu-btn">Назад</a>
                </FormGroup>
            </Row>
            <Row lg={5} className="d-flex justify-content-center">
                <FormGroup>
                    <a href="/clients/add" className="btn btn-warning menu-btn">
                        <FontAwesomeIcon icon="fa-solid fa-user-plus"/>
                        Добавить клиента
                    </a>
                </FormGroup>
            </Row>
            <Row lg={5} className="d-flex justify-content-center">
                <FormGroup>
                    <a href="/clients/deleted" className="btn btn-outline-dark menu-btn">Удалённые</a>
                </FormGroup>
            </Row>
            <Row className="d-flex justify-content-center mt-3">
                <Col lg={11}>
                        {clients.map((client, idx) => {
                            return <ClientRow client={client} idx={idx}/>
                        })}
                </Col>
            </Row>
        </Container>
    );
}

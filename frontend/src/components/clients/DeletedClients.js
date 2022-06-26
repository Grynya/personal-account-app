import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import {faClone,faWindowRestore} from '@fortawesome/fontawesome-free-solid'

import {FormGroup, Row, Container, Table, Col} from "reactstrap";
import ClientService from "../../services/ClientService";
import {useEffect, useState} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import ClientInfoDropdown from "./ClientInfoDropdown";
const statusTranslator = require("../util/StatusTranslator");

fontawesome.library.add(faClone, faWindowRestore);

export default function DeletedClients() {

    const ClientsRows = (props) => {
        const [idColor, setIdColor] = useState("black")
        let idStyle = {color: idColor}
        return (
            <tr>
                <td className="col-md-1"><ClientInfoDropdown client={props.client}/></td>
                <td className="col-md-3">{props.client.name}</td>
                <td
                    id={props.idx.toString()}
                    style={idStyle}
                    className="col-md-3"
                >{props.client.id} </td>
                <td className="col-md-1">
                    <CopyToClipboard
                        text={props.client.id}
                        onCopy={() => {
                            setIdColor('green')
                            setTimeout(() => setIdColor('black'), 500)
                        }}>
                        <FontAwesomeIcon title="Копировать" icon="fa-solid fa-clone"/>
                    </CopyToClipboard>
                </td>
                <td className="col-md-3 to-center">{statusTranslator.engNameToRuName(props.client.status)}</td>
                <td className="col-md-1"><FontAwesomeIcon
                    icon="fa-solid fa-window-restore"
                    title="Востановить"
                    onClick={async ()=>{
                        await new ClientService().updateClient(props.client.id, {isDeleted: false})
                        fetchData()
                            .then((res) => {
                                initClients(res)
                            })
                            .catch((e) => {
                                console.log(e.message)
                            })
                    }}
                /></td>
            </tr>
        );
    }

    const [clients, initClients] = useState([]);

    const fetchData = async () => {
        const response = await new ClientService().getAllDeletedClients(localStorage.getItem("userId"))
        if (response.status !== 200) {
            throw new Error('Data could not be fetched!')
        }
        else {
            console.log(response)
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
    return (
        <Container>
            <Row lg={5} className="d-flex justify-content-center">
                <FormGroup className="mt-3">
                    <a href="/clients" className="btn btn-outline-dark menu-btn">Назад</a>
                </FormGroup>
            </Row>
            <Row className="d-flex justify-content-center mt-3">
                <Col lg={10}>
                    <Table className="clients-table"  hidden={clients.length===0}>
                        <thead>
                        <tr>
                            <th className="col-md-1"></th>
                            <th className="col-md-3 to-center">Название</th>
                            <th className="col-md-3 to-center">ID</th>
                            <th className="col-md-1"></th>
                            {/*col for copy icon*/}
                            <th className="col-md-3 to-center">Статус</th>
                            <th className="col-md-1"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {clients.map((client, idx) => {
                            return <ClientsRows client={client} idx={idx}/>
                        })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

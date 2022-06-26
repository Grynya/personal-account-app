import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import {Col, Container, FormGroup, List, Row} from "reactstrap";
import PaymentsTable from "./PaymentsTable";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ClientStatusDropdown from "../clients/ClientStatusDropdown";
import {useState} from "react";
import {ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useNavigate} from "react-router-dom";
import RegistrarStatusDropdown from "./RegistrarStatusDropdown";

export default function RegistrarsAccordion(props) {
    const [idColor, setIdColor] = useState("black");
    const [isHiddenPaymentsControl, setIsHiddenPaymentsControl] = useState(true);
    const [registrarIdToOpen, setRegistrarIdToOpen] = useState("");
    const [currentRegistrarsWithPayments, setCurrentRegistrarsWithPayments] = useState();
    const [selectedIndex, setSelectedIndex] = useState();
    const navigate = useNavigate();

    let idStyle = {color: idColor}
    return (
        <Row lg={12}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className="container">
                        <Row lg={12}>
                            <Col lg={4}>{props.client.company}</Col>
                            <Col id={props.idx}
                                 style={idStyle}
                                 lg={4}
                            >
                                {props.client.id}
                            </Col>
                            <Col lg={1}>
                                <CopyToClipboard
                                    text={props.client.id}
                                    onCopy={() => {
                                        setIdColor('green')
                                        setTimeout(() => setIdColor('black'), 500)
                                    }}>
                                    <FontAwesomeIcon title="Копировать" icon="fa-solid fa-clone"/>
                                </CopyToClipboard>
                            </Col>
                            <Col lg={3}>
                                <ClientStatusDropdown clientId={props.client.id}
                                                      status={props.client.status}
                                />
                            </Col>
                        </Row>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Container>
                            <Row>
                                <Col lg={7}>
                                    <List>{
                                        Object.keys(props.client.registrarsWithPayments).map(function (keyName, keyIndex) {
                                            return (
                                                <ListItem onClick={() => {
                                                    setRegistrarIdToOpen(keyName);
                                                    setIsHiddenPaymentsControl(false);
                                                    setCurrentRegistrarsWithPayments(props.client.registrarsWithPayments[keyName])
                                                }
                                                }><ListItemButton
                                                    selected={selectedIndex === keyIndex}
                                                    onClick={() => {
                                                        setSelectedIndex(keyIndex);
                                                    }}
                                                >
                                                    <ListItemText>
                                                        <Row>
                                                        <Col lg={8}>
                                                        {keyName}
                                                        <CopyToClipboard
                                                            text={keyName}
                                                        >
                                                            <FontAwesomeIcon title="Копировать"
                                                                             icon="fa-solid fa-clone"/>
                                                        </CopyToClipboard>
                                                        </Col>
                                                        <Col lg={4}>
                                                        <RegistrarStatusDropdown
                                                            registrarId={keyName}
                                                            clientId={props.client.id}
                                                        />
                                                        </Col>
                                                        </Row>
                                                    </ListItemText>
                                                </ListItemButton>
                                                </ListItem>
                                            )
                                        })
                                    }
                                    </List>
                                </Col>
                                <Col lg={5}>
                                    <Row>
                                        <FormGroup hidden={isHiddenPaymentsControl}>
                                            <a onClick={() => {
                                                navigate("/payments/add", {
                                                    state: {
                                                        clientId: props.client.id,
                                                        registrarId: registrarIdToOpen
                                                    }
                                                });
                                            }}
                                               className="btn btn-warning menu-btn">
                                                <FontAwesomeIcon icon="fa-solid fa-user-plus"/>
                                                Добавить оплату
                                            </a>
                                        </FormGroup>
                                    </Row>
                                    <Row className="d-flex justify-content-center">
                                        <PaymentsTable
                                            registrarsWithPayments={currentRegistrarsWithPayments}
                                            keyName={registrarIdToOpen}
                                            hidden={isHiddenPaymentsControl}
                                        />
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Row>
    )
}

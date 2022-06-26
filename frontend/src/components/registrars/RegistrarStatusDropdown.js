import {
    Button,
    ButtonDropdown,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle, Form, FormGroup, Input, Label,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader
} from "reactstrap";
import {Component} from "react";
import RegistrarService from "../../services/RegistrarService";
import {engNameToRuName, ruNameToEngName} from "../util/StatusTranslator";
import {ModalTitle} from "react-bootstrap";
import fontawesome from "@fortawesome/fontawesome";
import {faFloppyDisk} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {FormLabel} from "@mui/material";

fontawesome.library.add(faFloppyDisk);

export default class RegistrarStatusDropdown extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.state = {
            dropdownOpen: false,
            value: "",
            isShowedModal: false,
            blockedMessage: ""
        };
    }

    fetchStatus = async () => {
        return await new RegistrarService().getStatus(this.props.registrarId, this.props.clientId);
    }

    async componentDidMount() {
        let status = await this.fetchStatus();
        this.setState({value: engNameToRuName(status)})
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    async select(event) {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
        if (ruNameToEngName(event.target.innerText) === "BLOCKED") {
            this.setState({isShowedModal: true})
        } else {
            await new RegistrarService() //is Active means unblock (need registrarId and clientId only)
                .updateStatus({
                    status: "ACTIVE",
                    registrarId: this.props.registrarId,
                    clientId: this.props.clientId
                });
            await this.componentDidMount();
        }
    }

    async updateStatus(event) {
        event.preventDefault();
        this.setState({isShowedModal: false})
        console.log(await new RegistrarService() //is Blocked means block (need registrarId and clientId and blocked message also)
            .updateStatus({
                status: "BLOCKED",
                registrarId: this.props.registrarId,
                clientId: this.props.clientId,
                message: this.state.blockedMessage
            }));
        await this.componentDidMount()
    }

    handleClose() {
        this.setState({
            isShowedModal: false
        })
    }

    render() {
        return (
            <Container>
                <Modal size="md" isOpen={this.state.isShowedModal}>
                    <ModalHeader closeButton>
                        <ModalTitle>Блокировка кассы</ModalTitle>
                    </ModalHeader>
                    <Form onSubmit={this.updateStatus}>
                        <ModalBody>
                            <FormGroup>
                                 <span className="server-response">Введите сообщение, которое будет высвечиваться при попытке
                                    доступа к заблокированой кассе</span>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor="blockedMessage">Сообщение</FormLabel>
                                <Input required={true} type="text" id="blockedMessage" name="blockedMessage"
                                       placeholder="Сообщение"
                                       value={this.state.blockedMessage}
                                       onChange={(e) => {
                                           this.setState({blockedMessage: e.target.value});
                                       }}/>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-secondary" onClick={this.handleClose}>
                                Отмена
                            </Button>
                            <Button className="btn-secondary" onClick={async (event)=>{
                                this.setState({blockedMessage: ""})
                                await this.updateStatus(event);
                            }}>
                                Пропустить
                            </Button>
                            <Button className="btn-success" type="submit">
                                <FontAwesomeIcon icon="fa-solid fa-floppy-disk"/>
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}
                                className="to-right">
                    <DropdownToggle className="btn-close-white" caret>{this.state.value}</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={this.select}>Активен</DropdownItem>
                        <DropdownItem onClick={this.select}>Заблокирован</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
            </Container>
        )
    }
}

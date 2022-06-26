import {ButtonDropdown, Container, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {Component} from "react";
import ClientService from "../../services/ClientService"
const statusTranslator = require("../util/StatusTranslator");

export default class ClientStatusDropdown extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);
        this.state = {
            dropdownOpen: false,
            value: statusTranslator.engNameToRuName(props.status)
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    async select(event) {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
            value: event.target.innerText
        });
        await new ClientService().updateClient(this.props.clientId,  {status: statusTranslator.ruNameToEngName(event.target.innerText)})
    }

    render() {
        return (
            <Container>
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className=" to-right">
                    <DropdownToggle className="btn-close-white" caret>{this.state.value}</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={this.select}>Активен</DropdownItem>
                        <DropdownItem onClick={this.select}>Не активен</DropdownItem>
                        <DropdownItem onClick={this.select}>Ожидает</DropdownItem>
                        <DropdownItem onClick={this.select}>Заблокирован</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
            </Container>
        )
    }
}

import {Container, Dropdown, DropdownMenu, DropdownToggle, Row} from "reactstrap";
import {Component} from "react";

export default class ClientInfoDropdown extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    async select() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    render() {
        return (
            <Container>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle className="btn-close-white" caret>
                        {this.props.client.company}
                    </DropdownToggle>
                    <DropdownMenu>
                        <Container>
                            <Row className="mt-3">
                                Имя: {this.props.client.name}
                            </Row>
                            <Row className="mt-3">
                                Email: {this.props.client.email}
                            </Row>
                            <Row className="mt-3">
                                Телефон: {this.props.client.phone}
                            </Row>
                            <Row className="mt-3">
                                Комментарий: {this.props.client.comment}
                            </Row>
                        </Container>
                    </DropdownMenu>
                </Dropdown>
            </Container>
        )
    }
}

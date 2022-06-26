import {Component, useState} from "react";
import {Button, Form, FormGroup, Label, Input, Container, Row, Col, Modal, ModalBody} from 'reactstrap';
import {useNavigate} from "react-router-dom";
import UserService from "../../services/UserService";
const LoginForm = (message) => {
    const [isShowedModal, setIsShowedModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [formValue, setFormValue] = useState({
        login: "",
        password: "",
        inputMessage: message
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
                inputMessage: ""
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let loginRes = await new UserService().login(formValue.login, formValue.password);
        if (loginRes.status === 200) {
            let res = await new UserService().isFullUserInformation(formValue.login);
            localStorage.setItem("userId", loginRes.data.userId)
            if (res) navigate('/home', {state: {isFull: res.data, email: formValue.login}});
        } else {
            setIsShowedModal(true);
            setModalMessage(loginRes.data);
            setFormValue({login: "", password: ""});
            setTimeout(()=>setIsShowedModal(false), 2000);
        }
    };

    return (
        <Container className="container">
            <Row className="d-flex justify-content-center">
                <Col md={6}>
                    <Form className="card p-9 px-8 py-5 mt-3 align-items-center" onSubmit={handleSubmit}>
                        <FormGroup className="d-flex justify-content-center">
                            <span className="text-1">Авторизация пользователя</span>
                        </FormGroup>
                        {message.inputMessage && (<span className="mt-3">{message.inputMessage}</span>)}
                        <Modal size="sm" isOpen={isShowedModal}>
                            <ModalBody className="error-popup">{modalMessage}</ModalBody>
                        </Modal>
                        <FormGroup className="mt-3">
                            <img className="line-10 align-items-center" src={require("../../img/line.png")}
                                 alt=""/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="login" className="form-label">Логин</Label>
                            <Input required={true} type="text" id="login" name="login"
                                   placeholder="Логин"
                                   value={formValue.login}
                                   onChange={handleChange}/>
                        </FormGroup>
                        <FormGroup className="mt-3">
                            <Label htmlFor="password" className="form-label">Пароль</Label>
                            <Input required={true}
                                   type="password"
                                   id="password" name="password"
                                   placeholder="Пароль"
                                   value={formValue.password}
                                   onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <a className="mt-3 menu-btn" href='/password-recovery'>Напомнить логин и пароль</a>
                        </FormGroup>
                        <FormGroup>
                            <Button className="btn btn-warning custom-btn" type="submit">
                                <span>Войти</span>
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            <Button className="btn btn-secondary custom-btn" onClick={(e) => {
                                e.preventDefault();
                                navigate('/registrar/')
                            }}>
                                <span>Зарегестрироваться</span>
                            </Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

class Login extends Component {
    render() {
        return (
            <div className="App">
                <LoginForm message={this.props.message}/>
            </div>
        );
    }
}

export default Login;

import {Component, useState} from "react";
import {useNavigate} from "react-router-dom";
import UserService from "../../services/UserService";
import {Button, Card, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, Row} from "reactstrap";
import {Form, Field} from "react-final-form";

const RegistrarForm = () => {
    const [secondBtnName, setSecondBtnName] = useState("Отмена");
    const [isHiddenRegistrar, setIsHiddenRegistrar] = useState(false);
    const [isShowedModal, setIsShowedModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const navigate = useNavigate();
    const back = (e) => {
        e.preventDefault();
        navigate('/login/')
    };
    const handleSubmit = async (values) => {
        let registrarRes = await new UserService().registrar(values);
        if (registrarRes.status === 200) {
            setSecondBtnName("Войти");
            setIsHiddenRegistrar(true);
            setModalMessage(registrarRes.data);
        } else if (registrarRes.status === 404) {
            setIsShowedModal(true);
            setModalMessage(registrarRes.data);
            setTimeout(()=>setIsShowedModal(false), 2000)
        }
    }

    return (
        <Container>
            <Row className="d-flex justify-content-center">
                <Col md={6}>
                    <Card className="p-10 px-8 py-5 align-items-center">
                        <FormGroup className="text-1" hidden={isHiddenRegistrar}>
                            Регистрация пользователя
                        </FormGroup>
                        <Modal size="sm" isOpen={isShowedModal}>
                            <ModalBody className="error-popup">{modalMessage}</ModalBody>
                        </Modal>
                        {modalMessage && (<p>{modalMessage}</p>
                        )}
                        <FormGroup className="mt-3" hidden={isHiddenRegistrar}>
                            <img className="line-10" src={require("../../img/line.png")} alt=""/>
                        </FormGroup>
                        <Form
                            onSubmit={handleSubmit}
                            validate={values => {
                                const errors = {};

                                function validateEmail(email) {
                                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                    return re.test(String(email).toLowerCase());
                                }

                                if (!values.email) {
                                    errors.email = "Заполните это поле";
                                } else if (!validateEmail(values.email)) {
                                    errors.email = "Некорректный адрес электронной почты";
                                }
                                if (!values.password) {
                                    errors.password = "Заполните это поле";
                                } else if (values.password.length < 5 || values.password.length > 100) {
                                    errors.password = "Пароль должен содержать от 5 до 100 символов";
                                }
                                if (!values.confirmPassword) {
                                    errors.confirmPassword = "Заполните это поле";
                                } else if (values.confirmPassword !== values.password) {
                                    errors.confirmPassword = "Пароли не совпадают";
                                }
                                return errors;
                            }}
                            render={({handleSubmit, values, submitting, validating, valid}) => (
                                <form onSubmit={handleSubmit}>
                                    <div hidden={isHiddenRegistrar}>
                                        <FormGroup className="mt-3">
                                            <Label htmlFor="email" className="form-label">Email</Label>
                                            <Field name="email">
                                                {({input, meta}) => (
                                                    <div>
                                                        <Input
                                                            {...input}
                                                            type="text" id="email" name="email"
                                                            placeholder="Email"
                                                            invalid={meta.error && meta.touched}
                                                        />
                                                        <div className="errors">
                                                            {meta.error && meta.touched &&
                                                                <span className="">{meta.error}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                            </Field>
                                        </FormGroup>
                                        <FormGroup className="mt-3">
                                            <Label htmlFor="password" className="form-label">Пароль</Label>
                                            <Field name="password">
                                                {({input, meta}) => (
                                                    <div>
                                                        <Input
                                                            {...input}
                                                            type="password" id="password" name="password"
                                                            placeholder="Пароль"
                                                            invalid={meta.error && meta.touched}
                                                            className="row-6"
                                                        />
                                                        <div className="errors">
                                                            {meta.error && meta.touched &&
                                                                <span>{meta.error}</span>}</div>
                                                    </div>
                                                )}
                                            </Field>
                                        </FormGroup>
                                        <FormGroup className="mt-3">
                                            <Label htmlFor="confirmedPassword" className="form-label">Подтвердите
                                                пароль</Label>
                                            <Field name="confirmPassword">
                                                {({input, meta}) => (
                                                    <div>
                                                        <Input
                                                            {...input}
                                                            type="password" id="confirmedPassword"
                                                            name="confirmedPassword"
                                                            placeholder="Подтвердите пароль"
                                                            invalid={meta.error && meta.touched}
                                                        />
                                                        <div className="errors">
                                                            {meta.error && meta.touched &&
                                                                <span className="">{meta.error}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                            </Field>
                                        </FormGroup>
                                        <FormGroup check className="mt-3">
                                            <Field name="isAgreed" type="checkbox">
                                                {({input, meta}) => (
                                                    <Label check>
                                                        <Input {...input} type="checkbox"/>{''}
                                                        <span className="isAgreed-text">Согласен
                                                    с <a href="frontend/src/components/auth/Registrar#">правилами использования</a><br/> и даю согласие на обробтку моих данных</span>
                                                        {/*с <a href="#">правилами использования</a> и даю согласие на обробтку моих данных*/}
                                                    </Label>
                                                )}
                                            </Field>
                                        </FormGroup>
                                    </div>
                                    <div hidden={isHiddenRegistrar}><FormGroup
                                        className="d-flex justify-content-center">
                                        <Button className="mt-3 btn btn-warning custom-btn" type="submit" disabled={!valid}>
                                            <span>Зарегестрироваться</span>
                                        </Button>
                                    </FormGroup></div>
                                    <FormGroup className="d-flex justify-content-center">
                                        <Button className="mt-3 custom-btn" onClick={back}>
                                            <span>{secondBtnName}</span>
                                        </Button>
                                    </FormGroup>
                                </form>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

class Registrar extends Component {

    render() {

        return (
            <div className="App">
                <RegistrarForm/>
            </div>
        );
    }
}

export default Registrar;

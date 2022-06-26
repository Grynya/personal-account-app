import React, {Component, useState} from "react";
import {useNavigate} from "react-router-dom";
import UserService from "../../services/UserService";
import {Button, Card, Col, Container, FormGroup, Input, Label, Modal, ModalBody, Row} from "reactstrap";
import {useLocation} from "react-router";
import {Form, Field} from "react-final-form";



const FormWithEmailPassword = () => {
    const { state } = useLocation();
    const [serverResponse, setServerResponse] = useState("Введите новый пароль");
    const [secondBtnName, setSecondBtnName] = useState("Отмена");
    const [isHiddenForm, setIsHiddenForm] = useState(false);
    const [isShowedModal, setIsShowedModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const navigate = useNavigate();

    const back = (e) => {
        e.preventDefault();
        navigate('/login/')
    };

    const handleSubmit = async (values) => {
        let res = await new UserService().passwordRecoveryReset(state, values.password);
        if (res.status === 200) {
            setIsHiddenForm(true);
            setSecondBtnName("Войти");
            setServerResponse("Пароль изменен");
        } else if (res.status === 404) {
            setIsShowedModal(true);
            setModalMessage(res.data);
            setTimeout(()=>setIsShowedModal(false), 2000);
        }
    };

    return (
        <Container>
            <Row className="d-flex justify-content-center">
                <Col md={6}>
                    <Card className="p-10 px-8 py-5 mt-3 align-items-center">
                        <FormGroup><span className="text-1">Напомнить логин и пароль</span></FormGroup>
                        <FormGroup>
                            <div className="server-response d-flex justify-content-center">{serverResponse && (<p>{serverResponse}</p>
                            )}</div>
                        </FormGroup>
                        <Modal size="sm" isOpen={isShowedModal}>
                            <ModalBody className="error-popup">{modalMessage}</ModalBody>
                        </Modal>
                        <FormGroup>
                            <img className="line-10"
                                 hidden={isHiddenForm}
                                 src={require("../../img/line.png")} alt=""/>
                        </FormGroup>
                        <Form
                            onSubmit={handleSubmit}
                            validate={values => {
                                const errors = {};

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
                                    <div hidden={isHiddenForm}>
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
                                                        value={state}
                                                        disabled={true}
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
                                                        type="password" id="confirmedPassword" name="confirmedPassword"
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
                                    <FormGroup className="d-flex justify-content-center">
                                        <Button type="submit" className="mt-3 btn btn-warning custom-btn" disabled={!valid}>
                                            <span>Отправить</span>
                                        </Button>
                                    </FormGroup>
                                    </div>
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
    );
}

class PasswordRecovery extends Component {

    render() {
        return (
            <div className="App">
                <FormWithEmailPassword/>
            </div>
        );
    }
}

export default PasswordRecovery;

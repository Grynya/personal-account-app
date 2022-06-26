import React, {Component, useState} from "react";
import {useNavigate} from "react-router-dom";
import UserService from "../../services/UserService";
import {Button, Card, Col, FormGroup, Input, Label, Modal, ModalBody, Row, Container} from "reactstrap";
import {Field, Form} from "react-final-form";

const FormWithEmail = () => {
    const [isShowedModal, setIsShowedModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        let res = await new UserService().passwordRecoverySendCode(values.email);
        if (res.status === 200) {
            navigate("/password-recovery/code", { state: values.email });
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
                        <FormGroup className="server-response">Введите e-mail адрес почты которая использовалась при регистрации аккаунта</FormGroup>
                        <Modal size="sm" isOpen={isShowedModal}>
                            <ModalBody className="error-popup">{modalMessage}</ModalBody>
                        </Modal>
                        <FormGroup className="mt-3">
                        <Form
                            onSubmit={handleSubmit}
                            validate={values => {
                                const errors = {};
                                function validateEmail(email) {
                                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                    return re.test(String(email).toLowerCase());
                                }

                                if (!values.email) {
                                    errors.email = "Required";
                                } else if (!validateEmail(values.email)) {
                                    errors.email = "Not an email address";
                                }
                                return errors;
                            }}
                            render={({handleSubmit, values, submitting, validating, valid}) => (
                                <form onSubmit={handleSubmit}>
                                    <FormGroup className="mt-3">
                                        <Label htmlFor="email">Email</Label>
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
                                    <FormGroup className="d-flex justify-content-center">
                                        <Button type="submit" className="mt-3 btn btn-warning custom-btn" disabled={!valid}>
                                            <span>Отправить</span>
                                        </Button>
                                    </FormGroup>
                                    <FormGroup className="d-flex justify-content-center">
                                        <Button type="submit" className="mt-3 custom-btn" onClick={(e)=>{
                                            e.preventDefault();
                                            navigate('/login/')}}>
                                            <span>Отмена</span>
                                        </Button>
                                    </FormGroup>
                                </form>
                            )}
                        />
                        </FormGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
class SendCode extends Component {

    render() {
        return (
            <div className="App">
                <FormWithEmail/>
            </div>
        );
    }
}
export default SendCode;

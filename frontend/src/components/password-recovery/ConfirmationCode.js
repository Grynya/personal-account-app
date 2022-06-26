import React, {Component, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, Col, Container, FormGroup, Input, Label, Modal, ModalBody, Row} from "reactstrap";
import UserService from "../../services/UserService";
import {useLocation} from "react-router";
import {Field, Form} from "react-final-form";

const FormWithCode = () => {
    const {state} = useLocation();
    const [isShowedModal, setIsShowedModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        let res = await new UserService().passwordRecoveryCheckCode(state, values.code);
        if (res.status === 200) navigate('/password-recovery/reset', {state: state});
        else if (res.status === 404) {
            setIsShowedModal(true);
            setModalMessage(res.data);
            setTimeout(()=>setIsShowedModal(false), 2000);
        }
    };

    return (<Container>
            <Row className="d-flex justify-content-center">
                <Col md={6}>
                    <Card className="p-10 px-8 py-5 mt-3 d-flex align-items-center">
                        <FormGroup><span className="text-1">Напомнить логин и пароль</span></FormGroup>
                        <FormGroup className="server-response">Проверьте электронную почту – мы отправили вам сообщение с кодом подтверждения.
                            Он состоит из 6 цифр.</FormGroup>
                        <Modal size="sm" isOpen={isShowedModal}>
                            <ModalBody className="error-popup">{modalMessage}</ModalBody>
                        </Modal>
                        <Form
                            onSubmit={handleSubmit}
                            validate={values => {
                                const errors = {};
                                if (!values.code) {
                                    errors.code = "Required";
                                } else if (values.code.length !== 6) {
                                    errors.code = "Must contain 6 symbols";
                                }
                                return errors;
                            }}
                            render={({handleSubmit, values, submitting, validating, valid}) => (
                                <form onSubmit={handleSubmit}>
                                    <FormGroup className="mt-3">
                                        <Label htmlFor="code" className="form-label">Код</Label>
                                        <Field name="code">
                                            {({input, meta}) => (
                                                <div>
                                                    <Input
                                                        {...input}
                                                        type="text" id="code" name="code"
                                                        placeholder="Код"
                                                        invalid={meta.error && meta.touched}
                                                    />
                                                    <div className="errors">
                                                        {meta.error && meta.touched &&
                                                            <span>{meta.error}</span>}
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
                                        <Button type="submit" className="mt-3 custom-btn" onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/login/')
                                        }}>
                                            <span>Отмена</span>
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

class ConfirmationCode extends Component {


    render() {
        return (
            <div className="App">
                <FormWithCode/>
            </div>
        );
    }
}

export default ConfirmationCode;

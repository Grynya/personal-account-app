import {Component, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {Form, Field} from "react-final-form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import {faUser} from '@fortawesome/fontawesome-free-solid'
import ClientService from "../../services/ClientService";
import {Container} from "react-bootstrap";

fontawesome.library.add(faUser);
const AddClientForm = () => {
    const [serverResponse, setServerResponse] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        values.userId = localStorage.getItem("userId");
        console.log(values)
        let res = await new ClientService().add(values);
        if (res.status === 200) {
            navigate('/clients/');
        } else if (res.status === 404) {
            setServerResponse(res.data);
        }
    }

    return (
        <Row>
            <Col lg={5} className="mx-auto">
                <Card className="mt-5 mx-auto p-4 bg-light">
                    <FormGroup className="d-flex justify-content-center mt-3">
                        <span className="text-1">Добавление нового клиента</span>
                    </FormGroup>
                    <CardBody>
                        <Container>
                            <Form
                                onSubmit={handleSubmit}
                                validate={values => {
                                    const errors = {};

                                    function validateEmail(email) {
                                        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        return re.test(String(email).toLowerCase());
                                    }

                                    function validatePhone(phone) {
                                        const re = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
                                        return re.test(String(phone).toLowerCase());
                                    }
                                    if (!values.name) {
                                        errors.name = "Заполните это поле";
                                    } else if (values.name.length < 5 || values.name.length > 100) {
                                        errors.name = "Название должно содержать от 5 до 100 символов";
                                    }
                                    if (!values.company) {
                                        errors.company = "Заполните это поле";
                                    } else if (values.company.length < 5 || values.company.length > 100) {
                                        errors.company = "Пароль должен содержать от 5 до 100 символов";
                                    }
                                    if (!values.email) {
                                        errors.email = "Заполните это поле";
                                    } else if (!validateEmail(values.email)) {
                                        errors.email = "Некорректный адрес электронной почты";
                                    }
                                    if (!values.phone) {
                                        errors.phone = "Заполните это поле";
                                    } else if (!validatePhone(values.phone)) {
                                        errors.phone = "Некорректный номер телефона";
                                    }
                                    return errors;
                                }}
                                render={({handleSubmit, values, submitting, validating, valid}) => (
                                    <form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="name">Название</Label>
                                                    <Field name="name">
                                                        {({input, meta}) => (
                                                            <>
                                                                <Input
                                                                    {...input}
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="Название"
                                                                    required={true}
                                                                    invalid={meta.error && meta.touched}
                                                                />
                                                                <div className="errors">
                                                                    {meta.error && meta.touched &&
                                                                        <span>{meta.error}</span>}
                                                                </div>
                                                            </>
                                                        )}
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="company">Компания</Label>
                                                    <Field name="company">
                                                        {({input, meta}) => (
                                                            <>
                                                                <Input {...input}
                                                                       type="text"
                                                                       name="company"
                                                                       placeholder="Компания"
                                                                       required={true}
                                                                       invalid={meta.error && meta.touched}
                                                                />
                                                                <div className="errors">
                                                                    {meta.error && meta.touched &&
                                                                        <span>{meta.error}</span>}
                                                                </div>
                                                            </>
                                                        )}
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="phone">Телефон</Label>
                                                    <Field name="phone">

                                                        {({input, meta}) => (
                                                            <>
                                                                <Input
                                                                    {...input}
                                                                    type="text" name="phone"
                                                                    placeholder="Телефон"
                                                                    required={true}
                                                                    invalid={meta.error && meta.touched}
                                                                />
                                                                <div className="errors">
                                                                    {meta.error && meta.touched &&
                                                                        <span>{meta.error}</span>}
                                                                </div>
                                                            </>
                                                        )}
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="email">E-mail</Label>
                                                    <Field name="email">
                                                        {({input, meta}) => (
                                                            <>
                                                                <Input
                                                                    {...input}
                                                                    type="email" name="email"
                                                                    placeholder="E-mail"
                                                                    required={true}
                                                                    invalid={meta.error && meta.touched}
                                                                />
                                                                <div className="errors">
                                                                    {meta.error && meta.touched &&
                                                                        <span>{meta.error}</span>}
                                                                </div>
                                                            </>
                                                        )}
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label htmlFor="comment">Комментарий</Label>
                                                    <Field name="comment">
                                                        {({input, meta}) => (
                                                            <>
                                                                <Input
                                                                    {...input}
                                                                    type="textarea"
                                                                    name="comment"
                                                                    rows="4"
                                                                    placeholder="Комментарий"
                                                                    required={false}
                                                                />
                                                            </>
                                                        )}
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-center">
                                            <Col md={4}>
                                                <FormGroup>
                                                    <button type="submit"
                                                            disabled={!valid}
                                                            className="btn btn-warning menu-btn">
                                                        <FontAwesomeIcon icon="fa-solid fa-user-plus"/>
                                                        Добавить клиента
                                                    </button>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-center">
                                            <Col md={2}>
                                                <FormGroup>
                                                    <a type="button" href="/clients/"
                                                       className="btn btn-secondary">Отменить</a>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        {serverResponse && (<span className="mt-3 errors">{serverResponse} </span>)}
                                    </form>
                                )}
                            />
                        </Container>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

const AddClient = () => {
    return (<div className="App">
        <AddClientForm/>
    </div>);
}

export default AddClient;

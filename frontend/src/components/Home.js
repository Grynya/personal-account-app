import UserService from "../services/UserService";
import {useLocation} from "react-router";
import {useNavigate} from "react-router-dom";
import {Button, FormGroup, Input, Label} from "reactstrap";
import {Field, Form} from "react-final-form";

const FullRegistrarForm = (previousEmail) => {
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        values.email = previousEmail.email;
        let res = await new UserService().fullRegistrar(values);
        if (res.status === 200) {
            navigate('/home', {state: {isFull: true, email: previousEmail.email}});
        }
    }
    return (
        <div className="container">
            <div className="row d-flex justify-content-center">
                <div className="col-md-6">
                    <div className="card p-10 px-8 py-5 mt-3 align-items-center">
                        <FormGroup><span className="text-1">Завершение регистрации</span></FormGroup>
                        <FormGroup>
                            <img className="line-10" src={require("../img/line.png")} alt=""/>
                        </FormGroup>
                        <Form
                            onSubmit={handleSubmit}
                            validate={values => {
                                const errors = {};

                                function validatePhone(phone) {
                                    const re = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
                                    return re.test(String(phone).toLowerCase());
                                }

                                if (!values.companyName) {
                                    errors.companyName = "Заполните это поле";
                                } else if (values.companyName.length < 3 || values.companyName.length > 50) {
                                    errors.companyName = "Название компании должно содержать от 5 до 50 символов";
                                }
                                if (!values.phone) {
                                    errors.phone = "Заполните это поле";
                                } else if (!validatePhone(values.phone)) {
                                    errors.phone = "Некорректный номер телефона";
                                }
                                if (!values.inn) {
                                    errors.inn = "Заполните это поле";
                                }
                                return errors;
                            }}
                            render={({handleSubmit, values, submitting, validating, valid}) => (
                                <form onSubmit={handleSubmit}>
                                    <FormGroup className="mt-3">
                                        <Label htmlFor="email" className="form-label">Email</Label>
                                        <Field name="email">
                                            {({input, meta}) => (
                                                <div>
                                                    <Input
                                                        {...input}
                                                        type="text" id="email" name="email"
                                                        placeholder="Email"
                                                        value={previousEmail.email}
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
                                        <Label htmlFor="phone" className="form-label">Телефон</Label>
                                        <Field name="phone">
                                            {({input, meta}) => (
                                                <div>
                                                    <Input
                                                        {...input}
                                                        type="text" id="phone" name="phone"
                                                        placeholder="Телефон"
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
                                        <Label htmlFor="companyName" className="form-label">Название компании</Label>
                                        <Field name="companyName">
                                            {({input, meta}) => (
                                                <div>
                                                    <Input
                                                        {...input}
                                                        type="text" id="companyName" name="companyName"
                                                        placeholder="Название компании"
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
                                        <Label htmlFor="inn" className="form-label">INN</Label>
                                        <Field name="inn">
                                            {({input, meta}) => (
                                                <div>
                                                    <Input
                                                        {...input}
                                                        type="text" id="inn" name="inn"
                                                        placeholder="INN"
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
                                                    с <a href="#">правилами использования</a><br/> и даю согласие на обробтку моих данных</span>
                                                </Label>
                                            )}
                                        </Field>
                                    </FormGroup>
                                    <FormGroup className="d-flex justify-content-center">
                                        <Button className="mt-3 btn-warning custom-btn" type="submit" disabled={!valid}>
                                            <span>Отправить</span>
                                        </Button>
                                    </FormGroup>
                                    <FormGroup className="d-flex justify-content-center">
                                        <Button className="mt-3 btn-secondary custom-btn" onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/login/')
                                        }}>
                                            <span>Отмена</span>
                                        </Button>
                                    </FormGroup>
                                </form>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
const TwoButtonMenu = () => {
    return (
        <div className="d-flex justify-content-center align-items-center menu-buttons">
            <a href="/clients/" className="btn btn-outline-secondary menu-btn btn-lg">Управление клиентами</a>
            <a href="/registrars/" className="btn btn-outline-secondary menu-btn btn-lg">Управление кассами</a>
        </div>
    )
}
const Home = () => {
    const {state} = useLocation(); //get state and email
    if (!state || state.isFull) {
        return (
            <div className="App">
                <TwoButtonMenu/>
            </div>
        );
    } else {
        return (
            <div className="App">
                <FullRegistrarForm email={state.email}/>
            </div>
        );
    }
}
export default Home;

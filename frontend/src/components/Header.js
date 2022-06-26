import React from 'react'
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import fontawesome from '@fortawesome/fontawesome'
import {faUser} from '@fortawesome/fontawesome-free-solid'
import UserService from "../services/UserService";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router";

fontawesome.library.add(faUser);

const Logout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    if (location.pathname !== "/"
        && location.pathname.match("\\/login\\/.*") === null
        && location.pathname.match("\\/registrar\\/.*") === null
    && location.pathname.match("\\/confirm\\/.*") === null ) {
        const logout = async (e) => {
            console.log(await new UserService().logOut());
            navigate('/login/');
        };
        return (<NavDropdown.Item onClick={logout}>Выйти</NavDropdown.Item>)
    }
}

const Header = () => {
    return (
        <Navbar className="Header">
            <Container>
                <Nav className="vector">
                    <NavDropdown align="end" className="nav-drop-down" title={<FontAwesomeIcon icon="fa-solid fa-user"/>}>
                        <NavDropdown.Item href="/">Войти</NavDropdown.Item>
                        <NavDropdown.Item href="/registrar/">Зарегестроваться</NavDropdown.Item>
                        <Logout/>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Header

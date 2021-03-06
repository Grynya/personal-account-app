import React from "react";
import {Row, Container, Spinner} from "react-bootstrap";

const Loading = () => (
    <Row className="bg-secondary min-vh-100">
        <Container className="vertical-center">
            <div className="jumbotron col-4 offset-4 mx-auto text-center">
                <Spinner animation="border" />
            </div>
        </Container>
    </Row>
);

export default Loading;

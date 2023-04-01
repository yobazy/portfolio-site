import logo from '../assets/img/logo.svg';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import { Container, Row, Col } from 'react-bootstrap';
import '../App.css';

export const Footer = () => {
    return(
        <footer className='footer'>
            <Container>
                <Row className='align-items-center'>
                    <Col sm={6}>
                        <h2>Thanks!</h2>
                    </Col>
                    <Col sm={6} className='text-center text-sm-end'>
                        <div className='social-icon'>
                            <a href="https://www.linkedin.com/in/
bazilkhan" target="_blank" rel="noopener noreferrer"><img src={navIcon1} alt=""></img></a>
                            <a href="https://github.com/yobazy" target="_blank" rel="noopener noreferrer"><img src={navIcon2} alt=""></img></a>                        </div>
                        <p>Copyright 2023. All Right Reserved</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
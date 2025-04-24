import { Container, Row, Col } from 'react-bootstrap';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import '../App.css';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className='footer'>
            <Container>
                <Row className='align-items-center'>
                    <Col sm={6}>
                        <div className='footer-content'>
                            <h3>Let's Connect</h3>
                            <p>Feel free to reach out for collaborations or just a friendly chat.</p>
                        </div>
                    </Col>
                    <Col sm={6} className='text-center text-sm-end'>
                        <div className='social-icons-container'>
                            <a 
                                href="https://www.linkedin.com/in/bazilkhan" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon-link"
                                aria-label="LinkedIn Profile"
                            >
                                <img src={navIcon1} alt="LinkedIn Icon" className="social-icon-img" />
                            </a>
                            <a 
                                href="https://github.com/yobazy" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon-link"
                                aria-label="GitHub Profile"
                            >
                                <img src={navIcon2} alt="GitHub Icon" className="social-icon-img" />
                            </a>
                        </div>
                        <p className='copyright'>© {currentYear} All Rights Reserved</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
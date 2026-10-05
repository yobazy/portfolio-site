import { useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import '../App.css';

const EMAIL = 'bazilkhn@gmail.com';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    // The link opens a mail app; this is for people who'd rather paste it.
    const copy = () => {
        navigator.clipboard?.writeText(EMAIL).then(() => {
            setCopied(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 2000);
        }, () => {});
    };

    return (
        <footer className='footer'>
            <Container>
                <Row className='align-items-center'>
                    <Col sm={6}>
                        <div className='footer-content'>
                            <h3>Let's connect</h3>
                            <p>Collaborations, roles, or a note about the work.</p>
                            <div className='footer-email'>
                                <a href={`mailto:${EMAIL}`} className='footer-email-link'>
                                    {EMAIL}
                                </a>
                                {navigator.clipboard && (
                                    <button type='button' className='footer-copy' onClick={copy}>
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                )}
                                <span className='visually-hidden' aria-live='polite'>
                                    {copied ? 'Email copied' : ''}
                                </span>
                            </div>
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
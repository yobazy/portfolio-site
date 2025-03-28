import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
    <Navbar expand="lg" className="navbar-backdrop">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {/* <img src={logo} alt="Welcome"/> */}
          <span className={activeLink === '/' ? 'active navbar-link' : 'navbar-link'} 
                style={{ color: 'white' }}>
            Welcome
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={activeLink === '/' ? 'active' : ''}
              onClick={() => onUpdateActiveLink('/')}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/projects" 
              className={activeLink === '/projects' ? 'active' : ''}
              onClick={() => onUpdateActiveLink('/projects')}
            >
              Projects
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/media" 
              className={activeLink === '/media' ? 'active' : ''}
              onClick={() => onUpdateActiveLink('/media')}
            >
              Media
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/blog" 
              className={activeLink === '/blog' ? 'active' : ''}
              onClick={() => onUpdateActiveLink('/blog')}
            >
              Blog
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about"
              className={activeLink === '/about' ? 'active' : ''}
              onClick={() => onUpdateActiveLink('/about')}
            >
              About
            </Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a href="https://www.linkedin.com/in/bazilkhan" target="_blank" rel="noopener noreferrer">
                <img src={navIcon1} alt="LinkedIn" />
              </a>
              <a href="https://github.com/yobazy" target="_blank" rel="noopener noreferrer">
                <img src={navIcon2} alt="GitHub" className="nav-icon" />
              </a>
            </div>        
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Banner = () => {
  return (
    <section className='banner'>
      <Container>
        <Row className="align-items-center">
          <Col lg={8}>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="banner-content"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="banner-greeting"
              >
                Hello, I'm Bazil
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Full Stack
                <span className="accent-text">Developer</span>
              </motion.h1>
              
              <motion.p 
                className="banner-description"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Crafting robust web applications and turning complex problems into elegant solutions
              </motion.p>
              
              <motion.div
                className="banner-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link to="/projects" className="btn-primary">
                  View My Work
                </Link>
                <Link to="/about" className="btn-secondary">
                  About Me
                </Link>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
      <div className="banner-background"></div>
    </section>
  );
};
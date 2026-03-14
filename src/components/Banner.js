import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import headerImg from '../assets/img/header-img-banner.jpg';

export const Banner = () => {
  return (
    <section className='banner'>
      <Container>
        <Row className="align-items-center">
          <Col lg={7}>
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
                className="banner-eyebrow"
              >
                <span>Bazil K.</span>
                <span className="eyebrow-divider" />
                <span>Software Engineer</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                I build<br/>
                backend systems<br/>
                <span className="accent-text">end-to-end.</span>
              </motion.h1>

              <motion.p
                className="banner-description"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Senior Software Engineer in Toronto. Cloud architecture, APIs, CI/CD, and full-stack products — whatever layers the work needs.
              </motion.p>

              <motion.div
                className="banner-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link to="/projects" className="btn-primary">
                  View Projects
                </Link>
                <a href="https://bkvisuals100.pixieset.com/" className="btn-secondary" target="_blank" rel="noopener noreferrer">
                  Media Work
                </a>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <motion.div
        className="banner-portrait"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <img
          src={headerImg}
          alt="Bazil K."
          className="banner-portrait-img"
        />
      </motion.div>

      <div className="banner-decorative-elements">
        <div className="banner-grid-overlay" aria-hidden="true" />
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        aria-hidden="true"
      >
        <div className="scroll-line" />
        <span>scroll</span>
      </motion.div>
    </section>
  );
};

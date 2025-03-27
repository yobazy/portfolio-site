import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

export const Banner = () => {
  return (
    <section className='banner'>
      <Container>
        <Row>
          <Col lg={8}>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="banner-content"
            >
              <h1>CREATIVE<br/>DEVELOPER</h1>
              <p className="mega-text">BUILDING DIGITAL EXPERIENCES</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                EXPLORE WORK
              </motion.button>
            </motion.div>
          </Col>
        </Row>
      </Container>
      <div className="banner-overlay"></div>
    </section>
  );
};
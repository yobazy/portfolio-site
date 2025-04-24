import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import headerImg from '../assets/img/header-img-banner.jpg'; // Make sure this path is correct
import { TypeAnimation } from 'react-type-animation';
import { ArrowRightCircle } from 'lucide-react';

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
                Hey, I'm Bazil
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <TypeAnimation
                  sequence={[
                    'Full Stack', 3000,
                    'Frontend', 3000,
                    'Backend', 3000,
                    'Cloud', 3000,
                  ]}
                  wrapper="span"
                  speed={40}
                  repeat={Infinity}
                />
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
                  View Development Work
                </Link>
                <Link to="/media" className="btn-secondary">
                  Show Media Work
                </Link>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
      
      <div className="banner-background">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          src={headerImg}
          alt=""
          className="banner-image"
        />
      </div>
      
      {/* Decorative Elements */}
      <div className="banner-decorative-elements">
        <div className="code-bracket bracket-left">{`{`}</div>
        <div className="code-bracket bracket-right">{`}`}</div>
        
        <div className="floating-elements">
          <motion.div
            className="floating-element element-1"
            animate={{
              y: [0, 20, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="floating-element element-2"
            animate={{
              y: [0, -20, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="floating-element element-3"
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="code-dots dots-1"></div>
        <div className="code-dots dots-2"></div>
      </div>
    </section>
  );
};
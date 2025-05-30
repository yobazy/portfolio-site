import { Row, Col, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import aboutImage from '../assets/img/about.JPG';

export const About = () => {
    const desc = "Hi there! I'm Bazil, a Full-Stack Developer with a unique background in Civil Engineering. I'm passionate about innovation and technology and engineering methodologies. As a graduate of Lighthouse Labs Web Development Bootcamp and the University of Alberta, I've honed a wide range of software, tools, and technical skills." 
    const desc2 = "I'm dedicated to creating impactful solutions, and my portfolio showcases a range of successful projects that demonstrate my adaptability and talent. If you're looking for a developer who can tackle real-world problems with a lighthearted, yet effective approach, look no further - I'm your guy!"
    
    return(
        <section className='about' id='about'>
            <Container>
                <Row className="align-items-center">
                    <Col lg={6}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="about-content"
                        >
                            <h2>About Me</h2>
                            <div className="about-text">
                                <p>{desc}</p>
                                <p>{desc2}</p>
                            </div>
                        </motion.div>
                    </Col>
                    <Col lg={6}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="about-image"
                        >
                            <img src={aboutImage} alt="About" />
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
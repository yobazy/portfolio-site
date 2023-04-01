import { Row, Col, Container, Tab, Nav } from "react-bootstrap";
import colorSharp2 from '../assets/img/color-sharp2.png';

export const About = () => {
    const desc = "Hi there! I'm Bazil, a Full-Stack Developer with a unique background in Civil Engineering. I'm passionate about innovation and technology and engineering methodologies. As a graduate of Lighthouse Labs Web Development Bootcamp and the University of Alberta, I've honed a wide range of software, tools, and technical skills." 
    const desc2 = "I'm dedicated to creating impactful solutions, and my portfolio showcases a range of successful projects that demonstrate my adaptability and talent. If you're looking for a developer who can tackle real-world problems with a lighthearted, yet effective approach, look no further - I'm your guy!"
    
    return(
        <section className='about' id='about'>
        <Container>
            <Row>
                <Col>
                    <h2>About</h2>
                    <p>{desc}</p>
                    <p>{desc2}</p>

                </Col>
            </Row>
            </Container>
        </section>
    )
}
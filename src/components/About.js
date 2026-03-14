import { Row, Col, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import aboutImage from '../assets/img/about.JPG';

export const About = () => {
    const desc = "I'm Bazil, a Senior Software Developer at Metrolinx. I build cloud architecture and CN integrations for Ontario's railway operations — Azure Container Apps, React, Node.js, the whole stack. I got into software after a civil engineering degree (Bachelor's and Master's) at the University of Alberta. Systems thinking from that carried over."
    const desc2 = "Most of my recent work is backend-heavy: Azure infrastructure, API design, C#, and Node.js. Before Metrolinx I spent two years at ONxpress building middleware for a $1.6B rail project, and before that was at a real estate startup in Berkeley porting their app to Next.js. I also shoot photography and video, which is what the other half of this site is about."

    const experience = [
        {
            role: "Senior Software Developer",
            company: "Metrolinx",
            period: "Sept 2025 – Present",
            desc: "Enterprise cloud architecture and CN–Metrolinx integrations. Azure Container Apps, React, Node.js, MongoDB."
        },
        {
            role: "Senior DevOps Engineer & Backend Developer",
            company: "ONxpress Transportation Partners",
            period: "July 2023 – June 2025",
            desc: "Azure middleware infrastructure for a $1.6B rail project. C#/.NET, CI/CD pipelines, promoted from Developer."
        },
        {
            role: "Full Stack Developer",
            company: "UrbanEyes Real Estate Technologies",
            period: "Nov 2022 – July 2023",
            desc: "Ported the app to Next.js, built map features, deployed to Vercel."
        }
    ];

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
                <Row>
                    <Col>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="about-experience"
                        >
                            <h3>Experience</h3>
                            <div className="experience-list">
                                {experience.map((item, index) => (
                                    <div className="experience-item" key={index}>
                                        <div className="experience-header">
                                            <span className="experience-role">{item.role}</span>
                                            <span className="experience-period">{item.period}</span>
                                        </div>
                                        <div className="experience-company">{item.company}</div>
                                        <div className="experience-desc">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

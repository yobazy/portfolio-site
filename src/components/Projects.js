import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import projScheduler from '../assets/img/proj-scheduler.png';
import projJungle from '../assets/img/proj-jungle.png';
import projReasonable from '../assets/img/proj-reasonable.png';
import projTiny from '../assets/img/proj-tinyapp.png';
import projFestify from '../assets/img/proj-festify.png'
export const Projects = () => {
    const [demoOpen, setDemoOpen] = useState(false);

    const featuredProjects = [
        {
            title: "Festify",
            description: "A React app which curates personalized Spotify playlists featuring artists from music events.",
            imgURL: projFestify,
            skills: "React, Node.js, MongoDB, Spotify API",
            url: "https://github.com/yobazy/festify-2.0"
        }
    ];

    const demoProjects = [
        {
            title: "Scheduler",
            description: "An appointment booking application. Users can book with specific clients, add/remove bookings.",
            imgURL: projScheduler,
            skills: "React, Javascript, CSS/SCSS, HTML",
            url: "https://github.com/yobazy/scheduler"
        },
        {
            title: "Jungle",
            description: "A mini-ecommerce application catered around plants to learn the Ruby on Rails ecosystem.",
            imgURL: projJungle,
            skills: "React, Javascript, RubyOnRails, PostgreSQL",
            url: "https://github.com/yobazy/jungle"
        },
        {
            title: "TinyApp",
            description: "A full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).",
            imgURL: projTiny,
            skills: "Node.js, Express, EJS, CSS/SCSS, HTML",
            url: "https://github.com/yobazy/tinyapp"
        },
        {
            title: "Reasonable Realities",
            description: "A (demo) website where users can buy and sell avatars for use with VR.",
            imgURL: projReasonable,
            skills: "Javascript, Express, PostgreSQL, JQuery, AJAX",
            url: "https://github.com/yobazy/buy-sell-website"
        }
    ];

    return (
        <section className="project" id="projects">
            <Container>
                <Row>
                    <Col>
                        <motion.div 
                            className="project-bx"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2>Featured Projects</h2>
                            <p>Production-ready applications showcasing full-stack development capabilities.</p>
                            <Row>
                                {featuredProjects.map((project, index) => (
                                    <Col key={index} sm={6} md={4}>
                                        <ProjectCard {...project} />
                                    </Col>
                                ))}
                            </Row>
                        </motion.div>

                        <div className="demo-projects-toggle">
                            <button
                                className="demo-toggle-btn"
                                onClick={() => setDemoOpen(o => !o)}
                                aria-expanded={demoOpen}
                            >
                                <span>Bootcamp projects</span>
                                <span className="demo-toggle-arrow">{demoOpen ? '↑' : '↓'}</span>
                            </button>
                            <AnimatePresence>
                                {demoOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.35 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <Row className="demo-projects-grid">
                                            {demoProjects.map((project, index) => (
                                                <Col key={index} sm={6} md={4}>
                                                    <ProjectCard {...project} isDemo={true} />
                                                </Col>
                                            ))}
                                        </Row>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
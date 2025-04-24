import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import projScheduler from '../assets/img/proj-scheduler.png';
import projJungle from '../assets/img/proj-jungle.png';
import projReasonable from '../assets/img/proj-reasonable.png';
import projTiny from '../assets/img/proj-tinyapp.png';
import projFestify from '../assets/img/proj-festify.png'
import Carousel from "react-multi-carousel";
import { useState } from 'react';

export const Projects = () => {
    const [activeCategory, setActiveCategory] = useState('personal');

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    const personalProjects = [
        {
            title: 'Festify',
            description: 'A React app which curates personalized Spotify playlists featuring artists from music events.',
            skills: 'React, Javascript, RubyOnRails, PostgreSQL',
            url: 'https://github.com/yobazy/festify-2.0',
            imgURL: projFestify,
        },
        {
            title: 'Scheduler',
            description: 'An appointment booking application. Users can book with specific clients, add/remove bookings.',
            skills: 'React, Javascript, CSS/SCSS, HTML',
            url: "https://github.com/yobazy/scheduler",
            imgURL: projScheduler,
        },
        {
            title: 'Jungle',
            description: 'A mini-ecommerce application catered around plants to learn the Ruby on Rails ecosystem.',
            skills: 'React, Javascript, RubyOnRails, PostgreSQL',
            url: "https://github.com/yobazy/scheduler",
            imgURL: projJungle,
        },
        {
            title: 'TinyApp',
            description: 'A full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).',
            skills: 'Node.js, Express, EJS, CSS/SCSS, HTML',
            url: "https://github.com/yobazy/tinyapp",
            imgURL: projTiny,
        },
        {
            title: 'Reasonable Realities',
            description: 'A (demo) website where users can buy and sell avatars for use with VR.',
            skills: 'Javascript, Express, PostgreSQL, JQuery, AJAX, EJS, CSS/SCSS, HTML',
            url: "https://github.com/yobazy/buy-sell-website",
            imgURL: projReasonable,
        },
        // add more unique projects
    ];

    const clientProjects = [
        // Add your client projects here
        {
            title: 'Client Project 1',
            description: 'Description...',
            skills: 'React, Javascript, etc',
            url: 'url-here',
            imgURL: 'image-url',
        },
        // ... more client projects
    ];

    const currentProjects = activeCategory === 'personal' ? personalProjects : clientProjects;

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
            url: "https://github.com/yobazy/scheduler"
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

                        <motion.div 
                            className="project-bx demo-projects"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2>Demo Projects</h2>
                            <p>Learning projects developed during my software engineering bootcamp, demonstrating various technical concepts and skills.</p>
                            <Row>
                                {demoProjects.map((project, index) => (
                                    <Col key={index} sm={6} md={4}>
                                        <ProjectCard {...project} isDemo={true} />
                                    </Col>
                                ))}
                            </Row>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
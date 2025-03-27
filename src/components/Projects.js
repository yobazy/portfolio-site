import { Row, Col, Container, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
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

    return(
        <section className='project' id='projects'>
            <Container>
                <Row>
                    <Col>
                        <div className="project-bx">
                            <h2>Projects</h2>
                            <p>Here are some of the projects I've worked on:</p>
                            
                            <div className="project-categories">
                                <Nav className="project-nav">
                                    <Nav.Link 
                                        className={`project-nav-link ${activeCategory === 'personal' ? 'active' : ''}`}
                                        onClick={() => setActiveCategory('personal')}
                                    >
                                        Personal Work
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`project-nav-link ${activeCategory === 'client' ? 'active' : ''}`}
                                        onClick={() => setActiveCategory('client')}
                                    >
                                        Client Work
                                    </Nav.Link>
                                </Nav>
                            </div>

                            <Carousel responsive={responsive} infinite={true} className='project-slider'>
                                {currentProjects.map((project, index) => (
                                    <div className='carousel-item-padding project-card' key={index}>
                                        <ProjectCard {...project} />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
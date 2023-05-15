import { Row, Col, Container } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import projImg from '../assets/img/color-sharp2.png';
import Carousel from "react-multi-carousel";

export const Projects = () => {
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    const projects = [
        {
            title: 'Festify',
            description: 'A React app which curates personalized Spotify playlists featuring artists from music events.',
            skills: 'javascript',
            imgURL: projImg,
        },
        {
            title: 'Festify',
            description: 'A React app which curates personalized Spotify playlists featuring artists from music events.',
            skills: 'javascript',
            imgURL: projImg,
        },
        {
            title: 'Festify',
            description: 'A React app which curates personalized Spotify playlists featuring artists from music events.',
            skills: 'javascript',
            imgURL: projImg,
        },
        // add more unique projects
    ]

    const projectCards = projects.length > 0 ? (
        projects.map((project, index) => (
            <div className='carousel-item-padding' key={index}>
                <ProjectCard {...project} />
            </div>))
    ) : (
        <p>No projects to display at this time.</p>
    );

    return(
        <section className='project' id='projects'>
            <Container>
                <Row>
                    <Col>
                        <div className="project-bx">
                            <h2>Projects</h2>
                            <p>Here are some of the projects I've worked on:</p>
                            <Carousel responsive={responsive} infinite={true} className='project-slider'>
                                {projectCards}
                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
import { Row, Col, Container, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import colorSharp2 from '../assets/img/color-sharp2.png';
import projImg from '../assets/img/color-sharp2.png'

export const Projects = () => {
    
    const projects = [
        {
            title: 'Project1',
            description: 'Design and Development',
            imgURL: projImg,
        }
    ]

    return(
        <section className='project' id='projects'>
        <Container>
            <Row>
                <Col>
                    <h2>Projects</h2>
                    <p>Lorem ipsum</p>
                    <Tab.Container id="project-tabs" defaultActiveKey={"first"}>
                    <Nav variant="pills" defaultActiveKey='/home' className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                        <Nav.Item>
                        <Nav.Link eventKey="first">Tab 1</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="second">Tab 2</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="third">Tab 3</Nav.Link>
                        </Nav.Item>
                  </Nav>
                  </Tab.Container>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                        <Row>
                            {
                                projects.map((project, index) => {
                                    return (
                                        <ProjectCard
                                            key={index}
                                            {...project}
                                            />
                                    )
                                })
                            }
                        </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">Lorem ipsum</Tab.Pane>
                    <Tab.Pane eventKey="third">Lorem ipsum</Tab.Pane>
                  </Tab.Content>
                </Col>
            </Row>
            </Container>
            <img className="background-image-right" src={colorSharp2}/>
        </section>
    )
}
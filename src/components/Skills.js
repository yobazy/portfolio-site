import { Container, Row, Col } from 'react-bootstrap'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faGitAlt, faJsSquare, faHtml5, faCss3Alt, faReact, faNodeJs, faAutoprefixer, faCuttlefish, faConnectdevelop } from '@fortawesome/free-brands-svg-icons';
import { faServer, faCode, faDatabase, faFlask, faRocket, faBook, faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';


export const Skills = () => {
    const iconSize = "3x"
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <section className='skill' id='skills'>
            <Container>
                <Row>
                    <Col>
                        <div className='skill-bx'>
                            <h2>
                                Skills
                            </h2>
                            <p>Lorem ipsum</p>
                            <Carousel responsive={responsive} infinite={true} className='skill-slider'>

                                <div className="item">
                                    <FontAwesomeIcon icon={faReact} size={iconSize} />
                                    <h5>ReactJS</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faJsSquare} size={iconSize} />
                                    <h5>JavaScript (+Typescript)</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faPython} size={iconSize} />
                                    <h5>Python</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faDatabase} size={iconSize} />
                                    <h5>PostgreSQL</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faGitAlt} size={iconSize} />
                                    <h5>Git/Github</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faConnectdevelop} size={iconSize} />
                                    <h5>Express</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faHtml5} size={iconSize} />
                                    <h5>HTML</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faCss3Alt} size={iconSize} />
                                    <h5>CSS</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faMagnifyingGlassChart} size={iconSize} />
                                    <h5>TensorFlow</h5>
                                </div>
                                <div className="item">
                                <FontAwesomeIcon icon={faFlask} size={iconSize} />
                                    <h5>JupyterLab</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faBook} size={iconSize} />
                                    <h5>Notion</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faServer} size={iconSize} />
                                    <h5>RubyonRails</h5>
                                </div>

                                <div className="item">
                                    <FontAwesomeIcon icon={faCode} size={iconSize} />
                                    <h5>REST API</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faNodeJs} size={iconSize} />
                                    <h5>NextJS</h5>
                                </div>
                                <div className="item">
                                    <FontAwesomeIcon icon={faRocket} size={iconSize} />
                                    <h5>Vercel</h5>
                                </div>

                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
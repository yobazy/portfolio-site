import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faGitAlt, faJsSquare, faHtml5, faCss3Alt, faReact, faNodeJs, faConnectdevelop, faFigma, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faServer, faCode, faDatabase, faFlask, faRocket, faBook, faMagnifyingGlassChart, faChartLine, faCube, faTerminal, faGears, faWandMagicSparkles, faCloud } from '@fortawesome/free-solid-svg-icons';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AnimatedBackground from './AnimatedBackground';

export const Skills = () => {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 769 }, items: 2, slidesToSlide: 1 },
        mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 }
    };

    const skillCategories = [
        {
            title: "Frontend",
            skills: [
                { icon: faReact, name: "React" },
                { icon: faJsSquare, name: "JS/TS" },
                { icon: faHtml5, name: "HTML" },
                { icon: faCss3Alt, name: "CSS" },
                { icon: faNodeJs, name: "Next.js" },
                { icon: faFigma, name: "Figma" },
            ]
        },
        {
            title: "Backend",
            skills: [
                { icon: faPython, name: "Python" },
                { icon: faServer, name: "Rails" },
                { icon: faConnectdevelop, name: "Express" },
                { icon: faCode, name: "REST" },
                { icon: faDatabase, name: "SQL" },
                { icon: faCode, name: "C#" },
                { icon: faDatabase, name: "Supabase" },
            ]
        },
        {
            title: "ML/Data",
            skills: [
                { icon: faMagnifyingGlassChart, name: "TensorFlow" },
                { icon: faFlask, name: "Jupyter" },
                { icon: faPython, name: "Python" },
                { icon: faChartLine, name: "PowerBI" },
                { icon: faCube, name: "PyTorch" },
                { icon: faDatabase, name: "Pandas" },
            ]
        },
        {
            title: "Tools",
            skills: [
                { icon: faGitAlt, name: "Git" },
                { icon: faRocket, name: "Vercel" },
                { icon: faBook, name: "Notion" },
                { icon: faTerminal, name: "Cursor" },
                { icon: faGears, name: "Github Actions" },
                { icon: faWandMagicSparkles, name: "Postman" },
                { icon: faCube, name: "Docker" },
                { icon: faCloud, name: "Azure" },
            ]
        }
    ];

    const SkillCategory = ({ title, skills }) => (
        <div className="skill-category">
            <h3>{title}</h3>
            <div className="skill-items">
                {skills.map((skill, idx) => (
                    <div className="skill-item" key={idx}>
                        <FontAwesomeIcon icon={skill.icon} />
                        <span>{skill.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <section className='skill' id='skills'>
            <AnimatedBackground />
            <Container>
                <div className='skill-bx'>
                    <h2>Skills</h2>
                    <div className="skills-container">
                        {/* Desktop View */}
                        <div className="desktop-skills">
                            <div className="skill-grid">
                                {skillCategories.map((category, index) => (
                                    <SkillCategory key={index} {...category} />
                                ))}
                            </div>
                        </div>
                        
                        {/* Mobile View with Carousel */}
                        <div className="mobile-skills">
                            <Carousel
                                responsive={responsive}
                                infinite={true}
                                autoPlay={false}
                                className="skill-carousel"
                                showDots={true}
                                removeArrowOnDeviceType={["mobile"]}
                            >
                                {skillCategories.map((category, index) => (
                                    <div key={index} className="carousel-skill-item">
                                        <SkillCategory {...category} />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faGitAlt, faJsSquare, faHtml5, faCss3Alt, faReact, faNodeJs, faConnectdevelop } from '@fortawesome/free-brands-svg-icons';
import { faServer, faCode, faDatabase, faFlask, faRocket, faBook, faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';

export const Skills = () => {
    const skillCategories = [
        {
            title: "Frontend",
            skills: [
                { icon: faReact, name: "React" },
                { icon: faJsSquare, name: "JS/TS" },
                { icon: faHtml5, name: "HTML" },
                { icon: faCss3Alt, name: "CSS" },
                { icon: faNodeJs, name: "Next.js" },
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
            ]
        },
        {
            title: "ML/Data",
            skills: [
                { icon: faMagnifyingGlassChart, name: "TensorFlow" },
                { icon: faFlask, name: "Jupyter" },
                { icon: faPython, name: "Python" },
            ]
        },
        {
            title: "Tools",
            skills: [
                { icon: faGitAlt, name: "Git" },
                { icon: faRocket, name: "Vercel" },
                { icon: faBook, name: "Notion" },
            ]
        }
    ];

    return (
        <section className='skill' id='skills'>
            <Container>
                <div className='skill-bx'>
                    <h2>Skills</h2>
                    <div className="skill-grid">
                        {skillCategories.map((category, index) => (
                            <div key={index} className="skill-category">
                                <h3>{category.title}</h3>
                                <div className="skill-items">
                                    {category.skills.map((skill, idx) => (
                                        <div className="skill-item" key={idx}>
                                            <FontAwesomeIcon icon={skill.icon} />
                                            <span>{skill.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
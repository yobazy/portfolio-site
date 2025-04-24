import { motion } from 'framer-motion';

const ProjectCard = ({ title, description, skills = '', url, imgURL, isDemo }) => {
    const skillArray = skills ? skills.split(',').map(skill => skill.trim()) : [];

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`project-card ${isDemo ? 'demo' : ''}`}
        >
            <div className="project-image">
                <img src={imgURL} alt={title} />
                <div className="project-overlay">
                    <h3>{title}</h3>
                    <p>{description}</p>
                    {skillArray.length > 0 && (
                        <div className="skills-tag">
                            {skillArray.map((skill, index) => (
                                <span key={index} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    )}
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        VIEW PROJECT
                    </a>
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectCard;
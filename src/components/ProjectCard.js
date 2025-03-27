import { motion } from 'framer-motion';

export const ProjectCard = ({ title, description, skills, url, imgURL }) => {
    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="project-card"
        >
            <div className="project-image">
                <img src={imgURL} alt={title} />
                <div className="project-overlay">
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <div className="skills-tag">
                        {skills.split(',').map((skill, index) => (
                            <span key={index} className="skill-tag">{skill.trim()}</span>
                        ))}
                    </div>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        VIEW PROJECT
                    </a>
                </div>
            </div>
        </motion.div>
    )
}
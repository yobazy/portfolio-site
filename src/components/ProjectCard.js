import { motion } from 'framer-motion';

const ProjectCard = ({ title, description, skills = '', url, imgURL, org, isDemo, compact }) => {
    const skillArray = skills ? skills.split(',').map(skill => skill.trim()) : [];

    return (
        <motion.div
            className={`project-card ${isDemo ? 'demo' : ''} ${compact ? 'compact' : ''}`}
        >
            <div className="project-image">
                {imgURL ? (
                    <img src={imgURL} alt={title} />
                ) : (
                    <div className="project-placeholder" aria-hidden="true" />
                )}
                <div className="project-overlay">
                    {org && <span className="project-org">{org}</span>}
                    <h3>{title}</h3>
                    <p className="project-desc">{description}</p>
                    {(skillArray.length > 0 || url) && (
                        <div className="project-details">
                            <div className="project-details-inner">
                                {skillArray.length > 0 && (
                                    <div className="skills-tag">
                                        {skillArray.map((skill, index) => (
                                            <span key={index} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                )}
                                {url && (
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                        VIEW PROJECT
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectCard;

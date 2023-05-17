import { Card, Button } from 'react-bootstrap';

export const ProjectCard = ({ title, description, skills, url, imgURL }) => {
    return (
        <Card className="mb-3 project-card" style={{ width: '100%', backgroundColor: '#0f171f' }}>
            <Card.Img variant="top" src={imgURL} className="card-img" />
            <Card.Body className="card-body">
                <div className='project-info'>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>
                        {description}
                    </Card.Text>
                </div>
                <div className="project-skills-button">
                    <div className="project-skills">
                        Skills: {skills}
                    </div>
                    <div className=''>
                        <Button variant="primary" href={url} target="_blank">View Project</Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}
import { Card, Button } from 'react-bootstrap';

export const ProjectCard = ({ title, description, skills, imgURL }) => {
    return (
        <Card className="mb-3" style={{ width: '100%' }}>
            <Card.Img variant="top" src={imgURL} className="card-img"/>
            <Card.Body style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {description}
                </Card.Text>
                <Card.Text>
                    Skills: {skills}
                </Card.Text>
                <Button variant="primary" href="#" target="_blank">View Project</Button>
            </Card.Body>
        </Card>
    )
}
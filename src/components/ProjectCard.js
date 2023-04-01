import { Col } from 'react-bootstrap';

export const ProjectCard = ({title, description, imgURL}) => {
    return(
        <Col sm={6} md={4}>
            <div className="proj-imgbx">
                <img src={imgURL}/>
                <div className='proj-txt'>
                    <h4>{title}</h4>
                    <span>{description}</span>
                </div>
            </div>
        </Col>
    )
}
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import projScheduler from '../assets/img/proj-scheduler.png';
import projJungle from '../assets/img/proj-jungle.png';
import projReasonable from '../assets/img/proj-reasonable.png';
import projTiny from '../assets/img/proj-tinyapp.png';
import proj360Ops from '../assets/img/proj-360-ops.png';
import projCnIntegration from '../assets/img/proj-cn-integration.png';
import projAzurePipelines from '../assets/img/proj-azure-pipelines.png';
import projUrbaneyes from '../assets/img/proj-urbaneyes.png';
import projFabricPipeline from '../assets/img/proj-fabric-pipeline.png';
import projHairstylist from '../assets/img/proj-hairstylist.png';
import projectImg2 from '../assets/img/project-img2.png';
import projectImg3 from '../assets/img/project-img3.png';

const sectionMotion = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
};

const ProjectSection = ({
    title,
    description,
    projects,
    className = '',
    isDemo = false,
    compact = false,
    colProps = { sm: 6, lg: 4 },
}) => (
    <motion.div className={`project-bx ${className}`.trim()} {...sectionMotion}>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        <Row className={compact ? 'g-3' : 'g-4'}>
            {projects.map((project) => (
                <Col key={project.title} {...colProps}>
                    <ProjectCard {...project} isDemo={isDemo} compact={compact} />
                </Col>
            ))}
        </Row>
    </motion.div>
);

export const Projects = () => {
    const professionalProjects = [
        {
            title: '360 Internal Operations Platform',
            org: 'Metrolinx',
            description:
                'Daily workflow platform for the operations team. React frontend, Node.js backend, MongoDB. Tech lead—owned end to end.',
            skills: 'React, Node.js, MongoDB',
            imgURL: proj360Ops,
        },
        {
            title: 'CN–Metrolinx Integration',
            org: 'Metrolinx',
            description:
                'Five containerized microservices on Azure Container Apps with event-driven architecture—20 queues, 10 RabbitMQ consumers, real-time rail data every 10–30s. Multi-org data isolation across CN and Metrolinx.',
            skills: 'Azure Container Apps, RabbitMQ, Microservices, Kubernetes',
            imgURL: projCnIntegration,
        },
        {
            title: 'Azure Data Pipelines',
            org: 'ONxpress',
            description:
                'Unified three source systems with automated business rules and transformations, powering 20+ daily operational reports for Finance and ops. Part of a $1.6B rail infrastructure program.',
            skills: 'Azure, Data Pipelines, ETL, SQL',
            imgURL: projAzurePipelines,
        },
        {
            title: 'UrbanEyes Real Estate Platform',
            description:
                'Ported the codebase to Next.js, shipped map features, and deployed to Vercel.',
            skills: 'Next.js, React, Vercel, Maps',
            imgURL: projUrbaneyes,
        },
    ];

    const clientProjects = [
        {
            title: 'Data Ingestion Pipeline',
            org: 'Contract',
            description:
                'Transforms raw data sources from Microsoft Fabric into presentation-ready format for downstream reporting and dashboards.',
            skills: 'Microsoft Fabric, ETL, Data Engineering',
            imgURL: projFabricPipeline,
        },
        {
            title: 'Hairstylist Website',
            org: 'Client',
            description: 'Website for an independent hairstylist.',
            skills: 'Web Development',
            imgURL: projHairstylist,
        },
    ];

    const personalProjects = [
        {
            title: 'BarberBot',
            description:
                'VAPI voice AI assistant in live pilot with an active barbershop. Handles inbound calls, books appointments, and connects to GoHighLevel CRM and Square—with no human in the loop.',
            skills: 'VAPI, Voice AI, GoHighLevel, Square',
            imgURL: projectImg2,
        },
        {
            title: 'MyFi',
            description:
                'Budgeting dashboard with a Django REST API and React frontend. Multi-bank statement processing and a rule-based categorization engine.',
            skills: 'Django, React, REST API, PostgreSQL',
            imgURL: projectImg3,
        },
    ];

    const demoProjects = [
        {
            title: 'Scheduler',
            description: 'Appointment booking app—book with clients, add and remove bookings.',
            imgURL: projScheduler,
            skills: 'React, Javascript, CSS/SCSS, HTML',
            url: 'https://github.com/yobazy/scheduler',
        },
        {
            title: 'Jungle',
            description: 'Mini ecommerce app for plants, built to learn Ruby on Rails.',
            imgURL: projJungle,
            skills: 'React, Javascript, RubyOnRails, PostgreSQL',
            url: 'https://github.com/yobazy/jungle',
        },
        {
            title: 'TinyApp',
            description: 'URL shortener built with Node and Express.',
            imgURL: projTiny,
            skills: 'Node.js, Express, EJS, CSS/SCSS, HTML',
            url: 'https://github.com/yobazy/tinyapp',
        },
        {
            title: 'Reasonable Realities',
            description: 'Demo marketplace for buying and selling VR avatars.',
            imgURL: projReasonable,
            skills: 'Javascript, Express, PostgreSQL, JQuery, AJAX',
            url: 'https://github.com/yobazy/buy-sell-website',
        },
    ];

    return (
        <section className="project" id="projects">
            <Container>
                <Row>
                    <Col>
                        <ProjectSection
                            title="Selected Work"
                            description="Production systems for transit operations, enterprise integration, and infrastructure programs."
                            projects={professionalProjects}
                        />

                        <ProjectSection
                            title="Client Work"
                            description="Contract and freelance builds for external clients."
                            projects={clientProjects}
                            className="project-section-spaced"
                        />

                        <ProjectSection
                            title="Personal Projects"
                            description="Side projects and tools built outside of day-to-day work."
                            projects={personalProjects}
                            className="project-section-spaced"
                        />

                        <ProjectSection
                            title="Earlier Projects"
                            description="Bootcamp demos from when I was learning the fundamentals."
                            projects={demoProjects}
                            className="project-section-spaced project-bx-secondary"
                            isDemo
                            compact
                            colProps={{ xs: 6, sm: 6, md: 3 }}
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

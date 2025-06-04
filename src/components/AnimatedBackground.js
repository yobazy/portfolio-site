import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faGitAlt, faJsSquare, faHtml5, faCss3Alt, faReact, faNodeJs, faConnectdevelop, faFigma } from '@fortawesome/free-brands-svg-icons';
import { faServer, faCode, faDatabase, faFlask, faRocket, faBook, faMagnifyingGlassChart, faChartLine, faCube } from '@fortawesome/free-solid-svg-icons';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
    const [particles, setParticles] = useState([]);
    
    // Define colors for different types of skills
    const colors = {
        frontend: ['#61DAFB', '#F7DF1E', '#E34F26', '#1572B6', '#764ABC', '#000000'],
        backend: ['#3776AB', '#CC6699', '#000000', '#4479A1', '#68217A', '#007ACC'],
        tools: ['#F05032', '#000000', '#000000', '#000000', '#2088FF', '#0DB7ED'],
        data: ['#FF6F00', '#F37626', '#000000', '#F2C80F', '#000000', '#1A73E8']
    };

    const icons = [
        { icon: faReact, name: "React", color: colors.frontend[0] },
        { icon: faJsSquare, name: "JS", color: colors.frontend[1] },
        { icon: faPython, name: "Python", color: colors.backend[0] },
        { icon: faGitAlt, name: "Git", color: colors.tools[0] },
        { icon: faHtml5, name: "HTML", color: colors.frontend[2] },
        { icon: faCss3Alt, name: "CSS", color: colors.frontend[3] },
        { icon: faNodeJs, name: "Node", color: colors.backend[2] },
        { icon: faServer, name: "Server", color: colors.backend[3] },
        { icon: faDatabase, name: "DB", color: colors.data[0] },
        { icon: faFlask, name: "Flask", color: colors.backend[4] },
        { icon: faRocket, name: "Rocket", color: colors.tools[1] },
        { icon: faCube, name: "Cube", color: colors.data[1] },
    ];

    useEffect(() => {
        const createParticle = () => {
            const icon = icons[Math.floor(Math.random() * icons.length)];
            return {
                icon: icon.icon,
                name: icon.name,
                color: icon.color,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                speed: 0.575 + Math.random() * 1.15,
                size: 26 + Math.random() * 20, // Increased by 15% from previous values
                opacity: 0.1 + Math.random() * 0.3,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2
            };
        };

        // Initialize particles
        setParticles(Array.from({ length: 20 }, createParticle));

        const animate = () => {
            setParticles(prevParticles => 
                prevParticles.map(particle => {
                    let newY = particle.y - particle.speed;
                    let newRotation = particle.rotation + particle.rotationSpeed;

                    if (newY < -50) {
                        return createParticle();
                    }

                    return {
                        ...particle,
                        y: newY,
                        rotation: newRotation
                    };
                })
            );
        };

        const animationInterval = setInterval(animate, 16); // ~60fps

        return () => clearInterval(animationInterval);
    }, []);

    return (
        <div className="animated-background">
            {particles.map((particle, index) => (
                <div
                    key={index}
                    className="floating-icon"
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        transform: `rotate(${particle.rotation}deg)`,
                        opacity: particle.opacity,
                        fontSize: `${particle.size}px`,
                        color: particle.color
                    }}
                >
                    <FontAwesomeIcon icon={particle.icon} />
                </div>
            ))}
        </div>
    );
};

export default AnimatedBackground; 
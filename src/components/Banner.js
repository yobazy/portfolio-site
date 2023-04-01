import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import headerImg from '../assets/img/header-img.jpg'

const desc = "Hi there! I'm Bazil Khan, a Junior Full-Stack Developer with a unique background in Civil Engineering. I'm passionate about innovation and have a deep understanding of engineering methodologies, making me the perfect blend of tech and construction expertise. As a graduate of Lighthouse Labs Web Development Bootcamp and the University of Alberta, I've honed a wide range of software, tools, and technical skills. I'm dedicated to creating impactful solutions, and my portfolio showcases a range of successful projects that demonstrate my adaptability and talent. If you're looking for a developer who can tackle real-world problems with a lighthearted, yet effective approach, look no further - I'm your guy!"

export const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting]  = useState(false);
    const toRotate = ['Full-stack Developer', 'Civil Engineer'];
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random()*100);
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() =>  {
            tick();
        }, delta)
        return () => { clearInterval(ticker)};
    }, [text])

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1)

        setText(updatedText);

        if(isDeleting)  {
            setDelta(prevDelta => prevDelta/2)
        }

        if(!isDeleting && updatedText === fullText) {
            isDeleting(true);
            setDelta(period);
        } else if(isDeleting && updatedText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(500)
        }
    }
    <div class="banner-image"></div>

    return (
        <section className='banner' id='home'>
            <Container>
                <Row className='align-items-center'>
                    <Col xs={12} md={6} xl={7}>
                        <span className='tagline'>Welcome to my Web Porfolio</span>
                        <h1>{`Hi, I'm Bazil!`}</h1>
                        <h2><span>Full-Stack Developer</span></h2>
                        <h2><span>Civil Engineer (EIT)</span></h2>
                        <div>
                        <p>Here you can find information on my skills, projects I've worked on and where to contact me.</p>
                        <button onClick={() => console.log('connect')}>Let's connect</button><ArrowRightCircle size={25}/>
                        </div>
                    </Col>
                    <Col xs={12} md={6} xl={5}>
                        <img src={headerImg} alt='header img' className='header-img'/>
                    </Col>
                </Row>
            </Container>

        </section>
    )
}
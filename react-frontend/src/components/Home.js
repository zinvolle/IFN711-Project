import React from 'react';
import { Link } from 'react-router-dom';
import {Container, Navigation} from './containers.js';

//bunch of links to different endpoints in our website
function Home() {
    return(
        <Container>
            <Navigation/>
            <h1>Home</h1>
                
                <Link to="/viewblocks">
                <button class="btn btn-outline-primary">View Blocks</button>
                </Link>
                <Link to="/student/send">
                <button class="btn btn-outline-primary">Send To Employer</button>
                </Link>
                <Link to="/student/receive">
                <button class="btn btn-outline-primary">Student View</button>
                </Link>
                <Link to="/university/deploy">
                <button class="btn btn-outline-primary">Deploy Contract</button>
                </Link>
                <Link to="/employer/dashboard">
                <button class="btn btn-outline-primary">Employer View</button>
                </Link>
                <Link to="/contract/information">
                <button class="btn btn-outline-primary">Contract Information</button>
                </Link>
            
        
        </Container>
    )
}

export default Home;
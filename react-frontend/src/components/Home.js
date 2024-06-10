import React from 'react';
import { Link } from 'react-router-dom';
import {Container} from './containers.js';

//bunch of links to different endpoints in our website
function Home() {
    return(
        <Container>
            <h1>Homepage</h1>
                <Link to="/viewblocks">
                    <button>View Blocks</button>
                </Link>
                <Link to="/student/send">
                    <button>Send To Employer</button>
                </Link>
                <Link to="/student/receive">
                    <button>Student View</button>
                </Link>
                <Link to="/university/deploy">
                    <button>Deploy a contract</button>
                </Link>
                <Link to="/employer/dashboard">
                    <button>Employer View</button>
                </Link>
                <Link to="/contract/information">
                    <button>Contract Information</button>
                </Link>
            
        
        </Container>
    )
}

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navigation } from './containers.js';

//bunch of links to different endpoints in our website
function StudentPage() {
    return (
        <div className='app-container'>
            <div className='home-container'>
            <h1 style={{fontSize:'60px'}}>Student Page</h1>

            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', height:'400px'}}>
            <Link to="/viewblocks">
                <button class="navigationButton">View Blocks</button>
            </Link>
            <Link to="/student/send">
                <button class="navigationButton">Send To Employer</button>
            </Link>
            <Link to="/student/receive">
                <button class="navigationButton">Student View</button>
            </Link>
            <Link to="/contract/information">
                <button class="navigationButton" style={{fontSize:'26px'}}>Contract Information</button>
            </Link>
            </div>
            </div>
            </div>
    )
}

export default StudentPage;
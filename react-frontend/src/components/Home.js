import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navigation } from './containers.js';

//bunch of links to different endpoints in our website
function Home() {
    return (
        <div className='app-container'>
            <div className='home-container'>
                <h1 style={{fontSize:'60px'}}>Homepage</h1>

                <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', height:'300px'}}>
                <Link to="/createuser">
                    <button class="navigationButton">Create User</button>
                </Link>
                <Link to="/university/page">
                    <button class="navigationButton">University</button>
                </Link>
                <Link to="/employer/page">
                    <button class="navigationButton">Employer</button>
                </Link>
                <Link to="/student/page">
                    <button class="navigationButton">Student</button>
                </Link>
                </div>
            </div>
        </div>
    )
}

export default Home;
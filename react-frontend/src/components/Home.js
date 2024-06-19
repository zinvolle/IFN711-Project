import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navigation } from './containers.js';

//bunch of links to different endpoints in our website
function Home() {
    return (
        <div className='app-container'>
            <div className='home-container'>
                <h1 style={{fontSize:'60px'}}>Home</h1>

                <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', height:'300px'}}>
                <Link to="/university/page">
                    <button class="navigationButton">University</button>
                </Link>
                <Link to="/employer/page">
                    <button class="navigationButton">Employer</button>
                </Link>
                <Link to="/student/page">
                    <button class="navigationButton">Student</button>
                </Link>
                <div>
                    <h4> Dev Testing </h4>
                    <Link to="/crypto">
                    <button class="mx-1 btn btn-outline-primary">Crypto Example</button>
                    </Link>
                    <Link to="/pinata">
                    <button class="mx-1 btn btn-outline-primary">Pinata Test</button>
                    </Link>
                    <Link to="/userfetchtest">
                    <button class="mx-1 btn btn-outline-primary">User Fetch Test</button>
                    </Link>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
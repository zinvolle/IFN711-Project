import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navigation } from './containers.js';

//bunch of links to different endpoints in our website
function UniversityPage() {
    return (
        <div className='app-container'>
            <div className='home-container'>
                <h1 style={{fontSize:'60px'}}> University Page</h1>

                <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', height:'350px'}}>
                <Link to="/viewblocks">
                    <button class="navigationButton">View Blocks</button>
                </Link>
                <Link to="/university/deploy">
                    <button class="navigationButton">Deploy Contract</button>
                </Link>
                <Link to="/contract/information">
                    <button class="navigationButton" style={{fontSize:'26px'}}>Contract Information</button>
                </Link>
                <Link to="/createuser">
                    <button class="navigationButton">Create User</button>
                </Link>
                </div>
            </div>
        </div>
    )
}

export default UniversityPage;
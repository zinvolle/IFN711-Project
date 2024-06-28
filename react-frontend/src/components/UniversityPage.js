import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navigation } from './containers.js';

//bunch of links to different endpoints in our website
function UniversityPage() {
    return (
        <div className='app-container'>
            <Navigation>
                <li class="breadcrumb-item" aria-current="page">University</li>
            </Navigation>
            <div className='home-container'>
                <h1 style={{fontSize:'60px'}}> University Page</h1>

                <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', height:'350px'}}>
                <Link to="/university/deploy">
                    <button class="navigationButton">Deploy Contract</button>
                </Link>
                <Link to="/university/update">
                    <button class="navigationButton" style={{fontSize:'26px'}}>Update Contract</button>
                </Link>
                
                </div>
            </div>
        </div>
    )
}

export default UniversityPage;
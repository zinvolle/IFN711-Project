import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navigation } from './containers.js';

//bunch of links to different endpoints in our website
function EmployerPage() {
    return (
        <div className='app-container'>
            <Navigation>
                <li class="breadcrumb-item" aria-current="page">Employer</li>
            </Navigation>
            <div className='home-container'>
                <h1 style={{fontSize:'60px'}}>Employer Page</h1>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', height:'300px'}}>
                <Link to="/employer/login">
                    <button class="navigationButton">Employer Login</button>
                </Link>
                </div>
            </div>
        </div>
    )
}

export default EmployerPage;
import React from 'react';
import { Link } from 'react-router-dom';
import {Container, Navigation} from './containers.js';

//bunch of links to different endpoints in our website
function Home() {
    return(
        <Container>
            <Navigation/>
            <h1>Developer Homepage</h1>
            
                <div>
                    <h4> All Users </h4>
                    <Link to="/createuser">
                    <button class="mx-1 btn btn-outline-primary">Create User</button>
                    </Link>

                    <Link to="/viewblocks">
                    <button class="mx-1 btn btn-outline-primary">View Blocks</button>
                    </Link>


                    <Link to="/contract/information">
                    <button class="mx-1 btn btn-outline-primary">Contract Info</button>
                    </Link>
                </div>

                <div>
                    <h4> Students </h4>
                    <Link to="/student/send">
                    <button class="mx-1 btn btn-outline-primary">Send To Employer</button>
                    </Link>
                    <Link to="/student/receive">
                    <button class="mx-1 btn btn-outline-primary">Student View</button>
                    </Link>
                </div>

                <div class='row w-100'>
                    <div class="col">
                        <h4> Employers </h4>
                        <Link to="/employer/dashboard">
                        <button class="btn btn-outline-primary">Employer View</button>
                        </Link>
                    </div>
                    <div class="col">
                        <h4> Universities </h4>
                        <Link to="/university/deploy">
                        <button class="btn btn-outline-primary">Deploy Contract</button>
                        </Link>
                    </div>
                    </div>
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

        
        </Container>
    )
}

export default Home;
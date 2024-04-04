import React from 'react';
import { Link } from 'react-router-dom';


//bunch of links to different endpoints in our website
function Home() {
    return(
    <div style = {{display:'flex', justifyContent:'center', textAlign: 'center', alignItems:'center', height:'100vh', }}>
        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <Link to="/viewblocks">
                    <button>View Blocks</button>
                </Link>
                <Link to="/student/send">
                    <button>Send To Employer</button>
                </Link>
                <Link to="/university/deploy">
                    <button>Deploy a contract</button>
                </Link>
                <Link to="/employer/dashboard">
                    <button>Employer View</button>
                </Link>
        
        </div>
    </div>
    )
}

export default Home;
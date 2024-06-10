import React from "react";

const Container = ({children}) => {
    return(
        <div>
            <nav class="navbar navbar-expand-sm bg-light justify-content-center fixed-top">
                <div class="navbar-header">
                    <a class="navbar-brand" href="../">Homepage</a>
                </div>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="#">Page 1</a></li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Page 2</a></li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Page 3</a></li>
                </ul>
            </nav>

            <div style = {{display:'flex', justifyContent:'center', backgroundColor:'AntiqueWhite' }}>
                <div style={{display:'flex', justifyContent:'center', padding: '35px', alignItems:'center', flexDirection:'column', textAlign:'center', gap:'20px', minHeight:'100vh', minWidth:'50vh', backgroundColor:'White'}}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const ErrorMsg = ({error}) => {
    
    return(
        <div>
            {error ?
                <h2>error: {error}</h2> : <div></div>
            }
        </div>
    );
};

export {Container, ErrorMsg};
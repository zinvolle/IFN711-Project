import React from "react";

const Navigation = ({children}) => {
    return(
        <nav class="navbar bg-light align-items-center justify-content-center fixed-top" aria-label="breadcrumb">
        <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            {children}
        </ol>
        </nav>
    )
}

const Container = ({children}) => {
    return(
        <div>
            <div style = {{display:'flex', justifyContent:'center', backgroundColor:'AntiqueWhite' }}>
                <div style={{display:'flex', justifyContent:'center', padding: '20px', marginTop: '0px', alignItems:'center', flexDirection:'column', textAlign:'center', gap:'20px', minHeight:'100vh', minWidth:'50vh', backgroundColor:'White'}}>
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

export {Container, ErrorMsg, Navigation};
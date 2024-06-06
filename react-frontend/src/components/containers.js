const Container = ({children}) => {
    return(
        <div style = {{display:'flex', justifyContent:'center', textAlign: 'center', alignItems:'center', minHeight:'100vh', }}>
            <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                {children}
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
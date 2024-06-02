const Container = ({children}) => {
    return(
        <div style = {{display:'flex', justifyContent:'center', textAlign: 'center', alignItems:'center', height:'100vh', }}>
            <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                {children}
            </div>
        </div>
    );
};

export default Container;
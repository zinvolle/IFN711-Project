import React from 'react'
import { useState, useEffect } from 'react'
import { FindUser, FindUserByPublicKey } from '../MongoDB/MongoFunctions.js';
import { Container, ErrorMsg, Navigation } from './containers.js';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'


function EmployerLogin() {
    const [employerPrivateKey, setEmployerPrivateKey] = useState('')
    const [error, setError] = useState('')
    const [studentData, setStudentData] = useState('');
    const [EUI, setEUI] = useState(''); //EUI stands for Employer Unique Identifier
    const navigate = useNavigate();



    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const employerData = await FindUser(EUI);
            if (employerData.error || employerData.type != 'employer') {
                setError('No such employer exists')
                setStudentData('')
                return
            }
            setError(null)
            const data = { EUI, employerPrivateKey };
            navigate('/employer/view', { state: data })
        } catch (error) {
            setError(error)
        }
    };
    //the actual web page being rendered under here
    return (

        <div className='app-container'>
            <Navigation>
                <li class="breadcrumb-item"><a className = "link-light" href="/employer/page">Employer</a></li>
                <li class="breadcrumb-item" aria-current="page">Skills Data</li>
            </Navigation>
            <div className='create-user-container'>
                <h1 className='mt-4'>Student Skills Data</h1>
                <hr className="horizontal-line" />

                    <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column'}}>
                        <label >Employer Unique Identifier </label>
                            <input type="text" className='form-control' style={{marginTop:'10px'}} placeholder="Employer Unique Identifier" onChange={(e) => setEUI(e.target.value)} required autoFocus />
                            <label style={{marginTop:'20px'}}> Employer Private Key
                                <input type="text" className="form-control" style={{marginTop:'10px'}} placeholder="Employer Private Key" onChange={(e) => setEmployerPrivateKey(e.target.value)} required autoFocus />
                            </label>
                            <div className='mx-1 input-group-append'>
                                <button className="submitButton" style={{marginLeft:'260px', marginTop:'20px'}} type="submit">Submit</button>
                            </div>
                    </form>
                    {error? <p className='errorMessage'>{error}</p> : <p></p>}

            </div>
        
        </div>


    )
}

export default EmployerLogin


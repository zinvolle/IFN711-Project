import { useState } from "react"
import { GenerateRSAKeyPairs, GenerateSignatureKeyPairs } from "../CryptoTools/CryptoTools"
import { CreateUser } from "../MongoDB/MongoFunctions"
import { Container, ErrorMsg, Navigation } from './containers.js';
import '../styles/styles.css'



function UserCreation() {
    const [username, setUsername] = useState('')
    const [type, setType] = useState('')
    const [error, setError] = useState('')
    const [isActive, setIsActive] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const [signaturePrivateKey, setSignaturePrivateKey] = useState('')

    const togglePopup = () => {
        setIsActive(true);
    }

    const handlePopupClose = () => {
        setIsActive(false);
        window.location.reload(); // Reload the page after closing popup
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const RSAKeys = await GenerateRSAKeyPairs();
            const signatureKeys = await GenerateSignatureKeyPairs();
            if (type == 'selectone' || type == null) {
                setError('Please select a type')
                return
            }
            const publicKey = RSAKeys.publicKey
            const privateKey = RSAKeys.privateKey
            const signaturePublicKey = signatureKeys.signaturePublicKey
            const signaturePrivateKey = signatureKeys.signaturePrivateKey
            setPrivateKey(privateKey);
            setSignaturePrivateKey(signaturePrivateKey)

            const entry = {
                username: username,
                type: type,
                publicKey: publicKey,
                signaturePublicKey: signaturePublicKey
            }

            const result = await CreateUser(entry);
            if (result) {
                setError(result.message)
                return
            }
            togglePopup();
        } catch (error) {
            setError('Internal Server Error')
        }
    }

    

    return (
        <div className='app-container'>
            <Navigation>
                <li class="breadcrumb-item" aria-current="page">Register</li>
            </Navigation>
            <div className='create-user-container' >
                <h2 style={{ fontWeight: 'bold', fontSize: '48px', marginBottom: '20px' }}>Create User</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ fontSize: 22 }}>Username</label>
                        <input className='inputA' style={{ marginLeft: '40px', marginBottom: '10px' }} type='text' placeholder="Enter Username" required onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 22 }}>Type</label>
                        <select className='dropdown' style={{ marginLeft: '93px' }} onChange={(e) => setType(e.target.value)}>
                            <option value='selectone'>Please choose from below</option>
                            <option value='student'>Student</option>
                            <option value='university'>University</option>
                            <option value='employer'>Employer</option>
                        </select>
                    </div>
                    <button className='submitButton' style={{marginLeft:'200px', marginTop:'20px'}} type="submit">Create User</button>
                </form>
                {error ? <p className="errorMessage">{error}</p> : <p></p>}
            </div>

            
            <div className={`popup ${isActive ? 'active' : ''}`}>
                <div className="popup-content">
                    <h2>Private Key Distribution</h2>
                    <h6 className="errorMessage">Please save the following private keys into two separate notepads.</h6>
                    <h6 className="errorMessage">You are responsible for protecting these keys.</h6>
                    <h6 className="errorMessage">Only use these keys for our system's purposes.</h6>
                    <p>Normal Private Key:</p>
                    <p>{privateKey}</p>
                    <p>Signature Private Key:</p>
                    <p>{signaturePrivateKey}</p>
                    <button className='submitButton' onClick={handlePopupClose}>I have saved BOTH Private Keys</button>
                </div>
            </div>
        </div>
    )
}

export default UserCreation
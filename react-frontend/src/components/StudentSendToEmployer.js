import React from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { useState, useEffect } from 'react';
import { Encrypt, Decrypt, Sign, Verify, EncryptWithSymmetricKey, GenerateSymmetricKey } from '../CryptoTools/CryptoTools';
import {Container, ErrorMsg, Navigation} from './containers.js';
import { FindUser, FindUserByPublicKey } from '../MongoDB/MongoFunctions';
import '../styles/styles.css'

const { Web3 } = require("web3");


//Connecting to Ganache server and establishiing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;


async function addEntryToBlockchain(contractAddress, encryptedStudentData, studentSignature, employerPublicKey, encryptedSymmetricKey) {
    try {
        const accounts = await web3.eth.getAccounts();
        const mainAccount = accounts[0];
        const contract = new web3.eth.Contract(ABI, contractAddress)
        await contract.methods.addEntry(encryptedStudentData, studentSignature, employerPublicKey, encryptedSymmetricKey)
            .send({ from: mainAccount, gas: 4700000 }) //from a default account
            .on('transactionHash', function (hash) {
                console.log('Transaction hash:', hash);
            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log('Confirmation number:', confirmationNumber);
                console.log('Receipt:', receipt);
            })
            .on('error', console.error);
    } catch (error) {
        console.error('Error adding entry to blockchain:', error);
    }
}

function StudentSend() {
    const [studentPrivateSignatureKey, setStudentPrivateSignature] = useState('')
    const [studentSkillsData, setStudentSkillsData] = useState('')
    const [contractAddress, setContractAddress] = useState('')
    const [error, setError] = useState('')
    const [employerUI, setEmployerUI] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const employerData = await FindUser(employerUI);
            if (employerData.error || employerData.type != 'employer'){
                setError('No such employer exists')
                return
            }
            setError(null)
            const employerPublicKey = employerData.publicKey
            const symmetricKey = await GenerateSymmetricKey();
            const encryptedData = await EncryptWithSymmetricKey(symmetricKey, studentSkillsData);
            const encryptedSymmetricKey = await Encrypt(symmetricKey, employerPublicKey);
            const signature = await Sign(studentSkillsData, studentPrivateSignatureKey);
            await addEntryToBlockchain(contractAddress, encryptedData, signature, employerPublicKey, encryptedSymmetricKey);

            window.location.reload();
        } catch (error) {
            setError(error)
        }
    };

    return (
        <div className='app-container'>

                <form className="create-user-container" onSubmit={handleSubmit}>
                    <h1>Send To Employer</h1>
                    <hr className="horizontal-line" />

                    <label style={{fontSize:'20px'}}>Send To
                        <input type="text" style={{marginTop:'10px'}} className="form-control" placeholder="Employer Unique Identifer" onChange={(e) => setEmployerUI(e.target.value)} required autoFocus />
                    </label>
                    <label style={{marginTop:'15px', fontSize:'20px'}} >Your Contract Address
                        <input type="text" style={{marginTop:'10px'}} className="form-control" placeholder="Contract Address" onChange={(e) => setContractAddress(e.target.value)} required />
                    </label>
                    <label style={{marginTop:'15px', fontSize:'20px'}}  >Your Private Signature Key
                        <input type="text" style={{marginTop:'10px'}} className="form-control" placeholder="Private Signature Key" onChange={(e) => setStudentPrivateSignature(e.target.value)} required />
                    </label>
                    <label style={{marginTop:'15px', fontSize:'20px'}}  >Your skills data
                        <textarea type="text" style={{ width: '100%', minHeight: '100px', marginTop:'10px' }} className="form-control" onChange={(e) => setStudentSkillsData(e.target.value)} placeholder="Your Skills Data" required />
                    </label>
                  
                        <button className="submitButton" style={{marginTop:'30px'}}  type="submit">Send</button>
                 </form>


            {error? <p className='errorMessage' style={{marginTop:'10px'}}>{error}</p> : <p></p>}
            </div>
    )
}


export default StudentSend

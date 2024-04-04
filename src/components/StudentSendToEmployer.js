import React from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { useState, useEffect } from 'react';

const { Web3 } = require("web3");


//Connecting to Ganache server and establishiing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;

//For Darren and Daniel to input the encryption function
function EncryptData(data, publicKey) {
        
}

async function addEntryToBlockchain(contractAddress, encryptedStudentData, employerPublicKey){
    try {
        const accounts = await web3.eth.getAccounts();
        const mainAccount = accounts[0];
        const contract = new web3.eth.Contract(ABI, contractAddress)
        await contract.methods.addEntry(encryptedStudentData, employerPublicKey)
        .send({ from: mainAccount, gas: 4700000 }) //from a default account
        .on('transactionHash', function(hash){
            console.log('Transaction hash:', hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log('Confirmation number:', confirmationNumber);
            console.log('Receipt:', receipt);
        })
        .on('error', console.error);
    } catch (error) {
        console.error('Error adding entry to blockchain:', error);
    }
}

function StudentSend(){
    const [employerPublicKey, setEmployerPublicKey] = useState('')
    const [studentPrivateKey, setStudentPrivateKey] = useState('')
    const [studentSkillsData, setStudentSkillsData] = useState('')
    const [contractAddress, setContractAddress] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          await addEntryToBlockchain(contractAddress, studentSkillsData, employerPublicKey);  //studentSkillsData will need to be encrypted FIRST before being added to blockchain
        } catch (error) {
          setError(error)
        }
      };

    return (
        <div className="container d-flex justify-content-center">
            <div className="row justify-content-center text-center col-md-3" style={{ marginTop: '270px' }}> 
                <form onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Send To Employer</h1>
                <label className="h5">Send To
                    <input type="text" className="form-control" placeholder="Employer Public Key" onChange={(e) => setEmployerPublicKey(e.target.value)} required autoFocus />
                </label>
                <label className="h5">Your Contract Address
                    <input type="text" className="form-control" placeholder="Contract Address" onChange={(e) => setContractAddress(e.target.value)} required />
                </label>
                <label className="h5 mt-1">Your Private Key
                    <input type="password" className="form-control" placeholder="Private Key" onChange={(e) => setStudentPrivateKey(e.target.value)} required />
                </label>
                <label className="h5 mt-1">Your skills data
                    <textarea type="text" style={{ width: '100%', minHeight: '200px' }} className="form-control" onChange={(e)=>setStudentSkillsData(e.target.value)} placeholder="Your Skills Data" required />
                </label>
                <button className="btn btn-lg btn-primary btn-block m-3" type="submit">Send</button>
                </form>
            </div>

            <h1>Error: {error}</h1>
        </div>
    )
}


export default StudentSend

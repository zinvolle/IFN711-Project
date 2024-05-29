import React from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { useState, useEffect } from 'react';
import { Encrypt, Decrypt, Sign, Verify, EncryptWithSymmetricKey, GenerateSymmetricKey } from '../CryptoTools/CryptoTools';
import Container from './containers';

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
    const [employerPublicKey, setEmployerPublicKey] = useState('')
    const [studentPrivateSignatureKey, setStudentPrivateSignature] = useState('')
    const [studentSkillsData, setStudentSkillsData] = useState('')
    const [contractAddress, setContractAddress] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const symmetricKey = await GenerateSymmetricKey();
            const encryptedData = await EncryptWithSymmetricKey(symmetricKey, studentSkillsData);
            const encryptedSymmetricKey = await Encrypt(symmetricKey, employerPublicKey);
            const signature = await Sign(studentSkillsData, studentPrivateSignatureKey);
            await addEntryToBlockchain(contractAddress, encryptedData, signature, employerPublicKey, encryptedSymmetricKey);
        } catch (error) {
            setError(error)
        }
    };

    return (
        <Container>
            <div className="row align-self-center justify-content-center text-center col-md-4">
                <form onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal">Send To Employer</h1>
                    <label className="h5">Send To
                        <input type="text" className="form-control" placeholder="Employer Public Key" onChange={(e) => setEmployerPublicKey(e.target.value)} required autoFocus />
                    </label>
                    <label className="h5">Your Contract Address
                        <input type="text" className="form-control" placeholder="Contract Address" onChange={(e) => setContractAddress(e.target.value)} required />
                    </label>
                    <label className="h5 mt-1">Your Private Signature Key
                        <input type="text" className="form-control" placeholder="Private Key" onChange={(e) => setStudentPrivateSignature(e.target.value)} required />
                    </label>
                    <label className="h5 mt-1">Your skills data
                        <textarea type="text" style={{ width: '100%', minHeight: '200px' }} className="form-control" onChange={(e) => setStudentSkillsData(e.target.value)} placeholder="Your Skills Data" required />
                    </label>
                    <button className="btn btn-lg btn-primary btn-block m-3" type="submit">Send</button>
                </form>
            </div>

            <h1>Error: {error}</h1>
        </Container>
    )
}


export default StudentSend

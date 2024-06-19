import React from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { useState, useEffect } from 'react';
import { Encrypt, Decrypt, Sign, Verify, EncryptWithSymmetricKey, GenerateSymmetricKey } from '../CryptoTools/CryptoTools';

import {Container, ErrorMsg, Navigation, UserMsg} from './containers.js';

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
    const [success, setSuccess] = useState('')
    const [employerUI, setEmployerUI] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const employerData = await FindUser(employerUI);
            setSuccess('')
            setError('')
            if (employerData.error || employerData.type != 'employer'){
                setError('No such employer exists')
                return
            }

            const employerPublicKey = employerData.publicKey
            const symmetricKey = await GenerateSymmetricKey();
            const encryptedData = await EncryptWithSymmetricKey(symmetricKey, studentSkillsData);
            const encryptedSymmetricKey = await Encrypt(symmetricKey, employerPublicKey);
            const signature = await Sign(studentSkillsData, studentPrivateSignatureKey);
            await addEntryToBlockchain(contractAddress, encryptedData, signature, employerPublicKey, encryptedSymmetricKey);
            setSuccess('Successfully Sent Skills to Employer.')
        } catch (error) {
            setError(error)
        }
    };

    return (
        <Container>
            <Navigation>
                <li class="breadcrumb-item">Student</li>
                <li class="breadcrumb-item active" aria-current="page">Deploy</li>
            </Navigation>
            <div className="row align-self-center w-75">
                <form onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal">Send To Employer</h1>
                    <label className="h5 w-100">Send To
                        <input type="text" className="form-control" placeholder="Employer Unique Identifer" onChange={(e) => setEmployerUI(e.target.value)} required autoFocus />
                    </label>
                    <label className="h5 w-100">Your Contract Address
                        <input type="text" className="form-control" placeholder="Contract Address" onChange={(e) => setContractAddress(e.target.value)} required />
                    </label>
                    <label className="h5 w-100">Your Private Signature Key
                        <input type="text" className="form-control" placeholder="Private Key" onChange={(e) => setStudentPrivateSignature(e.target.value)} required />
                    </label>
                    <label className="h5 w-50">Your skills data
                        <textarea type="text" style={{ width: '100%', minHeight: '100px' }} className="form-control" onChange={(e) => setStudentSkillsData(e.target.value)} placeholder="Your Skills Data" required />
                    </label>
                    <div>
                        <button className="btn btn-lg btn-primary btn-block m-3" type="submit">Send</button>
                    </div>
                </form>
            </div>
            <UserMsg message={success} />
            <ErrorMsg error={error} />
        </Container>
    )
}


export default StudentSend

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

//A function to send all of the data in the arguments to the employer
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

//Retrieves all contract address in the blockchain
async function getContractAddresses() {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    const contractAddresses = [];

    for (let i = latestBlockNumber; i >= 0; i--) {
        const block = await web3.eth.getBlock(i, true);
        if (block && block.transactions) {
            for (const tx of block.transactions) {
                if (tx.to === null) {
                    const transactionReceipt = await web3.eth.getTransactionReceipt(tx.hash);
                    if (transactionReceipt && transactionReceipt.contractAddress) {
                        contractAddresses.push(transactionReceipt.contractAddress);
                    }
                }
            }
        }
    }
    return contractAddresses;
}

// Function to search for a public key in all contracts
async function searchContractAddress(targetPublicKey) {
    const contractAddresses = await getContractAddresses();
    console.log(`Found ${contractAddresses.length} contracts`);

    for (const address of contractAddresses) {
        try {
            const contract = new web3.eth.Contract(ABI, address);
            const publicKey = await contract.methods.getPublicKey().call();
            if (publicKey === targetPublicKey) {
                return address; // Return the contract address where the public key was found
            }
        } catch (error) {
            console.error(`Error calling getPublicKey on contract ${address}:`, error);
        }
    }
    console.log('Public key not found in any contract');
    return null; //If the public is not found, return null
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
            await addEntryToBlockchain(contractAddress, encryptedData, signature, employerPublicKey, encryptedSymmetricKey); //sends the data to the employer
            setSuccess('Successfully Sent Skills to Employer.')
        } catch (error) {
            setError(error)
        }
    };

    return (
        <div className="app-container">
            <div className='home-container'>
            <Navigation>
                <li class="breadcrumb-item"><a className = "link-light" href="/student/page">Student</a></li>
                <li class="breadcrumb-item" aria-current="page">Deploy</li>
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
                        <button className="btn btn-lg btn-dark btn-block m-3" type="submit">Send</button>
                    </div>
                </form>
            </div>
            <UserMsg message={success} />
            <ErrorMsg error={error} />
            </div>
        </div>
    )
}


export default StudentSend

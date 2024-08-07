import React from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { useState, useEffect } from 'react';
import { Encrypt, Decrypt, Sign, Verify, EncryptWithSymmetricKey, DecryptWithSymmetricKey, GenerateSymmetricKey } from '../CryptoTools/CryptoTools';
import { UploadToIPFS, DownloadFromIPFS } from './pinataService.js';
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

//Checks whether this student has already sent a contract to this employer.
async function checkHasAlreadySent(contractAddress ,employerPublicKey){ 
    const contract = new web3.eth.Contract(ABI, contractAddress);
    const entries = await contract.methods.getEntries().call()
    const parsedEntries = entries.map(obj => JSON.parse(obj))
    for (let entry of parsedEntries) {
        if (entry.employerPublicKey == employerPublicKey){
            return true
        }
    }
    return false
}  


async function findContractAddress(studentPublicKey) {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    for (let i = latestBlockNumber; i >= 0; i--) {
      const block = await web3.eth.getBlock(i, true);
      if (block && block.transactions) {
          for (const tx of block.transactions) {
              if (tx.to === null) {
                  const transactionReceipt = await web3.eth.getTransactionReceipt(tx.hash);
                  const contractAddress = transactionReceipt.contractAddress;
                  const contract = new web3.eth.Contract(ABI, contractAddress);
                  const contractStudentPublicKey = await contract.methods.getPublicKey().call()
                  if (contractStudentPublicKey == studentPublicKey){
                    return contractAddress
                  }
              }
          }
      }
  }
    return false
  }



function StudentSend() {
    const [studentPrivateKey, setStudentPrivateKey] = useState('')
    const [studentPrivateSignatureKey, setStudentPrivateSignature] = useState('')
    const [studentSkillsData, setStudentSkillsData] = useState('')
    const [studentID, setStudentID] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [employerUI, setEmployerUI] = useState('')

    
    async function ViewData(){
        try {
            console.log('attempting to view data')
            const studentData = await FindUser(studentID);
            const studentPublicKey = studentData.publicKey;
            const contractAddress = await findContractAddress(studentPublicKey)
            let contract = new web3.eth.Contract(ABI, contractAddress);
            const contractcid = await contract.methods.getCID().call();
            console.log({contractcid})
            let download = await DownloadFromIPFS(contractcid)
            let symmkey = await Decrypt(download.encryptionKey, studentPrivateKey)
            console.log({symmkey})
            let decrypt = await DecryptWithSymmetricKey(symmkey, download.skillsData)
            console.log({decrypt})
            setStudentSkillsData(decrypt);
            return decrypt
        } catch (error) {
            console.error(`Error Viewing Data:`, error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const studentSkills = await ViewData();
            const employerData = await FindUser(employerUI);
            setSuccess('')
            setError('')
            if (employerData.error || employerData.type != 'employer'){
                setError('No such employer exists')
                return
            }
            const studentData = await FindUser(studentID);
            const studentPublicKey = studentData.publicKey;
            const contractAddress = await findContractAddress(studentPublicKey)
            const employerPublicKey = employerData.publicKey
            const hasAlreadyBeenSent = await checkHasAlreadySent(contractAddress, employerPublicKey);
            if (hasAlreadyBeenSent) {
                setError('Contract has already been sent to this employer')
                return
            }
            
            const symmetricKey = await GenerateSymmetricKey();
            const encryptedData = await EncryptWithSymmetricKey(symmetricKey, studentSkills);
            const encryptedSymmetricKey = await Encrypt(symmetricKey, employerPublicKey);
            const signature = await Sign(studentSkills, studentPrivateSignatureKey);
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
                    <label className="h5 w-100">Your Student Unique Identifier
                        <input type="text" className="form-control" placeholder="Student Unique Identifier" onChange={(e) => setStudentID(e.target.value)} required />
                    </label>
                    <label className="h5 w-100">Your Private Key
                        <input type="text" className="form-control" placeholder="Private Key" onChange={(e) => setStudentPrivateKey(e.target.value)} required />
                    </label>
                    <label className="h5 w-100">Your Private Signature Key
                        <input type="text" className="form-control" placeholder="Signature Key" onChange={(e) => setStudentPrivateSignature(e.target.value)} required />
                    </label>
                    <label className="h5 w-50">Your skills data:</label>
                        <p>{studentSkillsData}</p>

                    <div>
                        <button className="btn btn-lg btn-dark btn-block m-3" type="button" onClick={ViewData}>View</button>
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

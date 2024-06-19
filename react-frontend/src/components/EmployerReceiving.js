import React from 'react'
import { useState, useEffect } from 'react'
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { Encrypt, Decrypt, Sign, Verify, DecryptWithSymmetricKey } from '../CryptoTools/CryptoTools';
import AuthenticateData from './hashing.js'

import {Container, ErrorMsg, Navigation, UserMsg} from './containers.js';

import { FindUser, FindUserByPublicKey } from '../MongoDB/MongoFunctions';


const { Web3 } = require("web3");


//Connecting to Ganache server and establishiing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;


//Main function that gets all student data for a specific employer key
async function getAllStudentDataForEmployer(employerPublicKey) {
    try {
        const contractAddresses = await getContractAddresses() //get every single contract address on the blockchain
        const allStudentData = []

        for (const address of contractAddresses) { //iterate through every address
            const contract = new web3.eth.Contract(ABI, address);
            const studentPublicKey = await contract.methods.getPublicKey().call()
            const studentSignaturePublicKey = await contract.methods.getStudentSignaturePublicKey().call()
            const universitySignaturePublicKey = await contract.methods.getUniversitySignaturePublicKey().call()
            const universitySignature = await contract.methods.getUniversitySignature().call();
            const student = await FindUserByPublicKey(studentPublicKey);
            const SUI = student.username;
            const data = await readEntries(address)
            const studentData = data.filter(entry => entry.employerPublicKey == employerPublicKey); //filters out all of the employer public keys and finds one that matches

            for (let entry of studentData) {    
                entry.studentPublicKey = studentPublicKey
                entry.studentSignaturePublicKey = studentSignaturePublicKey
                entry.contractAddress = address
                entry.universitySignaturePublicKey = universitySignaturePublicKey
                entry.universitySignature = universitySignature
                entry.SUI = SUI
            }

            if (studentData.length > 0) {
                allStudentData.push(...studentData) //pushes all data that matches the employer public key into a new array
            }
        }
        return allStudentData //returns the array of student data that matches the employer public key
    } catch (error) {
        console.log(error)
    }
}


//calls the 'readEntries' function on the smart contract - obtains all of the 'Send To' data for each smart contract.
async function readEntries(contractAddress) {
    try {
        const contract = new web3.eth.Contract(ABI, contractAddress);
        const entries = await contract.methods.getEntries().call();
        const parsedData = entries.map(obj => JSON.parse(obj))
        return parsedData

    } catch (error) {
        console.log(error);
    }
}

//Get every single contract address on the block chain
async function getContractAddresses() {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    const contractAddresses = [];

    for (let i = latestBlockNumber; i >= 0; i--) {
        const block = await web3.eth.getBlock(i, true);
        if (block && block.transactions) {
            block.transactions.forEach(async tx => {
                if (tx.to === null) {
                    const transactionReceipt = await web3.eth.getTransactionReceipt(tx.hash);
                    if (transactionReceipt && transactionReceipt.contractAddress) {
                        contractAddresses.push(transactionReceipt.contractAddress);
                    }
                }
            });
        }
    }
    return contractAddresses;
}

//simple student componenent that gets rendered on the screen
function Student({ studentData }) {
    return (
        <div class='border border-dark m-1 p-1'>
            <h4>Student UID: {studentData.SUI}</h4>
            <p><b>Encrypted Data:</b> {studentData.encryptedData}
                <br /><b>Decryped Data:</b> {studentData.decryptedData}</p>
            <p class="text-break"><b>Student Signature:</b> {studentData.signature}</p>
            <p><b>Data is Verified?:</b> {JSON.stringify(studentData.isVerified)}
                <br /><b>Hash Compare Result:</b> {JSON.stringify(studentData.hashCompareResult)}</p>
        </div>
    )
}


function EmployerPage() {
    const [employerPrivateKey, setEmployerPrivateKey] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [studentData, setStudentData] = useState('')
    const [EUI, setEUI] = useState(''); //EUI stands for Employer Unique Identifier

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setStudentData('')
            setError('')
            setMessage('')
            
            const employerData = await FindUser(EUI);
            if (employerData.error || employerData.type != 'employer'){
                setError('No such employer exists')
                return
            }
            setError(null)
            const employerPublicKey = employerData.publicKey
            const data = await getAllStudentDataForEmployer(employerPublicKey)
            if (data.length > 0){
                setStudentData(data);
            }
            else {
                setMessage('No Data found for this Employee UID.')
            }
        } catch (error) {
            setError(error)
        }
    };

    const startDecryption = async () => {
        try {  
            const decryptedDataPromises = studentData.map(async (data) => {
                const symmetricKey = await Decrypt(data.encryptedSymmetricKey, employerPrivateKey);
                const decrypted = await DecryptWithSymmetricKey(symmetricKey, data.encryptedData);
                return { ...data, decryptedData: decrypted };
            });
            const decryptedStudentData = await Promise.all(decryptedDataPromises);
            setStudentData(decryptedStudentData);
        } catch (err){
            setError(error)
        }
    };

    const startVerification = async () => {
        try {
            const isVerifiedPromises = studentData.map(async (data) => {
                const isVerifiedStudent = await Verify(data.decryptedData, data.signature, data.studentSignaturePublicKey)
                const isVerifiedUniversity = await Verify(data.decryptedData, data.universitySignature, data.universitySignaturePublicKey)
                const isVerified = isVerifiedStudent && isVerifiedUniversity
                return { ...data, isVerified: isVerified };
            });
            const isVerifiedData = await Promise.all(isVerifiedPromises);
            setStudentData(isVerifiedData);
        }catch(err){
            console.error(err)
        }
    }

    const startHashComparison = async () => {
        try {
            const compareHashPromises = studentData.map(async (data) => {
                const hashCompareResult = await AuthenticateData(data.studentPublicKey, data.contractAddress, data.decryptedData)
                return {...data, hashCompareResult: hashCompareResult}
            });
            const compareHashData = await Promise.all(compareHashPromises)
            setStudentData(compareHashData);
        } catch(err) {
            console.log(err)
        }
    }

    //the actual web page being rendered under here
    return (
        <Container>
            <Navigation>
                <li class="breadcrumb-item">Employer</li>
                <li class="breadcrumb-item active" aria-current="page">Recieving</li>
            </Navigation>
            <div className='mw-50 mx-auto'>
                <h1 className='mt-4'>Students Skills Data</h1>
                <div className='mb-1'>
                    <h2>Block Reception</h2>
                    <form onSubmit={handleSubmit}>
                        <label className='h5' for='EmployerUID'>Employer Unique Identifier </label>
                        <div className='input-group'>
                            <input type="text" className="form-control" id='EmployerUID' placeholder="Employer Unique Identifier" onChange={(e) => setEUI(e.target.value)} required autoFocus />
                            <div className='mx-1 input-group-append'>
                                <button className="btn btn-primary btn-block" type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className='mb-1'>
                    <h2>Block Decryption</h2>
                    
                    <label className='h5 w-100'> Employer Private Key
                        <input type="text" className="form-control" placeholder="Employer Private Key" onChange={(e) => setEmployerPrivateKey(e.target.value)} required autoFocus />
                    </label>
                    <button className="btn btn-primary btn-block" onClick={startDecryption}>Decrypt all</button>
                </div>

                <div className='mb-1'>
                    <h2>Signature Verification</h2>
                    <button className="btn btn-primary btn-block" onClick={startVerification}>Verify All </button>
                </div>

                <div className='mb-1'>
                    <h2>Compare Hashing</h2>
                    <button className="btn btn-primary btn-block" onClick={startHashComparison}>Compare All </button>
                </div>
            </div>
            <UserMsg message={message} />
            <ErrorMsg error={error} />
            {studentData && studentData.length > 0 ? (
                <div className='align-self-center w-75'>
                    <h3>For employer: {EUI}</h3>
                    {studentData.map((data, index) => (
                        <Student key={index} studentData={data} />
                    ))}
                </div>)
                :
                <div></div>
            }
            
      

        </Container>
           

    )
}

export default EmployerPage


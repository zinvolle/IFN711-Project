import React from 'react'
import { useState, useEffect } from 'react'
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { Encrypt, Decrypt, Sign, Verify } from '../CryptoTools/CryptoTools';
import AuthenticateData from './hashing.js'

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
            const studentSignaturePublicKey = await contract.methods.getSignaturePublicKey().call()

            const data = await readEntries(address)
            const studentData = data.filter(entry => entry.employerPublicKey == employerPublicKey); //filters out all of the employer public keys and finds one that matches

            for (let entry of studentData) {
                entry.studentPublicKey = studentPublicKey
                entry.studentSignaturePublicKey = studentSignaturePublicKey
                entry.contractAddress = address
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
        console.log(parsedData);
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
        <div>
            <h4>Student: {studentData.studentPublicKey}</h4>
            <p>encrypted data: {studentData.encryptedData}</p>
            <p>decryped data: {studentData.decryptedData}</p>
            <p>signature: {studentData.signature}</p>
            <p>is Verified: {JSON.stringify(studentData.isVerified)}</p>
            <p>Hash Compare Result: {JSON.stringify(studentData.hashCompareResult)}</p>
        </div>
    )
}


function EmployerPage() {
    const [employerPublicKey, setEmployerPublicKey] = useState('')
    const [employerPrivateKey, setEmployerPrivateKey] = useState('')
    const [error, setError] = useState('')
    const [studentData, setStudentData] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await getAllStudentDataForEmployer(employerPublicKey)
            setStudentData(data)
        } catch (error) {
            setError(error)
        }
    };

    const startDecryption = async () => {
        try {  
            const decryptedDataPromises = studentData.map(async (data) => {
                const decrypted = await Decrypt(data.encryptedData, employerPrivateKey);
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
                const isVerified = await Verify(data.decryptedData, data.signature, data.studentSignaturePublicKey)
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
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <h1 style={{ marginTop: '50px' }}>Students Skills Data</h1>
                <form onSubmit={handleSubmit}>
                    <label style={{ marginBottom: '30px', fontSize: '25px', }}>Employer Public Key
                        <input type="text" className="form-control" placeholder="Employer Public Key" onChange={(e) => setEmployerPublicKey(e.target.value)} required autoFocus />
                    </label>
                    <button className="btn btn-lg btn-primary btn-block m-3" type="submit">Submit</button>
                </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div>
                    <h2>Decryption</h2>
                    <label style={{ fontSize: '25px', }}>
                        <input type="text" className="form-control" placeholder="Employer Private Key" onChange={(e) => setEmployerPrivateKey(e.target.value)} required autoFocus />
                    </label>
                    <button className="btn btn-lg btn-primary btn-block m-3" onClick={startDecryption}>Decrypt all</button>
                </div>
                <h2>Signature Verification</h2>
                <button className="btn btn-lg btn-primary btn-block m-3" onClick={startVerification}>Verify All </button>
                <h2>Compare Hash</h2>
                <button className="btn btn-lg btn-primary btn-block m-3" onClick={startHashComparison}>Compare Hash All </button>
            </div>


            {studentData && studentData.length > 0 ? (
                <div>
                    <h3>For employer: {studentData[0].employerPublicKey}</h3>
                    {studentData.map((data, index) => (
                        <Student key={index} studentData={data} />
                    ))}
                </div>)
                :
                <h4>nothing to show</h4>
            }
            <div>
                {error ?
                    <h2>error: {error}</h2> : <div></div>
                }
            </div>
        </div>
    )
}

export default EmployerPage


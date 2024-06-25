import React from 'react'
import { useState, useEffect, useContext } from 'react'
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { Encrypt, Decrypt, Sign, Verify, DecryptWithSymmetricKey } from '../CryptoTools/CryptoTools.js';
import AuthenticateData from './hashing.js'
import { Container, ErrorMsg, Navigation } from './containers.js';
import { FindUser, FindUserByPublicKey } from '../MongoDB/MongoFunctions.js';
import { useLocation } from 'react-router-dom';
import UisCheckCircle from '@iconscout/react-unicons/icons/uil-check-circle.js';
import UisExclamationCircle from '@iconscout/react-unicons/icons/uil-exclamation-circle.js'
import '../styles/styles.css'

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

function Student({ studentData }) {
    const [showTooltip, setShowTooltip] = useState(false);

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    return (
        <div className='student-skills-container'>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <h4>Student ID: {studentData.SUI}</h4>
                <div
                    onMouseEnter={toggleTooltip}
                    onMouseLeave={toggleTooltip}
                    style={{ position: 'relative', display: 'inline-block' }}
                >
                    {studentData.isVerified ? (
                        <div>
                            <UisCheckCircle size='30' color='green' />
                            <i className='bi bi-check-circle text-success' />
                        </div>
                    ) : (
                        <div>
                            <UisExclamationCircle size='30' color='red' />
                            <i className='bi bi-exclamation-circle text-danger' />
                        </div>
                    )}
                    {showTooltip && (
                        <div className="tooltip-container">
                            <span>{studentData.isVerified && studentData.hashCompareResult ? 'Valid' : 'Invalid'}</span>
                        </div>
                    )}
                </div>
            </div>
            <p>Skills: {studentData.decryptedData}</p>
        </div>
    );
}


function EmployerView() {
    const location = useLocation();
    const employerData = location.state;
    const EUI = employerData.EUI
    const employerPrivateKey = employerData.employerPrivateKey
    const [allStudentData, setAllStudentData] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchDataAndProcess = async () => {
            try {
                const employerUser = await FindUser(EUI);
                const employerPublicKey = employerUser.publicKey;
                const studentData = await getAllStudentDataForEmployer(employerPublicKey);

                // Decrypt all student data
                const decryptedDataPromises = studentData.map(async (data) => {
                    const symmetricKey = await Decrypt(data.encryptedSymmetricKey, employerPrivateKey);
                    console.log({symmetricKey})
                    const decrypted = await DecryptWithSymmetricKey(symmetricKey, data.encryptedData);
                    console.log({decrypted})
                    return { ...data, decryptedData: decrypted };
                });

                const decryptedStudentData = await Promise.all(decryptedDataPromises);

                // Verify all student data
                const isVerifiedPromises = decryptedStudentData.map(async (data) => {
                    const isVerifiedStudent = await Verify(data.decryptedData, data.signature, data.studentSignaturePublicKey);
                    const isVerifiedUniversity = await Verify(data.decryptedData, data.universitySignature, data.universitySignaturePublicKey);
                    const isVerified = isVerifiedStudent && isVerifiedUniversity;
                    return { ...data, isVerified: isVerified };
                });

                const isVerifiedData = await Promise.all(isVerifiedPromises);

                // Compare hash for all student data
                const compareHashPromises = isVerifiedData.map(async (data) => {
                    const hashCompareResult = await AuthenticateData(data.studentPublicKey, data.contractAddress, data.decryptedData);
                    return { ...data, hashCompareResult: hashCompareResult };
                });

                const compareHashData = await Promise.all(compareHashPromises);

                // Set final processed data to state
                setAllStudentData(compareHashData);
            } catch (err) {
                console.error('Error fetching or processing data:', err);
                setError('Error fetching or processing data');
            }
        };

        fetchDataAndProcess();
    }, [EUI]);


    if (!employerData) {
        return <p>No data available. Please go back and submit the form.</p>;
    }

    return (
        <div className='dashboard-container'>
            <h1 style={{ marginTop: '30px', fontSize: '60px' }}>Employer Dashboard</h1>
            <div className='dashboard-text-container' style={{ marginTop: '40px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}>Employer Unique Identifier:</p>
                <p style={{ fontSize: '20px', marginLeft: '40px', marginTop: '10px' }}> {employerData.EUI}</p>
            </div>

            <div>
                {allStudentData.map((student, index) => (
                    <Student key={index} studentData={student} />
                ))}
            </div>
        </div>
    );
};

export default EmployerView;
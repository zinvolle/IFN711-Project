import React from 'react'
import { useState, useEffect } from 'react'
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { Container, ErrorMsg, Navigation } from './containers.js';
import { FindUser } from '../MongoDB/MongoFunctions.js';

const { Web3 } = require("web3");


//Connecting to Ganache server and establishiing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;

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
//Main function that gets all student data for a specific employer key
async function getAllStudentDataForStudent(_studentPublicKey) {
    try {
        const contractAddresses = await getContractAddresses() //get every single contract address on the block chain

        for (const address of contractAddresses) { //iterate through every address
            const contract = new web3.eth.Contract(ABI, address);
            const studentPublicKey = await contract.methods.getPublicKey().call()
            if (studentPublicKey == _studentPublicKey) {
                const studentSendTos = await contract.methods.getEntries().call()
                const parsedStudentSendTos = studentSendTos.map(obj => JSON.parse(obj))
                return parsedStudentSendTos
            }
        }
        return []
    } catch (error) {
        console.log(error)
    }
}



//simple student componenent that gets rendered on the screen
function Student(props) {
    return (
        <div>
            <h4>Student</h4>
            <p>encrypted data: {props.studentInfo.encryptedData}</p>
            <p>signature: {props.studentInfo.signature}</p>
        </div>
    )
}


function StudentRecieve() {
    const [studentID, setStudentID] = useState('')
    const [error, setError] = useState('')
    const [studentInfo, setStudentInfo] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const studentData = await FindUser(studentID);
            if (!studentData) {
                setError('student not found');
                return
            }
            const studentPublicKey = studentData.publicKey
            console.log(studentPublicKey)
            const data = await getAllStudentDataForStudent(studentPublicKey)
            setStudentInfo(data)
        } catch (error) {
            setError(error)
        }
    };

    //the actual web page being rendered under here
    return (
        <div className='app-container'>
            <Navigation>
                <li class="breadcrumb-item"><a className = "link-light" href="/student/page">Student</a></li>
                <li class="breadcrumb-item" aria-current="page">Skills Data</li>
            </Navigation>
            <div>
  
                   
                    <form className='create-user-container' onSubmit={handleSubmit}>
                    <h1 >Students Skills Data</h1>
                    <hr className="horizontal-line" />
                        <label style={{fontSize:'28px'}}>Student ID
                            
                            <input type="text" className="form-control" placeholder="Student Unique Identifer"  style= {{marginTop:'10px'}} onChange={(e) => setStudentID(e.target.value)} required autoFocus />
                        </label>
                        <button className="submitButton" style= {{marginTop:'40px', width:'150px', alignSelf:'center'}} type="submit">Submit</button>
                    </form>
        
            </div>
        </div>

    )
}

export default StudentRecieve


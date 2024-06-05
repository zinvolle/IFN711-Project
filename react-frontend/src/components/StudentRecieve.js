import React from 'react'
import { useState, useEffect } from 'react'
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import {Container} from './containers.js';

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
async function getAllStudentDataForStudent(studentPublicKey) {
    try{
        const contractAddresses = await getContractAddresses() //get every single contract address on the block chain
        const allStudentData = []

        for (const address of contractAddresses){ //iterate through every address
            const data = await readEntries(address)
            const studentData = data.filter(entry => entry.studentPublicKey == studentPublicKey); //filters out all of the employer public keys and finds one that matches
            if (studentData.length > 0){
                allStudentData.push(...studentData) //pushes all data that matches the employer public key into a new array
            }
        }
        return allStudentData //returns the array of student data that matches the employer public key
    } catch (error) {
        console.log(error)
    }
}



//simple student componenent that gets rendered on the screen
function Student(props){
    return (
        <div>
            <h4>Student</h4>
            <p>encrypted data: {props.studentData.encryptedData}</p>
            <p>signature: {props.studentData.signature}</p>
        </div>
    )
}


function StudentRecieve(){
    const [studentPublicKey, setStudentPublicKey] = useState('')
    const [error, setError] = useState('')
    const [studentData, setStudentData] = useState('')
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const data = await getAllStudentDataForStudent(studentPublicKey)
          setStudentData(data)
        } catch (error) {
          setError(error)
        }
      };

    //the actual web page being rendered under here
    return(
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'column'}}>
               <h1 style={{marginTop:'50px'}}>Students Skills Data</h1>
               <form onSubmit={handleSubmit}>
                <label style= {{marginBottom:'30px', fontSize:'25px',}}>Public Key
                    <input type="text" className="form-control" placeholder="Student Public Key" onChange={(e) => setStudentPublicKey(e.target.value)} required autoFocus />
                </label>
                <button className="btn btn-lg btn-primary btn-block m-3" type="submit">Submit</button>
                </form>
           </div>
           {studentData && studentData.length > 0? (          
                <div>
                <h3>For {studentData[0].employerPublicKey}</h3>
                {studentData.map((data, index) => (
                <Student key={index} studentData={data} />
            ))}
            </div>)
            : 
            <h4>nothing to show</h4>
            } 
           <div>
             {error? 
             <h2>error: {error}</h2> : <div></div>
             }
           </div>
        </Container>
    )
}

export default StudentRecieve


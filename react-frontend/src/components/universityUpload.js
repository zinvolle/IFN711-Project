import React, {useState} from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { HashDataSHA256 } from '../CryptoTools/CryptoTools';
import {Container} from './containers.js';

import { FindUser } from '../MongoDB/MongoFunctions';


const { Web3 } = require("web3");


//Connecting to Ganache server and establishiing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;
const bytecode = compiledContract.bytecode
const contract = new web3.eth.Contract(ABI);




//deployment of Contract function
async function deployContract(_studentPublicKey, _hashedStudentSkills, _studentSignaturePublicKey) {
  try {
      const accounts = await web3.eth.getAccounts();
      const mainAccount = accounts[0];
      console.log("Default Account:", mainAccount);
      const deployedContract = await contract.deploy({ data: bytecode, arguments: [_studentPublicKey,_hashedStudentSkills, _studentSignaturePublicKey] }).send({ from: mainAccount, gas: 4700000 });
      console.log("Contract deployed at address:", deployedContract.options.address);
      return deployedContract; 
  } catch (error) {
      console.error("Error deploying contract:", error);
      return(
        <div>
          Error: {error}
        </div>
      )
  }
}


function UniversityUpload() {
  const [studentPublicKey, setStudentPublicKey] = useState('')
  const [studentSkills, setStudentSkills] = useState('')
  const [error, setError] = useState('')
  const [studentSignaturePublicKey, setStudentSignaturePublicKey] = useState('')
  const [studentIdentifer, setStudentIdentifier] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await FindUser(studentIdentifer);
      if (data.error) {
        setError('No data found for the given student identifier.');
        return; 
      }
      const publicKey = data.publicKey;
      const signatureKey = data.signaturePublicKey;
      console.log(signatureKey);
      const hashedStudentSkills = await HashDataSHA256(studentSkills)
      await deployContract(publicKey, hashedStudentSkills, signatureKey);
      window.location.reload();
    } catch (error) {
      setError(error)
    }
  };
  
  return (
    <Container>
      <div className="align-self-center justify-content-center text-center col-4"> 
          <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 font-weight-normal">Deploy Student Skills onto the Blockchain</h1>
            <label className="h5">Input Student Unique Identifier
               <input type="text" id="studentpublickey" className="form-control" placeholder="Student Unique Identifier" onChange={(e) => setStudentIdentifier(e.target.value)} required autoFocus />
            </label>
            <label className="h5 mt-1">Input skills
              <textarea type="text" id="studentskills" style={{ width: '100%', minHeight: '200px' }} className="form-control" placeholder="Student Skills" onChange={(e) => setStudentSkills(e.target.value)} required />
            </label>
            <button className="btn btn-lg btn-primary btn-block m-3" type="submit">Deploy</button>
           
          </form>
          <h4>Error: {error}</h4>
      </div>
    </Container>
  );
}

export default UniversityUpload;
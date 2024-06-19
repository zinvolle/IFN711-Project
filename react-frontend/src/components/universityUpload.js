import React, { useState } from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { HashDataSHA256, Sign } from '../CryptoTools/CryptoTools';
import { Container, ErrorMsg, Navigation } from './containers.js';
import { FindUser } from '../MongoDB/MongoFunctions';


const { Web3 } = require("web3");


//Connecting to Ganache server and establishiing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;
const bytecode = compiledContract.bytecode
const contract = new web3.eth.Contract(ABI);




//deployment of Contract function
async function deployContract(_studentPublicKey, _hashedStudentSkills, _studentSignaturePublicKey, _universitySignatureKey, _universitySignature) {
  try {
    const accounts = await web3.eth.getAccounts();
    const mainAccount = accounts[0];
    console.log("Default Account:", mainAccount);
    const deployedContract = await contract.deploy({ data: bytecode, arguments: [_studentPublicKey, _hashedStudentSkills, _studentSignaturePublicKey, _universitySignatureKey, _universitySignature] }).send({ from: mainAccount, gas: 4700000 });
    console.log("Contract deployed at address:", deployedContract.options.address);
    return deployedContract;
  } catch (error) {
    console.error("Error deploying contract:", error);
    return (
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
  const [universityIdentifier, setUniversityIdentifier] = useState('');
  const [universityPrivateSigKey, setUniversityPrivateSigKey] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const studentData = await FindUser(studentIdentifer);
      if (studentData.error) {
        setError('Error deploying: The student identifer does not exist');
        return;
      }
      const uniData = await FindUser(universityIdentifier);
      if (uniData.error) {
        setError('Error deploying: The university identfier does not exist');
        return
      }
      const studentPublicKey = studentData.publicKey;
      const studentSignatureKey = studentData.signaturePublicKey;
      const universitySignatureKey = uniData.signaturePublicKey;
      const universitySignature = await Sign(studentSkills, universityPrivateSigKey);
      const hashedStudentSkills = await HashDataSHA256(studentSkills)
      await deployContract(studentPublicKey, hashedStudentSkills, studentSignatureKey, universitySignatureKey, universitySignature);
      window.location.reload();
    } catch (error) {
      setError(error)
    }
  };

  return (

    <div className='app-container'>
      <div className='create-user-container'>
        <form onSubmit={handleSubmit}>
          <h1 >Deploy Student Skills</h1>
          <div style={{ flexDirection: 'column', display: 'flex' }}>
            <h3 style={{marginTop:'30px'}}>University Information</h3>
            <hr className="horizontal-line" />
              <h5>University Unique Identifier</h5>
              <input style={{marginTop:'6px'}} type="text" placeholder="University Unique Identifier" onChange={(e) => setUniversityIdentifier(e.target.value)} required autoFocus />

              <h5  style={{marginTop:'20px'}} >University Signature Private Key</h5>
              <input  style={{marginTop:'6px'}} type="text"   placeholder="University Private Signature Key" onChange={(e) => setUniversityPrivateSigKey(e.target.value)} required autoFocus />
              <h3 style={{marginTop:'30px'}}>Student Information</h3>
              <hr className="horizontal-line" />
              <h5>Student Unique Identifier</h5>
              <input  style={{marginTop:'6px'}} type="text"  placeholder="Student Unique Identifier" onChange={(e) => setStudentIdentifier(e.target.value)} required autoFocus />   
          
              <h5  style={{marginTop:'20px'}} >Student skills</h5>
            <textarea type="text"  style={{ height: "200px", marginTop:'6px'}} placeholder="Student Skills" onChange={(e) => setStudentSkills(e.target.value)} required />
            {error? <p className='errorMessage' style={{marginTop:'10px'}}>{error}</p> : <p></p>}
          <button className="submitButton" style={{marginTop:'30px', width:'200px', marginLeft:'90px'}} type="submit">Deploy</button>
          </div>
        </form>
    

      </div>
    </div>
  );
}

export default UniversityUpload;
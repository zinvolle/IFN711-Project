import React, { useState } from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { HashDataSHA256, Sign, Encrypt, GenerateSymmetricKey, EncryptWithSymmetricKey } from '../CryptoTools/CryptoTools';
import {Container, ErrorMsg, Navigation, UserMsg} from './containers.js';
import { FindUser } from '../MongoDB/MongoFunctions';
import { UploadToIPFS, DownloadFromIPFS } from './pinataService.js';

const { Web3 } = require("web3");


//Connecting to Ganache server and establishiing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;
const bytecode = compiledContract.bytecode
const contract = new web3.eth.Contract(ABI);

async function checkStudentHasContract(studentPublicKey) {
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
                  return true
                }
            }
        }
    }
}
  return false
}


//deployment of Contract function
async function deployContract(_studentPublicKey, _hashedStudentSkills, _studentSignaturePublicKey, _universitySignatureKey, _universitySignature, _CID) {
  try {
    const accounts = await web3.eth.getAccounts();
    const mainAccount = accounts[0];
    console.log("Default Account:", mainAccount);
    const deployedContract = await contract.deploy({ data: bytecode, arguments: [_studentPublicKey, _hashedStudentSkills, _studentSignaturePublicKey, _universitySignatureKey, _universitySignature, _CID] }).send({ from: mainAccount, gas: 4700000 });
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
  const [studentSkills, setStudentSkills] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [studentIdentifer, setStudentIdentifier] = useState('');
  const [universityIdentifier, setUniversityIdentifier] = useState('');
  const [universityPrivateSigKey, setUniversityPrivateSigKey] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const studentData = await FindUser(studentIdentifer);
      if (studentData.error) {
        setError('No data found for the Student Identifier.');
        return; 
      }
      const uniData = await FindUser(universityIdentifier);
      if (uniData.error) {
        setError('No data found for the University Identifier');
        return
      }

      
      const studentPublicKey = studentData.publicKey;
      const studentHasContract = await checkStudentHasContract(studentPublicKey)
      if (studentHasContract) {
          setError('Error deploying. This student already has a contract')
          return
      }
      const studentSignatureKey = studentData.signaturePublicKey;
      const universitySignatureKey = uniData.signaturePublicKey;
  
      const universitySignature = await Sign(studentSkills, universityPrivateSigKey);
      const hashedStudentSkills = await HashDataSHA256(studentSkills)


      
     
     //Encryption of Data
      const symmetricKey = await GenerateSymmetricKey();
      const encryptedSkills = await EncryptWithSymmetricKey(symmetricKey, studentSkills);
      const encryptedSymmetricKey = await Encrypt(symmetricKey, studentPublicKey);
     

      const studentJSON = {
        skillsData: encryptedSkills,
        encryptionKey: encryptedSymmetricKey
      };

      // Send Skills to IPFS Pinata
      console.log('Attempting to pin: ' + JSON.stringify(studentJSON));
      const CID = await UploadToIPFS(studentJSON, studentPublicKey);

      await deployContract(studentPublicKey, hashedStudentSkills, studentSignatureKey, universitySignatureKey, universitySignature, CID);
      //window.location.reload();

      setError('');
      setSuccess('Successfully Deployed Skills to Blockchain.');
    } catch (error) {
      setSuccess('');
      setError(error.message);
    }
  };

  return (
    <div className='app-container'>
      <Navigation>
          <li class="breadcrumb-item"><a className = "link-light" href="/university/page">University</a></li>
          <li class="breadcrumb-item" aria-current="page">Deploy</li>
      </Navigation>
      <div className="view-container"> 
          <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 font-weight-normal">Deploy Student Skills onto the Blockchain</h1>
            <div style = {{flexDirection:'column', display:'flex'}}>
              <label className="h5">Input University Unique Identifier
                <input type="text" id="unipublickey" className="form-control" placeholder="University Unique Identifier" onChange={(e) => setUniversityIdentifier(e.target.value)} required autoFocus />
              </label>
              <label className="h5">Input University Signature Private Key
                <input type="text" id="unipublickey" className="form-control" placeholder="University Private Signature Key" onChange={(e) => setUniversityPrivateSigKey(e.target.value)} required autoFocus />
              </label>
              <label className="h5">Input Student Unique Identifier
                <input type="text" id="studentuid" className="form-control" placeholder="Student Unique Identifier" onChange={(e) => setStudentIdentifier(e.target.value)} required autoFocus />
              </label>
            </div>
            <label className="h5 w-100">Input skills
              <textarea type="text" id="studentskills" className="form-control" style={{height:"200px"}}  placeholder="Student Skills" onChange={(e) => setStudentSkills(e.target.value)} required />
            </label>
            <button className="btn btn-lg btn-primary btn-block m-3" type="submit">Deploy</button>
           
          </form>
          <UserMsg message={success} />
          <ErrorMsg error={error} />
      </div>
    </div>
  );
}

export default UniversityUpload;
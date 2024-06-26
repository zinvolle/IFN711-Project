import { useState } from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { HashDataSHA256, Sign, Encrypt, GenerateSymmetricKey, EncryptWithSymmetricKey } from '../CryptoTools/CryptoTools.js';
import {Container, ErrorMsg, Navigation, UserMsg} from './containers.js';
import { FindUser } from '../MongoDB/MongoFunctions.js';
import { UploadToIPFS, DownloadFromIPFS } from './pinataService.js';
import '../styles/styles.css'
const { Web3 } = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;

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

  async function getOldCID(contractAddress){
    const contract = new web3.eth.Contract(ABI, contractAddress)
    const oldCID = await contract.methods.getCID().call()
    return oldCID;
  }


async function updateContractCID(contractAddress, newCID, newUniSignaturePublicKey, newUniSignature, newHashedData){
    try {
        const contract = new web3.eth.Contract(ABI, contractAddress)
        // Call the updateCID function
        const accounts = await web3.eth.getAccounts();
        const mainAccount = accounts[0];
        const receipt = await contract.methods.updateContract(newCID, newUniSignaturePublicKey, newUniSignature, newHashedData).send({from: mainAccount, gas: 4700000 });
        console.log('Transaction successful:', receipt);
        return
    } catch (error) {
        console.error('Error updating CID:', error);
        return error.message
    }
}

function UniversityUpdate() {
    const [universityIdentifier, setUniversityIdentifier] = useState('')
    const [universityPrivateSigKey, setUniversityPrivateSigKey] = useState('')
    const [studentSkills, setStudentSkills] = useState('')
    const [studentID, setStudentID] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const uniData = await FindUser(universityIdentifier);
        if (uniData.error) {
          setError('No data found for the University Identifier.')
          return
        }
        const studentData = await FindUser(studentID);
        if (studentData.error) {
          setError('No data found for the Student Identifier.')
          return
        }
        const studentPublicKey = studentData.publicKey
        const uniSignaturePublicKey = uniData.signaturePublicKey
        const uniSignature = await Sign(studentSkills, universityPrivateSigKey);
        const hashedData = await HashDataSHA256(studentSkills)
        const contractAddress = await findContractAddress(studentPublicKey);
        const oldCID = await getOldCID(contractAddress);

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
        const newCID = await UploadToIPFS(studentJSON, studentPublicKey , oldCID);

        await updateContractCID(contractAddress, newCID, uniSignaturePublicKey, uniSignature, hashedData);
        setSuccess('Successfully updated student data')
        
      } catch (err){
        setSuccess('')
        setError(err.message)
      }
    }

    return (
        <div className='app-container'>
          <Navigation>
            <li class="breadcrumb-item"><a className = "link-light" href="/university/page">University</a></li>
            <li class="breadcrumb-item" aria-current="page">Update</li>
          </Navigation>
          <div className="view-container"> 
              <form onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Update Student Skills in the Blockchain</h1>
                <div style = {{flexDirection:'column', display:'flex'}}>
                  <label className="h5">University Unique Identifier
                    <input type="text" id="unipublickey" className="form-control" placeholder="University Unique Identifier" onChange={(e) => setUniversityIdentifier(e.target.value)} required autoFocus />
                  </label>
                  <label className="h5">University Signature Private Key
                    <input type="text" id="unipublickey" className="form-control" placeholder="University Private Signature Key" onChange={(e) => setUniversityPrivateSigKey(e.target.value)} required autoFocus />
                  </label>
                  <label className="h5">Student Unique Identifier
                    <input type="text" id="unipublickey" className="form-control" placeholder="Student Unique Identifier" onChange={(e) => setStudentID(e.target.value)} required autoFocus />
                  </label>
                </div>
                <label className="h5 w-100">New skills
                  <textarea type="text" id="studentskills" className="form-control" style={{height:"200px"}}  placeholder="New Student Skills" onChange={(e) => setStudentSkills(e.target.value)} required />
                </label>
                <button className="btn btn-lg btn-primary btn-block m-3" type="submit">Update</button>
               
              </form>
              <UserMsg message={success} />
              <ErrorMsg error={error} />
          </div>
        </div>
      );
}

export default UniversityUpdate
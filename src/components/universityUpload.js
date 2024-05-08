import React, {useState} from 'react';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { HashDataSHA256 } from '../CryptoTools/CryptoTools';

const { Web3 } = require("web3");


//Connecting to Ganache server and establishiing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;
const bytecode = compiledContract.bytecode
const contract = new web3.eth.Contract(ABI);




//deployment of Contract function
async function deployContract(_studentPublicKey, _hashedStudentSkills) {
  try {
      const accounts = await web3.eth.getAccounts();
      const mainAccount = accounts[0];
      console.log("Default Account:", mainAccount);
      const deployedContract = await contract.deploy({ data: bytecode, arguments: [_studentPublicKey,_hashedStudentSkills] }).send({ from: mainAccount, gas: 4700000 });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      const hashedStudentSkills = await HashDataSHA256(studentSkills)
      await deployContract(studentPublicKey, hashedStudentSkills);
      window.location.reload();
    } catch (error) {
      setError(error)
    }
  };
  
  return (
    <div className="container d-flex justify-content-center">
      <div className="row justify-content-center text-center col-md-4" style={{ marginTop: '200px' }}> 
          <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 font-weight-normal">Deploy Student Skills onto the Blockchain</h1>
            <label className="h5">Input Public Key </label>
            <input type="text" id="studentpublickey" className="form-control" placeholder="Student Public Key" onChange={(e) => setStudentPublicKey(e.target.value)} required autoFocus />

            <label className="h5 mt-1">Input skills </label>
            
              <textarea type="text" id="studentskills" style={{ width: '100%', minHeight: '200px' }} className="form-control" placeholder="Student Skills" onChange={(e) => setStudentSkills(e.target.value)} required />
            <button className="btn btn-lg btn-primary btn-block m-3" type="submit">Deploy</button>
           
          </form>
          <h4>Error: {error}</h4>
      </div>
    </div>
  );
}

export default UniversityUpload;
import { useLocation } from 'react-router-dom';
import '../styles/styles.css';
import { useState, useEffect } from 'react'
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { FindUser, FindUserByPublicKey } from '../MongoDB/MongoFunctions.js';
const { Web3 } = require("web3");



//Connecting to Ganache server and establishiing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;


//Find a single contract address on the block chain
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
    return null
  }

//Main function that gets all student data for a specific employer key
async function getAllSendTosForStudent(contractAddress) {
    try {
            const contract = new web3.eth.Contract(ABI, contractAddress);
            const studentSendTos = await contract.methods.getEntries().call()
            const parsedStudentSendTos = studentSendTos.map(obj => JSON.parse(obj))
            return parsedStudentSendTos
        }
        
     catch (error) {
        console.log(error)
    }
}

function ContractSentTo({employer, onRevoke}) {
    return (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px'}}>
            <p style={{fontSize:'20px', marginTop:'10px'}}>{employer}</p>
            <button className='revokeButton' onClick={onRevoke} >Revoke</button>
        </div>
    )
}

const Popup = ({ isVisible, keyData, onClose }) => {
    return (
        <div className={`popup ${isVisible ? 'active' : ''}`} onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h2>{keyData.keyType}</h2>
                <p>{keyData.key}</p>
                <button className='submitButton' onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

function StudentView() {
    const location = useLocation();
    const studentPublicKey = location.state.studentPublicKey;
    const studentSignatureKey = location.state.studentSignaturePublicKey;
    const studentID = location.state.studentID;
    const [contractAddress, setContractAddress] = useState('')
    const [employerIDs, setEmployerIDs] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [keyData, setKeyData] = useState('');

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const contractAddress = await findContractAddress(studentPublicKey);
                const studentSendTos = await getAllSendTosForStudent(contractAddress);
                setContractAddress(contractAddress);
                const employers = [];

                if (studentSendTos && studentSendTos.length > 0) {
                    // Loop through all studentSendTos
                    for (const sendTo of studentSendTos) {
                        const employerPublicKey = sendTo.employerPublicKey;
                        const employer = await FindUserByPublicKey(employerPublicKey);
                        employers.push(employer.username);
                    }
                    const employerSet = [...new Set(employers)];
                    setEmployerIDs(employerSet);
                } else {
                    console.warn('No student data found');
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };
        fetchStudentData();
    }, [studentPublicKey]);

    const handleButtonClick = (key, keyType) => {
        setKeyData({key, keyType});
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    const handleRevoke = async (employerID) => {
        try {
            console.log(`Revoking for employer: ${employerID}`);
            const contract = new web3.eth.Contract(ABI, contractAddress);
            const accounts = await web3.eth.getAccounts();
            const mainAccount = accounts[0];
            const employerData = await FindUser(employerID);
            const employerPublicKey = employerData.publicKey;
            await contract.methods.deleteEntry(employerPublicKey).send({from: mainAccount, gas: 4700000 });
            window.location.reload();            
        } catch (error) {
            console.error('Error revoking contract:', error);
        }
    };

    return (
        <div className='dashboard-container'>
            <div className='student-dashboard-text-container' style={{ marginTop: '40px' }}>
                <p style={{ fontSize: '32px' }}>Student: {studentID}</p>
                <button className='submitButton' onClick={() => handleButtonClick(studentPublicKey, 'Public Key')}>View Public Key</button>
                <button className='submitButton' style={{ marginTop: '10px' }} onClick={() => handleButtonClick(studentSignatureKey, 'Signature Public Key')}>View Signature Public Key</button>
            </div>
            <div className='student-dashboard-text-container' style={{ marginTop: '40px' }}>
                <h1>Your skills were sent to:</h1>
                {employerIDs.length > 0 ? (
                    employerIDs.map((employer, index) => <ContractSentTo key={index} employer={employer} onRevoke={() => handleRevoke(employer)} />)
                ) : (
                    <p>No employer data found</p>
                )}
            </div>
            <Popup isVisible={isPopupVisible} keyData={keyData} onClose={handleClosePopup} />
        </div>
    );
}
export default StudentView;
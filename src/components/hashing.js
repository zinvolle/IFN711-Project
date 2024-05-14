/* import { HashDataSHA256, CompareToHash } from '../CryptoTools/CryptoTools.js';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { useState, useEffect } from "react";

const { Web3 } = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;

//  AuthenticateData: This function authenticates provided data using the hash stored on a student's contract
//    inputs: 
//       _contractAddress: address of student's contract
//        _data: data to be authenticated
//    outputs:
//        authenticity: Bool of whether or not the _hashedData is authentic

function AuthenticateData(_contractAddress, _data, existingHash, setAuthentic) {
    // set up useStates
    const [error, setError] = useState('');
    const [hashedData, setHashedData] = useState('');
    const [hashedInputData, setHashedInputData] = useState('');

    const Authenticate = async () => {
        // create contract object to access contract
        const contract = new web3.eth.Contract(ABI, _contractAddress);

        // get public key
        contract.methods.getPublicKey().call()
            .then(publicKey => {
                setPublicKey(publicKey)
            })
            .catch(error => {
                setError(error)
                console.log(error)
            });

        // get hashed data
        contract.methods.getHashedData().call()
            .then(hash => {
                setHashedData(hash)
            })
            .catch(error => {
                setError(error)
                console.log(error)
            });

        // hash given data
        setHashedInputData(await HashDataSHA256(_data));
    }

    Authenticate();

    // compare input and public hashes
    const authenticity = CompareToHash(hashedInputData, hashedData);

    // return result of comparison
    return authenticity;
}

// export to wider app
export default AuthenticateData; */
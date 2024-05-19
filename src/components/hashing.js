import { CompareToHash, HashDataSHA256 } from '../CryptoTools/CryptoTools.js';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";

const { Web3 } = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;

//  AuthenticateData: This function authenticates provided data using the hash stored on a student's contract
//    inputs: 
//       _contractAddress: address of student's contract
//      _data: data to be authenticated
//    outputs:
//      authenticity: Boolean value representing if the data sent is authentic or not

async function AuthenticateData(_publicKey, _contractAddress, _data) {
    // retrieve data
    let [localPublicKey, localHashedData] = await RetrieveData(_contractAddress);
    
    // check authenticity
    let authenticity = await CheckAuthenticity(localPublicKey, localHashedData, _publicKey, _data);

    // return authenticity
    return (authenticity);
}

// Retrieves public key and hashed data from 
async function RetrieveData(_contractAddress) {
    // create contract object to access contract
    const contract = new web3.eth.Contract(ABI, _contractAddress);

    // get public key
    const localPublicKey = await contract.methods.getPublicKey().call();

    // get existing hashed data
    const localHashedData = await contract.methods.getHashedData().call();

    return ([localPublicKey, localHashedData]);
}

async function CheckAuthenticity(localPublicKey, localHashedData, _publicKey, _data) {

    /*     console.log("\nlocalPublicKey: " + localPublicKey +
            "\nlocalHashedData: " + localHashedData +
            "\npublicKey: " + _publicKey +
            "\ndata: " + _data); */

    // Test authenticity
    // check ID
    if (_publicKey === localPublicKey) {
        // check hash
        if (await CompareToHash(_data, localHashedData)) {

            /*             // console debugging
                        console.log("Authenticity setting true..." +
                            "\n\nInput public key: " + _publicKey +
                            "\nExisting public Key: " + localPublicKey +
                            "\n\nInput data: " + await HashDataSHA256(_data) +
                            "\nExisting data: " + localHashedData); */

            // set authentic bool value
            return (true);


        }
        else {

            /*             // console debugging
                        console.log("Hashes don't match, setting false..." +
                            "\n\nInput data: " + await HashDataSHA256(_data) +
                            "\nExisting data: " + localHashedData); */

            // if hashes don't match
            return (false);
        }
    }
    else {
        /*         // console debugging
                console.log("Public Keys don't match, setting false..." +
                    "\n\nInput public key: " + _publicKey +
                    "\nExisting public Key: " + localPublicKey); */

        // if public keys don't match
        return (false);


    }
}

// export to wider app
export default AuthenticateData;
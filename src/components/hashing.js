import { CompareToHash, HashDataSHA256 } from '../CryptoTools/CryptoTools.js';
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { useState } from "react";

const { Web3 } = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;

//  AuthenticateData: This function authenticates provided data using the hash stored on a student's contract
//    inputs: 
//       _contractAddress: address of student's contract
//      _data: data to be authenticated
//      setAuthentic: useState function to set authentic to True or False

async function AuthenticateData(_publicKey, _contractAddress, _data, setAuthentic) {
    async function RetrieveData() {
        // create contract object to access contract
        const contract = new web3.eth.Contract(ABI, _contractAddress);

        // get public key
        const localPublicKey = await contract.methods.getPublicKey().call();

        // get existing hashed data
        const localHashedData = await contract.methods.getHashedData().call();

        return ([localPublicKey, localHashedData]);
    }

    async function CheckAuthenticity([localPublicKey, localHashedData]) {
        // Test authenticity
        // check ID
        if (_publicKey === localPublicKey) {
            // check hash
            if (await CompareToHash(_data, localHashedData)) {
                // set authentic bool value
                setAuthentic(true);

/*                 // console debugging
                console.log("Authenticity setting true..." +
                    "\n\nInput public key: " + _publicKey +
                    "\nExisting public Key: " + localPublicKey +
                    "\n\nInput data: " + await HashDataSHA256(_data) +
                    "\nExisting data: " + localHashedData); */
            }
            else {
                // if hashes don't match
                setAuthentic(false);

/*                 // console debugging
                console.log("Hashes don't match, setting false..." +
                    "\n\nInput data: " + await HashDataSHA256(_data) +
                    "\nExisting data: " + localHashedData); */
            }
        }
        else {
            // if public keys don't match
            setAuthentic(false);
/* 
            // console debugging
            console.log("Public Keys don't match, setting false..." +
                "\n\nInput public key: " + _publicKey +
                "\nExisting public Key: " + localPublicKey); */
        }
    }

    RetrieveData().then((value) => { CheckAuthenticity(value) });
}

// export to wider app
export default AuthenticateData;
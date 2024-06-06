import React from "react";
import compiledContract from "../BlockchainServer/build/contracts/StudentSkills.json";
import { useState, useEffect } from "react";
import AuthenticateData from "./hashing.js";
import { HashDataSHA256 } from "../CryptoTools/CryptoTools.js";
import {Container} from './containers.js';

const { Web3 } = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const ABI = compiledContract.abi;


function ContractInformation() {
    const [contractAddress, setContractAddress] = useState('')
    const [error, setError] = useState('')
    const [publicKey, setPublicKey] = useState('')
    const [hashedStudentSkills, setHashedStudentSkills] = useState('')
    const [entries, setEntries] = useState('')
    const [signaturePublicKey, setSignaturePublicKey] = useState('')
    const [inputData, setInputData] = useState('')
    const [authentic, setAuthentic] = useState(false)


    const handleClick = async () => {
        const contract = new web3.eth.Contract(ABI, contractAddress);
        contract.methods.getPublicKey().call()
            .then(publicKey => {
                setPublicKey(publicKey)
            })
            .catch(error => {
                setError(error)
                console.log(error)
            });

        contract.methods.getHashedData().call()
            .then(hash => {
                setHashedStudentSkills(hash)
            })
            .catch(error => {
                setError(error)
                console.log(error)
            });

        contract.methods.getEntries().call()
            .then(entries => {
                setEntries(entries)
                //console.log(entries)
            })
            .catch(error => {
                setError(error)
                console.log(error)
            });
        
            contract.methods.getSignaturePublicKey().call()
            .then(key => {
                setSignaturePublicKey(key)
                //console.log(entries)
            })
            .catch(error => {
                setError(error)
                console.log(error)
            });

        // testing of hashing function, to be deleted later...
        // ( Currently works but only from second click due to not awaiting resolve on retrieval of publicKey above.
        //   This is irrelevant as AuthenticateData is only on this page for debugging the function itself. )
        setInputData("Maths Science");
        setAuthentic(await AuthenticateData(publicKey, contractAddress, inputData));
    }





    return (
        <Container>
            <div className="row align-self-center w-75">
                <h1>Contract Information</h1>
                <div className="input-group mb-5">
                    <input className="form-control" placeholder="contract address" onChange={(e) => setContractAddress(e.target.value)}></input>
                    <div className="input-group-append"><button className="btn btn-primary btn-block" onClick={handleClick}>Retrieve Information</button></div>
                </div>
                <div className="text-break">
                    <h3>Public Key</h3>
                        <p>{publicKey}</p>
                    <h3>Signature Public Key</h3>
                        <p>{signaturePublicKey}</p>
                    <h3>Hashed Skills</h3>
                        <p>{hashedStudentSkills}</p>
                    <h3>Entries</h3>
                        <p>{entries}</p>
                    {/*testing hashing below*/}
                    <h3>Authenticity Check</h3>
                        <p>Hashed Data: {authentic.toString()}</p>
                </div>
            </div>
        </Container>
    )
}


export default ContractInformation
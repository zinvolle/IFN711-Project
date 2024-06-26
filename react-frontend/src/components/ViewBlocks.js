import { useEffect, useState } from "react";
import React from 'react';
import {Container, ErrorMsg, Navigation} from './containers.js';
const { Web3 } = require("web3");

//Connecting to Ganache and establishing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545')); //connects to Ganache Server


//Individual Block component rendered on the web page
function Block( {block} ){
    return (
        <div className='block row border border-dark m-1' >
            <div class='col pt-3 bg-white text-dark'>
                <h5>Block Number: {block.blockNumber}</h5>
                <p>Block hash: {block.blockHash}</p>
                <p>Created Contract Address: {block.contractAddress}</p>            
            </div>
        </div>
    );
}

function ViewBlocks(){
    const [blocks, setBlocks] = useState([]);
    const [errorMessage, setErrorMessage] = useState('')

    //Retrieves the Contract Address and Block Numbers and display them on the page
    useEffect(() => {
        const getContractAddressesAndBlockNumbers = async () => {
            try {
                const latestBlockNumber = await web3.eth.getBlockNumber();
                console.log('Latest Block Number:', latestBlockNumber);

                const blockData = [];

                for (let i = latestBlockNumber; i >= 0; i--) {
                    const block = await web3.eth.getBlock(i, true);
                    if (block && block.transactions) {
                        block.transactions.forEach(async tx => {
                            if (tx.to === null) {
                                const transactionReceipt = await web3.eth.getTransactionReceipt(tx.hash);
                                if (transactionReceipt && transactionReceipt.contractAddress) {
                                    const data = {
                                        blockNumber: block.number.toString(),
                                        blockHash: block.hash,
                                        contractAddress: transactionReceipt.contractAddress,
                                    };
                                    blockData.push(data);
                              
                                }
                            }
                        });
                    }
                }
                setBlocks(blockData); 
                console.log(JSON.stringify(blockData))
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage(error.message);
            }
        };
        getContractAddressesAndBlockNumbers();
            
    }, []);

    return (

        <div className="app-container">
            <Navigation>
                <li class="breadcrumb-item" aria-current="page">View Contracts</li>
            </Navigation>
            <div className="view-container">
            
            {
                errorMessage ? (
                    <ErrorMsg error={errorMessage} />
                ) : (
                    blocks.map((block, index) => (
                        <Block key={index} block={block} />
                    ))
                )
            }
            </div>
        </div>
    )
}

export default ViewBlocks;
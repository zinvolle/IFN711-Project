import { useEffect, useState } from "react";
import React from 'react';
import Container from "./containers";
const { Web3 } = require("web3");

//Connecting to Ganache and establishing Contract
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545')); //connects to Ganache Server


//Individual Block component rendered on the web page
function Block( {block} ){
    return (
        <div className='block'>
            <h5>Block Number: {block.blockNumber}</h5>
            <p>Block hash: {block.blockHash}</p>
            <p>Created Contract Address: {block.contractAddress}</p>            
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
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage(error.message);
            }
        };
        getContractAddressesAndBlockNumbers();
            
    }, []);

    return (
        <Container>
        <div className='container'>
            
           {
            errorMessage ? (
                <h1>Error: {errorMessage}</h1>
            ) : (
                blocks.map((block, index) => (
                    <Block key={index} block={block} />
                ))
            )           
           }
        </div>
        </Container>
    )
}

export default ViewBlocks;
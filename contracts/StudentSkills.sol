//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.13;

contract StudentSkills{
    string public publicKey;
    string public hashedData;

    constructor(string memory newPublicKey, string memory newHashedData){
        publicKey = newPublicKey;
        hashedData = newHashedData;
    }

    function getPublicKey() public view returns (string memory){
        return publicKey;
    }

    function getHashedData() public view returns (string memory){
        return hashedData;
    }
}
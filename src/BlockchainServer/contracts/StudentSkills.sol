//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.13;

contract StudentSkills{
    string public publicKey;
    string public hashedData;
    uint256 public numberOfEntries; 

    struct Entry {
        string encryptedData; //Might have to make an extra Entry for signatures
        string signature;
        string employerPublicKey;
    }

    mapping(uint256 => Entry) public entries;

    constructor(string memory newPublicKey, string memory newHashedData){
        publicKey = newPublicKey;
        hashedData = newHashedData;
        numberOfEntries = 0;
    }

    function addEntry(string memory newEncryptedData, string memory newSignature, string memory newEmployerPublicKey) public {
        entries[numberOfEntries] = Entry(newEncryptedData, newSignature, newEmployerPublicKey);
        numberOfEntries++;
    }

    function deleteEntry(string memory employerPublicKey) public {
            for (uint256 i = 0; i < numberOfEntries; i++) {
                if (keccak256(abi.encodePacked(entries[i].employerPublicKey)) == keccak256(abi.encodePacked(employerPublicKey))) {
                    delete entries[i];
                    // Move the last entry to the deleted index and decrement the count
                    entries[i] = entries[--numberOfEntries];
                    return;
                }
            }
            revert("Entry not found");
    }

    function getEntries() public view returns (string[] memory) {
        string[] memory dataList = new string[](numberOfEntries);
        for (uint256 i = 0; i < numberOfEntries; i++) {
            dataList[i] = string(abi.encodePacked(
            '{"encryptedData":"', entries[i].encryptedData,
            '", "signature":"', entries[i].signature,
            '", "employerPublicKey":"', entries[i].employerPublicKey,
            '"}'));
        }
        return dataList;
    }
    function getPublicKey() public view returns (string memory){
        return publicKey;
    }

    function getHashedData() public view returns (string memory){
        return hashedData;
    }
}

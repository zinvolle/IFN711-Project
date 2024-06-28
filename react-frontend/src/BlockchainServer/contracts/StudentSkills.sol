//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.13;

contract StudentSkills{
    string public publicKey;
    string public hashedData;
    uint256 public numberOfEntries;
    string public studentSignaturePublicKey; 
    string public universitySignaturePublicKey;
    string public universitySignature;
    string public CID;

    struct Entry {
        string encryptedData; 
        string signature;
        string employerPublicKey;
        string encryptedSymmetricKey;
    }

    mapping(uint256 => Entry) public entries;

    constructor(string memory newPublicKey, string memory newHashedData, string memory newStudentSignaturePublicKey, string memory newUniversitySignaturePublicKey, string memory newUniversitySignature, string memory newCID){
        publicKey = newPublicKey;
        hashedData = newHashedData;
        studentSignaturePublicKey = newStudentSignaturePublicKey;
        universitySignaturePublicKey = newUniversitySignaturePublicKey;
        universitySignature = newUniversitySignature;
        CID = newCID;
        numberOfEntries = 0;
    }

    function addEntry(string memory newEncryptedData, string memory newSignature, string memory newEmployerPublicKey, string memory newEncryptedSymmetricKey) public {
        entries[numberOfEntries] = Entry(newEncryptedData, newSignature, newEmployerPublicKey, newEncryptedSymmetricKey);
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
            '", "encryptedSymmetricKey":"', entries[i].encryptedSymmetricKey,
            '"}'));
        }
        return dataList;
    }

    function getPublicKey() public view returns (string memory){
        return publicKey;
    }
    
    function getStudentSignaturePublicKey() public view returns (string memory){
        return studentSignaturePublicKey;
    }    

    function getUniversitySignaturePublicKey() public view returns (string memory){
        return universitySignaturePublicKey;
    }    

    function getUniversitySignature() public view returns (string memory){
        return universitySignature;
    }    

    function getHashedData() public view returns (string memory){
        return hashedData;
    }

    function getCID() public view returns (string memory){
        return CID;
    }

    function updateContract(string memory newCID, string memory newUniversitySignaturePublicKey, string memory newUniversitySignature, string memory newHashedData) public  {
        CID = newCID;
        universitySignaturePublicKey = newUniversitySignaturePublicKey;
        universitySignature = newUniversitySignature;
        hashedData = newHashedData;
    }
}

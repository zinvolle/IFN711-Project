import { React, useState } from 'react';
import { UploadToIPFS, DownloadFromIPFS } from './pinataService.js';
import { Container } from './containers.js';

export default function Pinata() {

    const [skillsData, setSkillsData] = useState('');
    const [symmEncryptKey, setSymmEncryptKey] = useState('');
    const [CID, setCID] = useState('');
    const [oldCID, setOldCID] = useState(null);
    const [CIDToDownload, setCIDToDownload] = useState('');
    const [downloadedData, setDownloadedData] = useState('');
    const STUDENT_PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxtP3eJUr9jMG4Ikt0z/BcHgG/fYxnVugGDERvRxBpHAaZlYr0pzeU4pMetK9Qbi5yYDBfhbnfD7doWv7icMFjWHTS6z2xeu9mk+d18+Am/JsJqwPehe0oj1vMXQuyirM7NrZ4Kgf1qMNC3B0zqAlgx6VhVRqRaSxq6cRjeYAgyaGLRGShdmMn2kUa3Xz/92dZ99boQFAkodmn1lIJi0MTcS8ioYC2Tt2WI/GqgiV7zsJkZVHim4kcOIEZfjMMmhHLaOX0zHaELbGt4a4JQ/s3bynq117j/utBEVjU0ZcZm/f9GtlLBuKiw1B/u5lguK3wfzkUEptI+kpbq8qC9qvhQIDAQAB'
//    const studentSkillsData = 'skills data example (this would be encrypted)...';
//    const symmetricEncryptionKey = 'symmetric encryption key that would be asymmetrically encrypted...';
    const studentJSON = {
        skillsData: skillsData,
        encryptionKey: symmEncryptKey
    };

    async function PinButton(){
        console.log('Attempting to pin: ' + JSON.stringify(studentJSON));
        setCID( await UploadToIPFS(studentJSON, STUDENT_PUBLIC_KEY, oldCID))
    }

    async function DownloadButton(){
        let download = await DownloadFromIPFS(CIDToDownload)
        setDownloadedData(JSON.stringify(download));
    }

    return (
        <Container>
            <h1>Pinata Test Page</h1>
            <div>
                <h4>Data Upload</h4>
                <input placeholder='Skills data to upload...' onChange={(e) => { setSkillsData(e.target.value) }}></input>
                <br/>
                <input placeholder='Encrypted symmetric encryption key to upload...' onChange= {(e) => { setSymmEncryptKey(e.target.value) }}></input>
                <br/>
                <input placeholder='CID of old data...' onChange={(e) => {setOldCID(e.target.value)}}></input>
            </div>
            <button onClick={() => {console.log(JSON.stringify(studentJSON))}}>Print JSON</button>
            <div>
                <h4>Pinning service</h4>
                <button onClick={PinButton}>Pin</button>
                <p>Item CID: {CID}</p>
                <h4>Download Pinned Data</h4>
                <div>Enter CID: <input placeholder='CID to download...' onChange={(e)=>{ setCIDToDownload(e.target.value) }}></input></div>
                <br/>
                <button onClick={DownloadButton}>Download</button>
                <p>Downloaded data: {downloadedData}</p>
            </div>
        </Container>
    )
}
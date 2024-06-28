import { React, useState } from 'react';
import { UploadToIPFS, DownloadFromIPFS } from './pinataService.js';
import { Container } from './containers.js';
import { Decrypt, DecryptWithSymmetricKey } from '../CryptoTools/CryptoTools.js';

export default function Pinata() {

    const [skillsData, setSkillsData] = useState('');
    const [symmEncryptKey, setSymmEncryptKey] = useState('');
    const [CID, setCID] = useState('');
    const [oldCID, setOldCID] = useState(null);
    const [CIDToDownload, setCIDToDownload] = useState('');
    const [downloadedData, setDownloadedData] = useState('');
    const [decryptedData, setDecryptedData] = useState('');
    const STUDENT_PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxtP3eJUr9jMG4Ikt0z/BcHgG/fYxnVugGDERvRxBpHAaZlYr0pzeU4pMetK9Qbi5yYDBfhbnfD7doWv7icMFjWHTS6z2xeu9mk+d18+Am/JsJqwPehe0oj1vMXQuyirM7NrZ4Kgf1qMNC3B0zqAlgx6VhVRqRaSxq6cRjeYAgyaGLRGShdmMn2kUa3Xz/92dZ99boQFAkodmn1lIJi0MTcS8ioYC2Tt2WI/GqgiV7zsJkZVHim4kcOIEZfjMMmhHLaOX0zHaELbGt4a4JQ/s3bynq117j/utBEVjU0ZcZm/f9GtlLBuKiw1B/u5lguK3wfzkUEptI+kpbq8qC9qvhQIDAQAB'
    const STUDENT_PRIVATE_KEY = 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDG0/d4lSv2MwbgiS3TP8FweAb99jGdW6AYMRG9HEGkcBpmVivSnN5Tikx60r1BuLnJgMF+Fud8Pt2ha/uJwwWNYdNLrPbF672aT53Xz4Cb8mwmrA96F7SiPW8xdC7KKszs2tngqB/Wow0LcHTOoCWDHpWFVGpFpLGrpxGN5gCDJoYtEZKF2YyfaRRrdfP/3Z1n31uhAUCSh2afWUgmLQxNxLyKhgLZO3ZYj8aqCJXvOwmRlUeKbiRw4gRl+MwyaEcto5fTMdoQtsa3hrglD+zdvKerXXuP+60ERWNTRlxmb9/0a2UsG4qLDUH+7mWC4rfB/ORQSm0j6SluryoL2q+FAgMBAAECggEAGXHY8rqMZLaFA8kqbyVymPUTV/7gvJWUOGRXM89g6y1Zg401kH94yFIjlXhQtg9w30O1/2/o8fKNpHHQQAIQPNavFrks34lau1vDBHJOsCZnBs/wLxzHhhe8miSXNFIj5Y/gYCrD4FD/g15B5IuEIXKRif2SmBUKk8AOtA0iNaZHtod1KwCU4Ioj28M8H8xuqBwKYlrCIbma3LDMifSPGH0bGJkgtox7FwCP5bvO5uv83aqtHm7BeY+hNdYZaFjxd0LRxFxvo2ihvG8gWUGvdbfvOsp+JHDeiWOH6jFxAAvR9tDvDZKKP8IawQiCPTxDvGDqjge0Dr4cnfC2V0NkBQKBgQDlmctOPXp6eVkgbWwKdE490s3qLPVXEqT7XVfvmIdcxQ8i6QEJLrGGZGibZt4QQAzCDYgNpLWz0DGR4C0L+DF0m8LjjIm0tpjezhhpRUlsz/xxJdLWe8k7coduNYuFjqmj9GKIffH1wAUc0eZXZITkf3Uo0iy8FmNErNW1B72W1wKBgQDdsGN8pTs1pMuJtnVbs6aeSpmnd7xKyyH7OlLd8rzhxi1q0SjgZxN8puio+rZkRPZtjv43FftZokX1RVIrKvjlbVUepQdwqHZT7qeTobhgY3qm02KCMVDoHUsHCrPvXmsuw5nxomxfNyKQGGO9PUV36gXbc8qLCZxg3Shpoa8NAwKBgCzlUNLgxKVUOzBTFTBKI86E/QzQc7zuAWLBkuNf8QAb7GTIKRKxlbcQxT+18rA8xgHgAX2heoJJsJe0vTo88va5SneSUI8MsYHHzRAwozXqyZMacUrNc8DzGTZctAaOqe9MZ0QHVJvYS2eiR6dJGY9QuQkdZ+/zdL/GCBfZBqKLAoGBAKLM5kKjFNhQLSj01TqCs9mK70wMojpK8qmMK07S8+LZpoDLGTmyeJ0R9coiU89O1amfWREbE3q/sKBuR+lrpVzW7auTheM106/Pk0DXgo9GfswEcFMr5D6RRIfnVDx1GkE9Y9APd4Z09uza/GP8mwd01NhUMGnqpOx9fTAVjHgBAoGAM+PXlKL+qAGysa0ye7rqSz0sRheLMFwBmFzPnmhsYIhbDmAevPwsekTXPPDF9iuLYwY4xh65m359tdESfFUEl35IJ2amcLURvsMtBluxxX+v7HnMIDek9+5SNBti5VduDOpfOcjwEtrILq56fGhaxBIPEh2CditJZEBWDusn/ro='
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

    async function DecryptButton(){
        let download = await DownloadFromIPFS(CIDToDownload)
        //let download = {downloadedData.skillsData}
        let symmkey = await Decrypt(download.encryptionKey, STUDENT_PRIVATE_KEY)
        let decrypt = await DecryptWithSymmetricKey(symmkey, download.skillsData)
        setDecryptedData(JSON.stringify(decrypt));
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
            <div>
                <button onClick={DecryptButton}>Decrypt</button>
                <p>Decrypted data: {decryptedData}</p>
            </div>
        </Container>
    )
}
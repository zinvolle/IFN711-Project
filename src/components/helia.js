import React from "react";
import { useState, useEffect } from 'react';
import { HeliaInit, UploadToIPFS, DownloadFromIPFS } from './heliaFuncs.js';


export default function Helia() {

    const [CID, setCID] = useState('CID');
    const [dataToUpload, setDataToUpload] = useState('');
    const [dataRetrieved, setDataRetrieved] = useState('');
    const [helia, setHelia] = useState();
    const [fs, setFs] = useState();

    useEffect(()=>{HeliaStartUp();},[]);

    async function HeliaStartUp(){
        const [_helia, _fs] = await HeliaInit();
        setHelia(_helia);
        setFs(_fs);
    }

    async function onClickUpload(){
        setCID(await UploadToIPFS(fs, dataToUpload));
    }

    async function onClickDownload(){
        setDataRetrieved(await DownloadFromIPFS(fs, CID));
    }

    return (
        <div>
            <h1>Helia Implementation</h1>
            <div>
                <h4>Input data to upload to IPFS:</h4>
                <input placeholder="data to upload..." onChange={(e) => setDataToUpload(e.target.value)}></input>
            </div>
            <br></br>
            <div>
                <button onClick={onClickUpload}>Upload to IPFS</button>
                <p>CID is: {CID}</p>
            </div>
            <div>
                <h4>Retrieve data from IPFS:</h4>
                <button onClick={onClickDownload}>Download from IPFS</button>
                <br></br>
                <p>Data is: {dataRetrieved}</p>
            </div>


        </div>
    )

}



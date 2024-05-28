import React from "react";
import { useState, useEffect } from 'react';
import { HeliaInit, UploadToIPFS, DownloadFromIPFS } from './heliaFuncs.js';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';

export default function Helia() {

    const [CID, set_CID] = useState('CID');
    const [dataToUpload, setDataToUpload] = useState('');
    const [dataRetrieved, setDataRetrieved] = useState('');
    const [helia, setHelia] = useState();
    const [fs, setFs] = useState();

    useEffect(()=>{HeliaStartUp();},[]);

    async function HeliaStartUp(){
        setHelia(await createHelia());
        setFs(unixfs(helia));
    }

    async function onClickUpload(){
        set_CID(await UploadToIPFS(fs, dataToUpload));
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



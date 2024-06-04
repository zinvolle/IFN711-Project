import { React, useState } from 'react';
import { InitHelia, UploadToHelia, DownloadFromHelia } from './heliaFuncs.js';

export default function Helia() {

    const [heliaFs, setHeliaFs] = useState(null);
    const [dataInput, setDataInput] = useState('');
    const [CID, setCID] = useState('');
    const [CIDToDownload, setCIDToDownload] = useState('');
    const [dataOutput, setDataOutput] = useState('');

    async function StartHeliaButton() {
        console.log('Starting Helia Node...')
        setHeliaFs(await InitHelia());
    }

    async function UploadButton() {
        console.log("Uploading: " + dataInput);
        setCID(await UploadToHelia(heliaFs, dataInput));
    }

    async function DownloadButton() {
        console.log('Downloading from: ' + CIDToDownload);
        setDataOutput(await DownloadFromHelia(heliaFs, CIDToDownload));
    }

    return (
        <div>
            <h1>Helia Test Page</h1>
            <h4>Helia Startup:</h4>
            <button onClick={ StartHeliaButton }>Start Helia</button>
            <h4>Data Upload</h4>
            <input placeholder='Data to upload...' onChange={(e) => { setDataInput(e.target.value) }}></input>
            <button onClick={ UploadButton }>Upload</button>
            <p>Uploaded CID: {CID}</p>
            <h4>Data Download</h4>
            <div>CID to download:  
            <input placeholder='CID to download...' onChange={(e) =>{setCIDToDownload(e.target.value) }}></input>
            </div>
            <button onClick={ DownloadButton }>Download</button>
            <p>Data downloaded: {dataOutput}</p>
        </div>
    )
}
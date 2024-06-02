import { React, useEffect, useState } from 'react';
import { unixfs } from '@helia/unixfs'
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';

export default function Helia(_heliaFs) {

    const [heliaFs, setHeliaFs] = useState(null);
    const [dataInput, setDataInput] = useState('');
    const [CID, setCID] = useState('');
    const [CIDToDownload, setCIDToDownload] = useState('');
    const [dataOutput, setDataOutput] = useState('');

    async function StartupHelia() {
        const libp2p = await createLibp2p({
            transports: [ webSockets() ]
        })
        const helia = await createHelia({
            libp2p
        });
        setHeliaFs(unixfs(helia));
    }

    async function UploadToHelia() {
        // we will use this TextEncoder to turn strings into Uint8Arrays
        const encoder = new TextEncoder()

        // add the bytes to your node and receive a unique content identifier
        try{
            const cid = await heliaFs.addBytes(encoder.encode(dataInput));
            setCID(cid.toString());
        }
        catch(err){
            setCID(err.message);
        }
    }

    async function DownloadFromHelia() {
        // this decoder will turn Uint8Arrays into strings
        const decoder = new TextDecoder()
        let text = ''

        for await (const chunk of heliaFs.cat(CIDToDownload)) {
            text += decoder.decode(chunk, {
                stream: true
            })
        }

        setDataOutput(text);
    }

    return (
        <div>
            <h1>Helia Test Page</h1>
            <h4>Helia Startup:</h4>
            <button onClick={() => { StartupHelia(); }}>Start Helia</button>
            <h4>Data Upload</h4>
            <input placeholder='Data to upload...' onChange={(e) => { setDataInput(e.target.value) }}></input>
            <button onClick={() => { UploadToHelia(); }}>Upload</button>
            <p>Uploaded CID: {CID}</p>
            <h4>Data Download</h4>
            <div>CID to download:  
            <input placeholder='CID to download...' onChange={(e) =>{setCIDToDownload(e.target.value) }}></input>
            </div>
            <button onClick={() => { DownloadFromHelia(); }}>Download</button>
            <p>Data downloaded: {dataOutput}</p>
        </div>
    )
}
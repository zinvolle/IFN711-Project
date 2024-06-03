import { unixfs } from '@helia/unixfs';
import { createHelia } from 'helia';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';

export async function InitHelia() {
    // create a Helia node
    const libp2p = await createLibp2p({
        transports: [webSockets()]
    })
    const helia = await createHelia({
        libp2p
    });
    return (unixfs(helia));
}

export async function UploadToHelia(_fs, _data) {
    // we will use this TextEncoder to turn strings into Uint8Arrays
    const encoder = new TextEncoder();

    // add the bytes to your node and receive a unique content identifier
    try {
        const cid = await _fs.addBytes(encoder.encode(_data));
        return (cid.toString());
    }
    catch (err) {
        console.log(err.message);
        return ('');
    }
}

export async function DownloadFromHelia(_fs, _CID) {
    // this decoder will turn Uint8Arrays into strings
    const decoder = new TextDecoder()
    let text = ''

    for await (const chunk of _fs.cat(_CID)) {
        text += decoder.decode(chunk, {
            stream: true
        })
    }

    return(text);
}
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';

/* export async function HeliaInit(){
    // create a Helia node
    const helia = await createHelia();

    const _fs = unixfs(helia)

    return([helia, _fs]);

} */

export async function UploadToIPFS(fs, _data){
    // use this TextEncoder to turn strings into Uint8Arrays
    const encoder = new TextEncoder();
    const bytes = encoder.encode(_data);

    // add the bytes to node and receive a unique content identifier
    const cid = await fs.addBytes(bytes);

    return(cid.toString());
}

export async function DownloadFromIPFS(fs, _CID){
    // this decoder will turn Uint8Arrays into strings
    const decoder = new TextDecoder()
    let downloadedData = ''

    for await (const chunk of fs.cat(_CID)) {
        downloadedData += decoder.decode(chunk, {
            stream: true
        })
    }

    return(downloadedData);
}
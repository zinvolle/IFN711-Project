import { unixfs } from '@helia/unixfs'
import { createHelia } from 'helia'

export async function InitHelia(){
    // create a Helia node
    const helia = await createHelia();
    return(unixfs(helia));
}

export async function RunHelia(_fs) {
    // we will use this TextEncoder to turn strings into Uint8Arrays
    const encoder = new TextEncoder()

    // add the bytes to your node and receive a unique content identifier
    const cid = await _fs.addBytes(encoder.encode('Hello World 102'));

    console.log('Added file:', cid.toString())

    // this decoder will turn Uint8Arrays into strings
    const decoder = new TextDecoder()
    let text = ''

    for await (const chunk of _fs.cat(cid)) {
        text += decoder.decode(chunk, {
            stream: true
        })
    }

    console.log('Added file contents:', text)
}


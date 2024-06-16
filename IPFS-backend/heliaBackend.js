/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { json } from '@helia/json'
import { bootstrap } from '@libp2p/bootstrap'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import { multiaddr } from '@multiformats/multiaddr'
import { FsBlockstore } from 'blockstore-fs'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'

async function createNode() {
    // the blockstore is where we store the blocks that make up files
    const blockstore = new FsBlockstore("/IPFS-storage/")

    // application-specific data lives in the datastore
    const datastore = new MemoryDatastore()

    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
        datastore,
        addresses: {
            listen: [
                '/ip4/127.0.0.1/tcp/9090/ws'
            ]
        },
        transports: [
            webSockets()
        ],
        connectionEncryption: [
            noise()
        ],
        streamMuxers: [
            yamux()
        ],
        services: {
            identify: identify()
        }
    })

    return await createHelia({
        blockstore,
        libp2p
    })
}

console.log("Running code...");

// create two helia nodes
const node1 = await createNode()
const node2 = await createNode()

// connect them together
const multiaddrs = node2.libp2p.getMultiaddrs()
await node1.libp2p.dial(multiaddrs[0])

// create a filesystem on top of Helia, in this case it's UnixFS
const fs = unixfs(node1)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

// add the bytes to your node and receive a unique content identifier
const cid = await fs.addBytes(encoder.encode('Hello World 301'))

console.log('Added file:', cid.toString())

// create a filesystem on top of the second Helia node
const fs2 = unixfs(node2)

// this decoder will turn Uint8Arrays into strings
const decoder = new TextDecoder()
let text = ''

// use the second Helia node to fetch the file from the first Helia node
for await (const chunk of fs2.cat(cid)) {
    text += decoder.decode(chunk, {
        stream: true
    })
}

console.log('Fetched file contents:', text)
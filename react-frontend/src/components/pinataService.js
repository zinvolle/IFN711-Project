import { HashDataSHA256 } from "../CryptoTools/CryptoTools";

/* 
UploadToIPFS
Description: Uploads a JSON to IPFS, using the hash of the provided public key as the file name. Provides the CID of the data stored on IPFS
Inputs:  
    _data: JSON file consisting of { skillsData: , encryptionKey: }
    _publicKey: public key of the student owner of the skills being uploaded
    _CID: CID of old JSON data to be deleted (when updating skills data)

Outputs:
    CID: string of the IPFS CID of the data that was uploaded
*/
export async function UploadToIPFS(_data, _publicKey, _OldCID = null) {
    try {
        const data = JSON.stringify({
            // create JSON of data to upload
            pinataContent: {
                skillsData: _data.skillsData,
                encrpytionKey: _data.encryptionKey
            },
            // name the data the hash of the public key
            pinataMetadata: {
                name: await HashDataSHA256(_publicKey)
            }
        })

        // upload data to IPFS through Pinata
        const res = await fetch(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.REACT_APP_JWT}`,
                },
                body: data,
            }
        );

        // receive IPFS CID of data uploaded
        const CID = await res.json();

        // check if old data present
        if(_OldCID != null){
            try{
                // delete old data
                await fetch(
                    `https://api.pinata.cloud/pinning/unpin/${_OldCID}`,
                    {
                        method: "DELETE",
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${process.env.REACT_APP_JWT}`,
                        }
                    }
                );
            }catch(err){
                console.log(err);
            }
        }

        // return CID of data uploaded
        return (CID.IpfsHash);

    } catch (err) {
        console.log('Upload to IPFS failed: ' + err);
    }
}

/* 
DownloadFromIPFS
Description: Downloads the data that was uploaded for the public key provided.
Inputs:  
    _publicKey: public key of the student owner of the skills being downloaded

Outputs:
    studentJSON: JSON of the encrypted student skills data and symmetric encryption key. Format is { studentSkills: , encryptionKey: }.
*/
export async function DownloadFromIPFS(_CID) {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_GATEWAY_URL}/ipfs/${_CID}`,
            {
                method: "GET"
            }
        );
        const downloadedSkillsData = await res.json()
        return(downloadedSkillsData);
    } catch (err) {
        console.log('Download from IPFS failed: ' + err);
    }
}
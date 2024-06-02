import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import all from 'it-all';
import concat from 'uint8-concat';

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });
//const ipfs = create();

const IPFSUploader = () => {
  const [data, setData] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDataChange = (e) => {
    setData(e.target.value);
  };

  const uploadToIPFS = async () => {
    if (!data) {
      console.error("No data provided.");
      setErrorMessage("No data provided.");
      return;
    }

    try {
      const dataBuffer = Buffer.from(data);
      const result = await ipfs.add(dataBuffer);

      await ipfs.pin.add(result.cid);
      const directoryPath = '/my-uploaded-data';
      await ensureDirectoryExists(directoryPath);

      const filePath = `${directoryPath}/${result.cid}`;
      
      await deleteExistingFile(filePath);
      await ipfs.files.cp(`/ipfs/${result.cid}`, filePath);

      setFileHash(result.cid.toString());
      console.log('Data uploaded to IPFS:', result);
    } catch (error) {
      console.error('Error uploading data to IPFS:', error);
      setErrorMessage(`Error uploading data: ${error.message}`);
    }
  };

  const ensureDirectoryExists = async (path) => {
    try {
      await ipfs.files.stat(path);
    } catch (error) {
      if (error.message.includes('file does not exist')) {
        await ipfs.files.mkdir(path, { parents: true });
      } else {
        console.error('Error checking directory existence:', error);
      }
    }
  };

  const deleteExistingFile = async (path) => {
    try {
      await ipfs.files.stat(path);
      await ipfs.files.rm(path, { recursive: true });
    } catch (error) {
      if (!error.message.includes('file does not exist')) {
        console.error('Error removing existing file:', error);
      }
    }
  };

  return (
    <div style ={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <textarea value={data} onChange={handleDataChange} />
      <button onClick={uploadToIPFS}>Upload Data to IPFS</button>
      {fileHash && (
        <div>
          <p>IPFS Hash: {fileHash}</p>
          <p>
            View on IPFS Web UI:{' '}
            <a href={`http://127.0.0.1:5001/webui/#/files/my-uploaded-data/${fileHash}`} target="_blank" rel="noopener noreferrer">
              http://127.0.0.1:5001/webui/#/files/my-uploaded-data/{fileHash}
            </a>
          </p>
        </div>
      )}
      {errorMessage && <p>Error: {errorMessage}</p>}
    </div>
  );
};

const IPFSDownloader = () => {
  const [cid, setCid] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [fileOutput, setfileOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleCidChange = (e) => {
    setCid(e.target.value);
  };
  const retrieveFile = async () => {
    try {
      const file = concat(await all(ipfs.cat(cid)))
      const data = new TextDecoder().decode(file).toString();
      console.log('Retrieved file content:', data);
      setfileOutput(data)
    } catch (error) {
      console.error('Error retrieving file:', error);
            setErrorMessage(`Error retreiving data: ${error.message}`);
    }
  }
  return (
    <div style ={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <textarea value={cid} onChange={handleCidChange} />
      <button onClick={retrieveFile}>Output IPFS File</button>
      {fileOutput && (
        <div>
          <p>File Contents: {fileOutput}</p>
        </div>
      )}
      {errorMessage && <p>Error: {errorMessage}</p>}
    </div>
  );
};


export {IPFSUploader,IPFSDownloader}
export default IPFSUploader
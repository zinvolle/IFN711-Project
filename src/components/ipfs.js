import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

const IPFSUploader = () => {
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const ensureDirectoryExists = async (path) => {
    try {
      await ipfs.files.stat(path);
    } catch (error) {
      if (error.message.includes('file does not exist')) {
        await ipfs.files.mkdir(path, { parents: true });
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
  

  const uploadToIPFS = async () => {
    if (!file) {
      console.error("No file selected.");
      setErrorMessage("No file selected.");
      return;
    }

    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const result = await ipfs.add(fileBuffer);

      await ipfs.pin.add(result.cid);
      const directoryPath = '/my-uploaded-files';
      await ensureDirectoryExists(directoryPath);

      const filePath = `${directoryPath}/${result.cid}`;
      
      await deleteExistingFile(filePath);
      await ipfs.files.cp(`/ipfs/${result.cid}`, filePath);

      setFileHash(result.cid.toString());
      console.log('File uploaded to IPFS:', result);
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      setErrorMessage(`Error uploading file: ${error.message}`);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadToIPFS}>Upload to IPFS</button>
      {fileHash && (
        <div>
          <p>IPFS Hash: {fileHash}</p>
          <p>
            View on IPFS Web UI:{' '}
            <a href={`http://127.0.0.1:5001/webui/#/files/my-uploaded-files/${fileHash}`} target="_blank" rel="noopener noreferrer">
              http://127.0.0.1:5001/webui/#/files/my-uploaded-files/{fileHash}
            </a>
          </p>
        </div>
      )}
      {errorMessage && <p>Error: {errorMessage}</p>}
    </div>
  );
};

export default IPFSUploader;
import React, { useState, useEffect } from 'react';


function CryptoExample() {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [symmetricKeyString, setSymmetricKeyString] = useState(null);
  const [symmetricKey, setSymmetricKey] = useState(null);
  const [encryptedSymmetricMessage, setEncryptedSymmetricMessage] = useState(null);
  const [decryptedSymmetricMessage, setDecryptedSymmetricMessage] = useState(null);
  const [dataToEncryptUsingSymmetricKey, setDataToEncryptUsingSymmetricKey] = useState(null);
  const [publicKeyString, setPublicKeyString] = useState(null)
  const [privateKeyString, setPrivateKeyString] = useState(null)
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [encryptData, setEncryptData] = useState('')
  const [testPublicKey, setTestPublicKey] = useState('')
  const [testPrivateKey, setTestPrivateKey] = useState('')
  const [signaturePrivateKey, setSignaturePrivateKey] = useState('')
  const [signaturePublicKey, setSignaturePublicKey] = useState('')
  const [signaturePublicString, setSignaturePublicString] = useState('')
  const [signaturePrivateString, setSignaturePrivateString] = useState('')
  const [dataToSign, setDataToSign] = useState('')
  const [testSignPublicKey, setTestSignPublicKey] = useState('')
  const [testSignPrivateKey, setTestSignPrivateKey] = useState('')
  const [signatureIsValid, setSignatureIsValid] = useState('')
  const [hashString, setHashString] = useState('')
  const [hash, setHash] = useState('')


    const importKeysFromBase64 = async (publicKeyBase64, privateKeyBase64) => {
        const importedPublicKey = await importPublicKeyFromBase64(publicKeyBase64, 'spki');
        const importedPrivateKey = await importPrivateKeyFromBase64(privateKeyBase64, 'pkcs8');
        setPublicKey(importedPublicKey);
        setPrivateKey(importedPrivateKey);

        const publicKeyExport = await crypto.subtle.exportKey('spki', importedPublicKey);
        const publicKeyString = arrayBufferToBase64(publicKeyExport);
        setPublicKeyString(publicKeyString)
      

        const privateKeyExport = await crypto.subtle.exportKey('pkcs8', importedPrivateKey);
        const privateKeyString = arrayBufferToBase64(privateKeyExport);
        setPrivateKeyString(privateKeyString)
    };

    async function importSignatureKeysFromBase64(publicKeyBase64, privateKeyBase64) {
        try {
          const importedPublicKey = await importSignaturePublicKeyFromBase64(publicKeyBase64, 'spki');
          const importedPrivateKey = await importSignaturePrivateKeyFromBase64(privateKeyBase64, 'pkcs8');
          setSignaturePublicKey(importedPublicKey);
          setSignaturePrivateKey(importedPrivateKey);  
          
          const publicKeyExport = await crypto.subtle.exportKey('spki', importedPublicKey);
          const publicKeyString = arrayBufferToBase64(publicKeyExport);
          setSignaturePublicString(publicKeyString)

          const privateKeyExport = await crypto.subtle.exportKey('pkcs8', importedPrivateKey);
          const privateKeyString = arrayBufferToBase64(privateKeyExport);
          setSignaturePrivateString(privateKeyString)

        } catch (error) {
          console.error('Key import failed:', error);
          throw error;
        }
      }

     


    const importPublicKeyFromBase64 = async (keyBase64, format) => {
        const keyData = base64ToArrayBuffer(keyBase64);
        const importedKey = await crypto.subtle.importKey(
          format,
          keyData,
          { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
          true,
          ['encrypt']
        );
        return importedKey;
      };

      const importPrivateKeyFromBase64 = async (keyBase64, format) => {
        const keyData = base64ToArrayBuffer(keyBase64);
        const importedKey = await crypto.subtle.importKey(
          format,
          keyData,
          { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
          true,
          ['decrypt']
        );
        return importedKey;
      };
      
      const importSignaturePublicKeyFromBase64 = async (keyBase64, format) => {
        const keyData = base64ToArrayBuffer(keyBase64);
        const importedKey = await crypto.subtle.importKey(
          format,
          keyData,
          { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
          true,
          ['verify']
        );
        return importedKey;
      };
      
      const importSignaturePrivateKeyFromBase64 = async (keyBase64, format) => {
        const keyData = base64ToArrayBuffer(keyBase64);
        const importedKey = await crypto.subtle.importKey(
          format,
          keyData,
          { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
          true,
          ['sign']
        );
        return importedKey;
      };

      async function sign() {
        const encoder = new TextEncoder();
        const data = encoder.encode(dataToSign);
        const signature = await crypto.subtle.sign(
          { name: 'RSASSA-PKCS1-v1_5' },
          signaturePrivateKey,
          data
        );
        const signatureBase64 = arrayBufferToBase64(signature)
        console.log(signatureBase64)
        return signatureBase64;
      }

      async function verifySignature(signature) {
        const signatureBuffer = base64ToArrayBuffer(signature)
        const encoder = new TextEncoder();
        const data = encoder.encode(dataToSign);
        const isValid = await crypto.subtle.verify(
          { name: 'RSASSA-PKCS1-v1_5' },
          signaturePublicKey,
          signatureBuffer,
          data
        );
        return isValid;
      }


  const encryptMessage = async () => {
    if (!publicKey) {
      console.error('Public key not available');
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(encryptData);

    try {
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
          // The 'publicKey' parameter should be a CryptoKey object
        },
        publicKey,
        data
      );
      const base64EncryptedData = arrayBufferToBase64(encryptedData);
      setEncryptedMessage(base64EncryptedData);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  const decryptMessage = async () => {
    if (!privateKey) {
      console.error('Private key not available');
      return;
    }

    const decoder = new TextDecoder();
    const encodedEncryptedData = atob(encryptedMessage); // Decode Base64
    const encryptedData = new Uint8Array(encodedEncryptedData.length);
    for (let i = 0; i < encodedEncryptedData.length; i++) {
        encryptedData[i] = encodedEncryptedData.charCodeAt(i);
    }

    try {
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        privateKey,
        encryptedData
      );

      setDecryptedMessage(decoder.decode(decryptedData));
    } catch (error) {
      console.error('Decryption failed:', error);
    }
  };

  const arrayBufferToBase64 = buffer => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

    const base64ToArrayBuffer = base64String => {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

    const generateRSAKeyPair = async () => {
        const keyPair = await crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
            hash: { name: 'SHA-256' },
        },
        true, // Extractable
        ['encrypt', 'decrypt']
        );

        const publicKey = keyPair.publicKey;
        const publicKeyExport = await crypto.subtle.exportKey('spki', keyPair.publicKey);

        const privateKey = keyPair.privateKey;
        const privateKeyExport = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

        const publicKeyBase64 = arrayBufferToBase64(publicKeyExport);
        const privateKeyBase64 = arrayBufferToBase64(privateKeyExport);


        console.log('New Public: ',arrayBufferToBase64(publicKeyExport))
        console.log('New Private: ', arrayBufferToBase64(privateKeyExport))

        importKeysFromBase64(publicKeyBase64,privateKeyBase64)

        return { publicKey, privateKey };
    };

    const generateSymmetricKey = async () => {
      try {
          // Generate an AES-256 key
          const key = await crypto.subtle.generateKey(
              {
                  name: "AES-GCM",
                  length: 256 // key length in bits
              },
              true, // whether the key is extractable (i.e., can be exported)
              ["encrypt", "decrypt"] // can be used for these purposes
          );
  
          // Export the key to raw format (ArrayBuffer)
          const rawKey = await crypto.subtle.exportKey("raw", key);
  
          const base64Key = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
  
          console.log("Generated AES-256 key (hex):", base64Key);

          setSymmetricKeyString(base64Key)
          setSymmetricKey(key)
  
          return key; // return the generated key
      } catch (error) {
          console.error("Error generating symmetric key:", error);
      }
  }

  async function encryptWithSymmetricKey(keyBase64, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random initialization vector (IV)
    const encodedData = new TextEncoder().encode(data); // Encode the data as bytes

    const keyBytes = base64ToArrayBuffer(keyBase64)
    console.log(keyBytes.length)

    const key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
  );

    try {
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv // The IV should be unique for every encryption
            },
            key,
            encodedData
        );
        const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
        combinedData.set(iv);
        combinedData.set(new Uint8Array(encryptedData), iv.length);

        // Convert the combined data to a Base64 string for easy storage/transmission
        const base64CombinedData = btoa(String.fromCharCode(...combinedData));

        setEncryptedSymmetricMessage(base64CombinedData)

        // Return both the IV and the encrypted data
        return {
            iv: iv,
            encryptedData: encryptedData
        };
    } catch (error) {
        console.error("Error encrypting data:", error);
    }
}

async function decryptDataWithSymmetricKey(keyBase64, base64CombinedData) {
  try {
      // Convert the Base64 string back to a Uint8Array
      const combinedData = Uint8Array.from(atob(base64CombinedData), c => c.charCodeAt(0));

      // Extract the IV and the encrypted data
      const iv = combinedData.slice(0, 12);
      const encryptedData = combinedData.slice(12);

      const keyBytes = base64ToArrayBuffer(keyBase64)
      console.log(keyBytes.length)
  
      const key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );

      const decryptedData = await crypto.subtle.decrypt(
          {
              name: "AES-GCM",
              iv: iv
          },
          key,
          encryptedData
      );

      const decryptedMessageString = new TextDecoder().decode(decryptedData);
      setDecryptedSymmetricMessage(decryptedMessageString)

      // Decode the decrypted bytes back into a string
      return decryptedMessageString
  } catch (error) {
      console.error("Error decrypting data:", error);
  }
}


  async function generateKeyPairForSigningAndVerification() {
      try {
        const keyPair = await crypto.subtle.generateKey(
          {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
            hash: { name: 'SHA-256' },
          },
          true, // Extractable
          ['sign', 'verify']
        );
    
        const publicKey = keyPair.publicKey;
        const privateKey = keyPair.privateKey;
      
        const publicKeyExport = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        const privateKeyExport = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

        const publicKeyBase64 = arrayBufferToBase64(publicKeyExport);
        const privateKeyBase64 = arrayBufferToBase64(privateKeyExport);
        
        console.log('New Signature Public: ',publicKeyBase64)
        console.log('New Signature Private: ', privateKeyBase64)

        importSignatureKeysFromBase64(publicKeyBase64, privateKeyBase64)
        
      } catch (error) {
        console.error('Key pair generation failed:', error);
        throw error;
      }
    }

      async function hashDataSHA256(data) {
        // Convert data to ArrayBuffer
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
    
        // Hash the data using SHA-256 algorithm
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    
        // Convert hash ArrayBuffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    
        return hashHex;
    }


  return (
    <div className="container">
      <h2>Asymmetric Public and Private key testing</h2>
      <div>
        <button onClick={encryptMessage}>Encrypt Message</button>
        <button onClick={decryptMessage}>Decrypt Message</button>
        <button onClick={generateRSAKeyPair}>Generate Key Pair</button>
      </div>
      <div>
        <p>Public Key: {publicKeyString}</p>
        <p>Private Key: {privateKeyString}</p>
        <label> Encrypt message
            <input type = 'text' onChange={(e) => setEncryptData(e.target.value)} placeholder='encrypt message'/>
        </label>
        <p style = {{marginTop:'20px'}}>Encrypted Message: {encryptedMessage}</p>
        <p>Decrypted Message: {decryptedMessage}</p>
      </div>

      <div style = {{marginTop:'50px', display:'flex', flexDirection:'column',}}>
        <h1>Test Public and Private Key</h1>
        <label> Your Public Key
            <input type = 'text' onChange={(e) => setTestPublicKey(e.target.value)} placeholder='Public Key'/>
        </label>
        <label> Your Private Key
            <input type = 'text' onChange={(e) => setTestPrivateKey(e.target.value)} placeholder='Private Key'/>
        </label>
        <button onClick={()=>{
            importKeysFromBase64(testPublicKey,testPrivateKey)
        }} style = {{width:'60px', marginLeft:'100px'}}>
        Test</button>
      </div>

      <div style={{marginTop:'40px'}}>
        <h1>Symmetric key Testing</h1>
        <button onClick={generateSymmetricKey}>Generate Symmetric Key</button>
        <button onClick={() => encryptWithSymmetricKey(symmetricKeyString, dataToEncryptUsingSymmetricKey)}>Encrypt Message</button>
        <button onClick={() => decryptDataWithSymmetricKey(symmetricKeyString, encryptedSymmetricMessage)}>Decrypt Message</button>
        
        <h4>Symmetric Key: {symmetricKeyString}</h4>
        <label> Encrypt message
            <input type = 'text' onChange={(e) => setDataToEncryptUsingSymmetricKey(e.target.value)} placeholder='encrypt message'/>
        </label>
        <h3>Encrypted Message: {encryptedSymmetricMessage}</h3>

        <h3>Decrypted Message: {decryptedSymmetricMessage}</h3>
      </div>

      <div style = {{marginTop:'60px'}}>
        <h1>Signature Keys</h1>
        <button onClick={generateKeyPairForSigningAndVerification}>Generate Signature Key Pair</button>
        <p>Signature Public Key: {signaturePublicString}</p>
        <p>Signature Private Key: {signaturePrivateString}</p>
        <label> Data to sign
            <input type = 'text' onChange={(e) => setDataToSign(e.target.value)} placeholder='data to sign'/>
        </label>
        <button onClick={async ()=>{
            const signature = await sign();;
            const isValid = await verifySignature(signature);
            setSignatureIsValid(isValid)
            console.log(isValid)
        }}>Sign</button>
        <h3>Valid: {signatureIsValid.toString()}</h3>
        <h2>Test Signing Public and Private Key</h2>
        <label> Your Signature Public Key
            <input type = 'text' onChange={(e) => setTestSignPublicKey(e.target.value)} placeholder='Signature Public Key'/>
        </label>
        <label> Your Signature Private Key
            <input type = 'text' onChange={(e) => setTestSignPrivateKey(e.target.value)} placeholder='Signature Private Key'/>
        </label>
        <button onClick={()=>{importSignatureKeysFromBase64(testSignPublicKey,testSignPrivateKey)}}>Test</button>
      </div>


      <div>
        <h1>Hashing strings</h1>
        <label> Enter string to Hash
            <input type = 'text' onChange={(e) => setHashString(e.target.value)} placeholder='Hash string'/>
        </label>
        <h4>Hash:</h4>
        <p>{hash}</p>
        <button onClick={async ()=>{
          hashDataSHA256(hashString)
          .then(hash => 
            setHash(hash))
        }}>Hash</button>
      </div>
    </div>
  );
}

export default CryptoExample;
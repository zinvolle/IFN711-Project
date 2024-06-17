import React from "react";
import { useState, useEffect } from "react";

export async function Encrypt(message, publicKeyBase64) {
    const keyData = base64ToArrayBuffer(publicKeyBase64);
    const publicKey = await crypto.subtle.importKey(
        'spki',
        keyData,
        { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
        true,
        ['encrypt']
    );

    if (!publicKey) {
        console.error('Public key not available');
        return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    try {
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
            },
            publicKey,
            data
        );
        const base64EncryptedData = arrayBufferToBase64(encryptedData);
        return base64EncryptedData
    } catch (error) {
        console.error('Encryption failed:', error);
    }
}

export async function Decrypt(encryptedMessageBase64, privateKeyBase64) {
    const keyData = base64ToArrayBuffer(privateKeyBase64);
    const privateKey = await crypto.subtle.importKey(
        'pkcs8',
        keyData,
        { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
        true,
        ['decrypt']
    );

    if (!privateKey) {
        console.error('Private key not available');
        return;
    }

    const encryptedData = base64ToArrayBuffer(encryptedMessageBase64);
    try {
        const decryptedData = await crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP',
            },
            privateKey,
            encryptedData
        );
        const decoder = new TextDecoder();
        const decryptedMessage = decoder.decode(decryptedData);
        return decryptedMessage;
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}

export async function Sign(message, privateKeyBase64) {
    const keyData = base64ToArrayBuffer(privateKeyBase64);
    const privateKey = await crypto.subtle.importKey(
        'pkcs8',
        keyData,
        { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
        true,
        ['sign']
    );

    if (!privateKey) {
        console.error('Private key not available');
        return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    try {
        const signature = await crypto.subtle.sign(
            { name: 'RSASSA-PKCS1-v1_5' },
            privateKey,
            data
        );
        const signatureBase64 = arrayBufferToBase64(signature)
        return signatureBase64;
    } catch (error) {
        console.error('Signing failed:', error);
        return null;
    }
}

export async function Verify(message, signatureBase64, publicKeyBase64) {
    const signature = base64ToArrayBuffer(signatureBase64)
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const keyData = base64ToArrayBuffer(publicKeyBase64);

    const publicKey = await crypto.subtle.importKey(
        "spki",
        keyData,
        { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
        true,
        ['verify']
    );

    try {
        const result = await crypto.subtle.verify(
            { name: 'RSASSA-PKCS1-v1_5' },
            publicKey,
            signature,
            data
        );
        return result;
    } catch (error) {
        console.error('Verification failed:', error);
        return false;
    }
}

export async function HashDataSHA256(data) {
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

export async function EncryptWithSymmetricKey(keyBase64, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random initialization vector (IV)
    const encodedData = new TextEncoder().encode(data); // Encode the data as bytes

    const keyBytes = base64ToArrayBuffer(keyBase64)

    const key = await crypto.subtle.importKey( //generate the key
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


        // Return both the combination of IV and encryptedData
        return base64CombinedData
    } catch (error) {
        console.error("Error encrypting data:", error);
    }
}

export async function DecryptWithSymmetricKey(keyBase64, base64CombinedData) {
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
  
        // Decode the decrypted bytes back into a string
        return decryptedMessageString
    } catch (error) {
        console.error("Error decrypting data:", error);
    }
}

export async function GenerateSymmetricKey() {
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

        return base64Key; // return the generated key
    } catch (error) {
        console.error("Error generating symmetric key:", error);
    }
}


export async function GenerateRSAKeyPairs() {
    try {
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

        const publicKeyExport = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        const privateKeyExport = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

        const publicKeyBase64 = arrayBufferToBase64(publicKeyExport);
        const privateKeyBase64 = arrayBufferToBase64(privateKeyExport);

        return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
    } catch (error) {
        console.error('Error generating RSA key pair:', error);
        throw error; // Re-throw the error to propagate it up the call stack
    }
};

export async function GenerateSignatureKeyPairs() {
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
    
      const publicKeyExport = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKeyExport = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

      const publicKeyBase64 = arrayBufferToBase64(publicKeyExport);
      const privateKeyBase64 = arrayBufferToBase64(privateKeyExport);

      return { signaturePublicKey: publicKeyBase64, signaturePrivateKey: privateKeyBase64}
    } catch (error) {
      console.error('Key pair generation failed:', error);
      throw error;
    }
  }


export async function CompareToHash(_data, existingHash) {
    // hash data input
    let hashedInput = await HashDataSHA256(_data);
    let hashTest = (hashedInput === existingHash);

    // console debugging
    /*     console.log("CompareToHash:\nNew: " + hashedInput +
        "\nExisting: " + existingHash +
        "\nComparison result: " + hashTest); */

    // compare hash values, return bool
    return (hashTest);
}

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
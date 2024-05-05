import React from "react";
import { useState, useEffect } from "react";

export async function Encrypt(message, publicKeyBase64){
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

// test comment, to be deleted

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
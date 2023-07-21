import { useState } from 'react';
import * as secp from 'ethereum-cryptography/secp256k1.js';
import server from './server.js';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils.js';
import { sign } from 'ethereum-cryptography/secp256k1';

function hashMessage (message) {
  return keccak256(utf8ToBytes(JSON.stringify(message)));
}

function getAddress (publicKey) {
  return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

function checkPrivateKey (privateKey) {
  return privateKey.length === 64;
}

export const useWallet = () => {
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();
  const [privateKey, setPrivateKey] = useState();

  const connectWallet = async (privateKey) => {
    if (checkPrivateKey(privateKey)) {
      const publicKey = secp.getPublicKey(privateKey);
      const address = getAddress(publicKey);
      const { data: { balance }, } = await server.get(`balance/0x${address}`);
      setPrivateKey(privateKey);
      setAddress(address);
      setBalance(balance);
    } else {
      setPrivateKey(null);
      setAddress(null);
      setBalance(null);
    }
  };

  const signMessage = async (message) => {
    const [signature, recoveryBit] = await sign(hashMessage(message), privateKey, { recovered: true });
    return [toHex(signature), recoveryBit];
  };

  const sendMessage = async (message, signature, recoveryBit) => {
    const { data: { balance }, } = await server.post(`send`, {
      message,
      signature,
      recoveryBit
    });
    setBalance(balance);
  };
  return {
    connectWallet,
    signMessage,
    sendMessage,
    address,
    balance,
  };
};
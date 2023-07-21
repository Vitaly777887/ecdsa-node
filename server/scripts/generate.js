const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

function getAddress (publicKey) {
  return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);
const address = getAddress(publicKey);

console.log(`'0x${address}': 100 // ${toHex(privateKey)}`);

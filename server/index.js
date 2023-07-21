const express = require('express');
const app = express();
const cors = require('cors');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils');
const { recoverPublicKey } = require('ethereum-cryptography/secp256k1');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  '0x65a296d22c7eb8f676c0f8a10df6314235ecfb3f': 100, // 99cd8985f5d3dc53784b5c3a3d44cd02c1f8f6caaf14077a5756d6c6abfd9efc
  '0x66c818661c9dd3d342d5177f3327fece92561aa4': 100, // d466740f1498690ca36c1f66b57571c50d2741f7d0ca0b0e956eabea3a76f4dc
  '0x9a8c8146b166e4110dc664066219a27eea366449': 100  // d180313a60c656a59229cf1045f355fe5027caff5c479326556dc37e02f5bab0

};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { message, signature, recoveryBit } = req.body;
  const { amount, recipient } = message;

  const sender = getSender(message, signature, recoveryBit);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (!sender) {
    res.status(401).send({ message: 'The authentication failed' });
    return;
  }
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance (address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getSender (message, signature, recoveryBit) {
  try {
    const publicKey = recoverPublicKey(hashMessage(message), signature, recoveryBit)
    return '0x' + getAddress(publicKey);
  } catch (error) {
    return null;
  }
}

function getAddress (publicKey) {
  return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

function hashMessage (message) {
  return keccak256(utf8ToBytes(JSON.stringify(message)));
}

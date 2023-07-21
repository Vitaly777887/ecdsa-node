function Wallet ({ balance, address, connectWallet }) {
  const handleChange = (evt) => connectWallet(evt.target.value);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        PrivateKey
        <input placeholder="Type your private key" onChange={handleChange}></input>
      </label>
      <div className="balance">Address: {address ? ('0x' + address) : ' - '}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

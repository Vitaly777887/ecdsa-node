import Wallet from './Wallet';
import Transfer from './Transfer';
import './App.scss';
import { useWallet } from './useWallet.js';

function App () {
  const { address, balance, signMessage, connectWallet, sendMessage } = useWallet();

  return (
    <div className="app">
      <Wallet
        balance={balance}
        address={address}
        connectWallet={connectWallet}
      />
      <Transfer
        signMessage={signMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default App;

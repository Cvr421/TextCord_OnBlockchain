import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import abis from './abis/TextCord.json'

// Config
import config from './config.json';

// Socket
const socket = io('ws://localhost:3030');

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [textcord, setTextCord] = useState(null);
  const loadBlockchainData = async () => {
    // This provider connect this app to ethereum blockchain through metamask 
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
   // getting network 
    const network = await provider.getNetwork()
    // Getting contract address and abis and provider
    const textcord = new ethers.Contract(config[network.chainId].TextCord.address, abis, provider)

    setTextCord(textcord);
 console.log(textcord.address)

 const channel =await textcord.getChannel(2)
 console.log(channel)

    window.ethereum.on('accountsChanged', async () => {
      window.location.reload()
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])


  return (
    <div>
      < Navigation account={account} setAccount={setAccount} />
      <main>

      </main>
    </div>
  );
}

export default App;

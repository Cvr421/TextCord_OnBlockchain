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
  const [channels, setChannels] = useState([])
  const [currentChannel,setCurrentChannel]=useState(null)
  const [messages,setMessages]=useState([])

  const loadBlockchainData = async () => {
    // This provider connect this app to ethereum blockchain through metamask 
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    // getting network 
    const network = await provider.getNetwork()
    // Getting contract address and abis and provider
    const textcord = new ethers.Contract(config[network.chainId].TextCord.address, abis, provider)

    setTextCord(textcord);
    // console.log(textcord.address)

    // const channel = await textcord.getChannel(2)
    // console.log(channel)
    const totalChannels = await textcord.totalChannels()
    const channelss = []

    for (var i = 1; i <= totalChannels; i++) {
      const channel = await textcord.getChannel(i)
      channelss.push(channel);
    }
    setChannels(channelss);
    // console.log(channelss);



    window.ethereum.on('accountsChanged', async () => {
      window.location.reload()
    })
  }

  useEffect(() => {
    loadBlockchainData()


socket.on("connect",()=>{
  socket.emit('get messages')
})
socket.on("new message",(messages)=>{
 setMessages(messages)
})

socket.on("get messages",(messages)=>{
  setMessages(messages)
})

return()=>{
  socket.off('conect')
  socket.off('new messages')
  socket.off ('get messages')
}

  }, [])


  return (
    <div>
      < Navigation account={account} setAccount={setAccount} />
      <main>
        < Servers />
        <Channels 
        provider={provider}
        account={account}
        textcord={textcord}
        channels={channels}
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        />
        <Messages account={account} messages={messages} currentChannel={currentChannel}/>
      </main>
    </div>
  );
}

export default App;

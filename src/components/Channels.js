const Channels = ({ provider, account, textcord, channels, currentChannel, setCurrentChannel }) => {

 const channelHandler=async(channel)=>{
 const hasJoined=await textcord.hasJoined(channel.id,account)

  if(hasJoined){
    console.log("joined...")
  }else{
    const signer=await provider.getSigner()
    const transaction=await textcord.connect(signer).mint(channel.id,{value: channel.cost})
    await transaction.wait()
  }
 }
  


  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>

        <ul>
          {channels.map((channel, index) => (
            <li
              key={index}
              onClick={() => channelHandler(channel)}
            >
              {channel.name}
            </li>
          ))}
        </ul>





      </div>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Channels;
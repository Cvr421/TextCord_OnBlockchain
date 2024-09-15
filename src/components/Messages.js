import { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client"

// Assets
import person from '../assets/person.svg'
import send from '../assets/send.svg'

// Socket
const socket = io('ws://localhost:3030')

const Messages = ({ account, messages, currentChannel }) => {

const messageEndRef=useRef(null)


  return (
    <div className="text">
      <div className="messages">

        {currentChannel && messages.filter(message => message.channel === currentChannel.id.toString()).map((message, index) => (
          <div className="message" key={index}>
            <img src={person} alt="Person" />
            <div className="message_content">
              <h3>{message.account.slice(0, 6) + '...' + message.account.slice(38, 42)}</h3>
              <p>
                {message.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}/>

      </div>


    </div>
  );
}

export default Messages;
import React from 'react'
import './chat-area.css';
import Style from 'style-it';

import Chat from './Chat/Chat/Chat';

export default function ChatArea(props) {
  return Style.it(`
    .chat-area{
      background-color: ${props.theme[1]};
    }
    .close-btn{
      background: ${props.theme[4]};
    }
    #close-icon{
      filter:${props.theme[5]};
    }
  `,
    <div className='chat-area'>
      <button onClick={()=> props.setComm(0)} id='close-chat-btn' className='close-btn'><img id='close-icon' src='/icons/cancel.png' alt='img'/></button>
      <Chat {...props}/>
    </div>
  )
}

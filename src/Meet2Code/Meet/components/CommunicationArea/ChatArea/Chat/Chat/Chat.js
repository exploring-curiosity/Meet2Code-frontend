import React from 'react';
import './chat.css';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
const Chat = (props) => {
    return ( 
            <div className='chat'>
                <Messages {...props} id={props.id} messages={props.messages}/>
                <Input {...props}/>
            </div>
    );
}
 
export default Chat;
import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import './messages.css';
import Message from '../Message/Message';
const Messages = (props) => {
    return (  
        <ScrollToBottom className='messageArea' behaviour='smooth'>
            {props.messages.map((message,i)=><div key={i} className='msgspan'><Message {...props} Uid={props.id} message={message}/></div>)}
        </ScrollToBottom>
    );
}
export default Messages;
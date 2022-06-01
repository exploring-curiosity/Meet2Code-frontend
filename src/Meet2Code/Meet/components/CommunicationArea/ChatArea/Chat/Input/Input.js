import React from 'react';
import './input.css';
import Style from 'style-it';
const Input = (props) => {
    return Style.it(`
        .input{
            color:${props.theme[3]};
            border-bottom:2px solid ${props.theme[2]};
        }
        ::-webkit-input-placeholder {
            color: ${props.theme[4]};
        }
        .sendbutton{
            color:${props.theme[3]};
            background:${props.theme[4]};
        }
    `,  
        <form className='form'>
            <input className='input' type='text' value={props.message} onChange={(e)=>props.setMessage(e.target.value)} placeholder='Enter message here' onKeyPress={(e) => e.key === 'Enter'?props.sendMessage(e):null} />
            <button className='sendbutton' onClick={(e)=>props.sendMessage(e,props.message,props.socket,props.id,props.name,props.room,props.setMessage)}>SEND</button>
        </form>
    );
}
 
export default Input;
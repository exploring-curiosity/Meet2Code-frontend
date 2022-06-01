import React from 'react';
import './message.css';
import Style from 'style-it';
const Message = (props) => {
    let isSentByCurrentUser = false;
    if(props.message.id === props.Uid)
    {
        isSentByCurrentUser = true;
    }
    return Style.it(`
        .background-sent{
            background-color:${props.theme[2]};
            color:${props.theme[3]};
        }
        .senttext{
            color:${props.theme[4]};
        }
    `,  
        isSentByCurrentUser
        ?(
            <div className='message justifyEnd'>
                <p className='senttext pr'>You</p>
                <div className="messageBox background-sent">
                    <p className='msgtext'>{props.message.text}</p>
                </div>
            </div>
        )
        :(
            <div className='message'>
                <div className="messageBox background-sent">
                    <p className='msgtext'>{props.message.text}</p>
                </div>
                <p className='senttext'>{props.message.user}</p>
            </div>
        )
    );
}
 
export default Message;
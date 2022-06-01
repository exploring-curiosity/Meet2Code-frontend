import React, { useState } from 'react';
import './invite-modal.css';
import Style from 'style-it';
import copy from 'copy-to-clipboard';
export default function InviteModal(props) {
  let [c,setC] = useState(0);
  return Style.it(`
    .modal-class-invite{
      background-color:${props.theme[0]};
      border:1px solid ${props.theme[4]};
    }
    .invite-text{
      color:${props.theme[3]};
    }
    .button-group-invite button{
      color:${props.theme[3]};
      background-color:${props.theme[4]};
    }
    .modal-class-invite span{
      color:${props.theme[3]};
    }
  `,
    <div className='modal-class-invite'>
      <input className='invite-text' readOnly={true} value={props.room}/>
      <div className='button-group-invite'>
        <button onClick={()=>{props.setShowInviteModal(0);setC(0)}}>Close</button>
        <button onClick={()=>{copy(props.room);setC(1)}}>Copy</button>
      </div>
      {
        c ? <span>Copied!!</span> : <span>Click Copy :)</span>
      }
    </div>
  )
}

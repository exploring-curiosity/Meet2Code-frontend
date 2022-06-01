import React from 'react';
import './participant-area.css';
import Style from 'style-it';
import Participant from './Participants/Participant';


export default function ParticipantArea(props) {
  return Style.it(`
  .participant-area{
    background-color: ${props.theme[1]};
  }
  .close-btn{
    background: ${props.theme[4]};
  }
  #close-icon{
    filter:${props.theme[5]};
  }
`,
    <div className='participant-area'>
      <button onClick={()=> props.setComm(0)} id='close-participant-btn' className='close-btn'><img id='close-icon' src='/icons/cancel.png' alt='img'/></button>
      <Participant {...props}/>
    </div>
  )
}

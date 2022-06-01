import React from 'react';
import './white-board-area.css';
import Style from 'style-it';
import WhiteBoard from './WhiteBoard/WhiteBoard';
export default function WhiteBoardArea(props) {
  return Style.it(`
  .white-board-area{
    background-color: ${props.theme[1]};
  }
`,
    <div className='white-board-area'>
      <WhiteBoard {...props}/>
    </div>
  )
}

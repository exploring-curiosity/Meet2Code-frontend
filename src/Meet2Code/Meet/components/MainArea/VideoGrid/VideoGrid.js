import React from 'react';
import './video-grid.css';
import Style from 'style-it';
import VC from '../../CommunicationArea/VideoArea/VideoCall/vc-component';

export default function VideoGrid(props) {
  return Style.it(`
  .video-grid{
    background-color: ${props.theme[1]};
  }
`,
    <div className='video-grid'>
      <VC {...props}/>
    </div>
  )
}

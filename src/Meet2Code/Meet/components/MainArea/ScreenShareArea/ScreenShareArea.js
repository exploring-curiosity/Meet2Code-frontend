import React, { useEffect } from 'react';
import './screen-share-area.css';
import Style from 'style-it';
export default function ScreenShareArea(props) {
  useEffect(()=>{
    const videoContainer = document.getElementById('screen-share-panel');
    const videoGrid = document.getElementById('screen-loader');
    videoContainer.appendChild(videoGrid);
    return()=>{
        const meetApp = document.getElementById('meet-app');
        meetApp.appendChild(videoGrid);
    }
  },[])
  return Style.it(`
  .screen-share-area{
    background-color: ${props.theme[1]};
  }
`,
    <div className='screen-share-area' id='screen-share-panel'>
    </div>
  )
}

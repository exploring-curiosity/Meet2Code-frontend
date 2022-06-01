import React from 'react';
import './main-area.css';
import Style from 'style-it';

import CodeArea from './CodeArea/CodeArea';
import DocsArea from './DocsArea/DocsArea';
import ScreenShareArea from './ScreenShareArea/ScreenShareArea';
import VideoGrid from './VideoGrid/VideoGrid';
import WhiteBoardArea from './WhiteBoardArea/WhiteBoardArea';
export default function MainArea(props) {
  return Style.it(`
    .main-area{
      background-color:${props.theme[1]};
    }
  `,
    <div className={`main-area ${props.className}`}>
      {
        props.tabs === 1 ? (<CodeArea {...props}/>) : props.tabs === 2 ? (<DocsArea {...props}/>) : props.tabs === 3 ? (<WhiteBoardArea {...props}/>) : props.tabs === 4 ? (<ScreenShareArea {...props}/>) : (<VideoGrid {...props}/>) 
      }
    </div>
  )
}

import React, { useEffect } from 'react';
import './vc.css';

export default function VC(props) {
    useEffect(()=>{
        const videoContainer = document.getElementById(props.show===1?'video-container':props.show===2?'video-grid-block':'not-display');
        const videoGrid = document.getElementById('video-loader');
    
        videoContainer.appendChild(videoGrid);
        return()=>{
            const meetApp = document.getElementById('meet-app');
            meetApp.appendChild(videoGrid);
        }
    },[props.show])
    return(<div id={props.show===1?'video-container':props.show===2?'video-grid-block':'not-display'}></div>);
}

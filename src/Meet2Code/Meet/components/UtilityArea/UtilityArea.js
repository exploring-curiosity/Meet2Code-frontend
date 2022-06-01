import React from 'react';
import './utility-area.css';
import Style from 'style-it';
import {savePDF} from '../../Modules/DocEditor/pdfDownloader';
import {clearCanvas} from '../../Modules/WhiteBoard/draw';
import {saveCanvas} from '../../Modules/WhiteBoard/canvasDownloader';
import {toggleAudio,toggleVideo} from '../../Modules/VideoCall/vc';
export default function UtilityArea(props) {
  const handleDownload=(e) =>{
    e.preventDefault();
    if(props.tabs===2)
    savePDF();
    if(props.tabs===3)
    saveCanvas();
  }
  const handleRefresh = (e) =>{
    e.preventDefault();
    if(props.tabs===3)
    clearCanvas(props.socket,props.ctx,props.room);
  }
  
  return Style.it(`
    .utility-panel{
      background-color:${props.theme[1]};
    }
    .screen-btn:hover{
      background-color:${props.theme[4]};
    }
    .cam-btn:hover{
      background-color:${props.theme[4]};
    }
    .mic-btn:hover{
      background-color: ${props.theme[4]};
    }
    .end-btn:hover{
      background-color: ${props.theme[4]};
    }
    .download-btn:hover{
      background-color: ${props.theme[4]};
    }
    .clear-btn:hover{
      background-color: ${props.theme[4]};
    }
    .invite-btn:hover{
      background-color: ${props.theme[4]};
    }
    #screen-icon{
      filter:${props.theme[5]};
    }
    #cam-icon{
      filter:${props.theme[5]};
    }
    #mic-icon{
      filter:${props.theme[5]};
    }
    #download-icon{
      filter:${props.theme[5]};
    }
    #clear-icon{
      filter:${props.theme[5]};
    }
    #invite-icon{
      filter:${props.theme[5]};
    }
  `,
    <div className='utility-area' view={props.view}>
      <div className='utility-panel'>
        <button className='screen-btn' onClick={()=>{
          if(props.screenShare === 1){
            // props.stopShare();
            props.setScreenShare(0);}
          else {
            props.ShareScreen();
            props.setScreenShare(1);}
        }}>
          {
            props.screenShare === 0 ? <img id='screen-icon' src='/icons/screen.png' alt='img'/> : <img id='screen-icon' src='/icons/stop-screen.png' alt='img'/>
          }
        </button>
        <button className='cam-btn' onClick={()=>{
          props.setVideoState(!props.videoState);
          toggleVideo(props.socket,props.myPeer,props.room);
        }}>
          {
            props.videoState ? <img id='cam-icon' src='/icons/video-camera.png' alt='img'/> : <img id='cam-icon' src='/icons/no-video.png' alt='img'/>
          }
        </button>
        <button className='mic-btn' onClick={()=>{
          props.setAudioState(!props.audioState);
          toggleAudio(props.socket,props.myPeer,props.room);
        }}>
          {
            props.audioState ? <img id='mic-icon' src='/icons/microphone.png' alt='img'/> : <img id='mic-icon' src='/icons/mute.png' alt='img'/>
          }
        </button>
        <button className='end-btn' onClick={(e)=>props.leaveMeet(e,props.socket,props.user._id)}>
          <img id='end-icon' src='/icons/phone-call-end.png' alt='img'/>
        </button>
        <button className='download-btn' onClick={handleDownload}>
          <img id='download-icon' src='/icons/download.png' alt='img'/>
        </button>
        <button className='clear-btn' onClick={handleRefresh}>
          <img id='clear-icon' src='/icons/recycle.png' alt='img'/>
        </button>
        <button className='invite-btn' onClick={()=>props.setShowInviteModal(1)}>
          <img id='invite-icon' src='/icons/invite.png' alt='img'/>
        </button>
      </div>
    </div>
  )
}

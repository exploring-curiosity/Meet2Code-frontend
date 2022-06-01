import React from 'react'
import './title-area.css';
import Style from 'style-it';

export default function TitleArea(props) {
  return Style.it(`
            .left-tool-tip{
                background-color: ${props.theme[1]};
                color:${props.theme[3]};
            }
            .right-tool-tip{
                background-color: ${props.theme[1]};
                color:${props.theme[3]};
            }
            .room-title{
                color:${props.theme[3]};
            }
        `,
        <div className='title-area' view={props.view}>
            <div className='left-tool-tip' view={props.view} hovering={props.tabTooltip} >
                {
                    props.tabTooltip === 1? (<span>Code Editor</span>) : props.tabTooltip === 2 ? (<span>Document</span>) : props.tabTooltip === 3? (<span>White Board</span>) : props.tabTooltip === 4 ? (<span>Screen Share</span>) : (<span></span>)
                }
            </div>
            <h1 className='room-title'>{props.roomName}</h1>
            <div className='right-tool-tip' view={props.view} hovering={props.commTooltip} >
                {
                    props.commTooltip === 1? (<span>Chat</span>) : props.commTooltip === 2 ? (<span>Participants</span>) : props.commTooltip === 3? (<span>Video Call</span>) :<span></span>
                }
            </div>
        </div>
    );
}

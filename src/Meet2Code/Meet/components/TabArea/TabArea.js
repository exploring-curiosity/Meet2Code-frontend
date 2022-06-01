import React from 'react';
import './tab-area.css';
import Style from'style-it';
 
export default function TabArea(props) {
  return Style.it(`
    .tab-area{
      background-color: ${props.theme[1]};
    }
    .code-btn:hover{
      background-color: ${props.theme[4]};
    }
    .docs-btn:hover{
      background-color: ${props.theme[4]};
    }
    .board-btn:hover{
      background-color: ${props.theme[4]};
    }
    .share-btn:hover{
      background-color: ${props.theme[4]};
    }
    .code-btn[tabs='1']{
      background-color: ${props.theme[4]};
    }
    
    .docs-btn[tabs='2']{
      background-color: ${props.theme[4]};
    }
    
    .board-btn[tabs='3']{
      background-color: ${props.theme[4]};
    }
    
    .share-btn[tabs='4']{
      background-color: ${props.theme[4]};
    }
    #code-icon{
      filter:${props.theme[5]};
    }
    #docs-icon{
      filter:${props.theme[5]};
    }
    #share-icon{
      filter:${props.theme[5]};
    }
    #board-icon{
      filter:${props.theme[5]};
    }
  `,
    <div className='tab-area' view={props.view}>
      <button tabs={props.tabs} onClick={()=>props.setTabs(1)} onMouseEnter={()=>props.setTabTooltip(1)} onMouseLeave={()=>props.setTabTooltip(0)} className='code-btn'>
        <img id='code-icon' src='/icons/code.png' alt='img'/>
      </button>
      <button tabs={props.tabs} onClick={()=>props.setTabs(2)} onMouseEnter={()=>props.setTabTooltip(2)} onMouseLeave={()=>props.setTabTooltip(0)} className='docs-btn'>
        <img id='docs-icon' src='/icons/document.png' alt='img'/>
      </button>
      <button tabs={props.tabs} onClick={()=>props.setTabs(3)} onMouseEnter={()=>props.setTabTooltip(3)} onMouseLeave={()=>props.setTabTooltip(0)} className='board-btn'>
        <img id='board-icon' src='/icons/white-board.png' alt='img'/>
      </button>
      <button tabs={props.tabs} onClick={()=>props.setTabs(4)} onMouseEnter={()=>props.setTabTooltip(4)} onMouseLeave={()=>props.setTabTooltip(0)} className='share-btn'>
        <img id='share-icon' src='/icons/share.png' alt='img'/>
      </button>
        
    </div>
  )
}

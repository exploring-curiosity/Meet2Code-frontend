
import React from 'react';

import './code-area.css';
import Style from 'style-it';
import CodeEditor from './CodeEditor/CodeEditor';
import Terminal from './Terminal/Terminal';
import Question from './Questions/Question';


export default function CodeArea(props) {
  return Style.it(`
    .code-area{
      background-color: ${props.theme[1]};
    }

    .editorProperties{
        background-color : ${props.theme[0]}
    }

    .tabOptionDisplay{
        cursor : pointer;
    }
    .question-container{
      color:${props.theme[3]};
      background-color:${props.theme[2]};
    }
    .question-container img{
      filter:${props.theme[6]};
    }
  `,
    <div className='code-area'>
      <CodeEditor {...props}/>
      <Question {...props}/>
      <Terminal {...props}/>
    </div>
  )
}

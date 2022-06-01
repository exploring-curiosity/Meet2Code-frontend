import React from 'react';
import './docs-area.css';
import Style from 'style-it';
import TextEditor from './TextEditor/TextEditor';
export default function DocsArea(props) {
  return Style.it(`
  .docs-area{
    background-color: ${props.theme[1]};
  }
  .ql-editor{
    color: ${props.theme[3]};
    background-color: ${props.theme[2]};
  }
  .docs-container .ql-toolbar.ql-snow{
    background-color:${props.theme[2]};
  }
  .ql-picker-label{
    color:${props.theme[4]};
  }
  .docs-container svg{
    filter: ${props.theme[6]};
  }
`,
    <div className='docs-area'>
      <TextEditor {...props}/>
    </div>
  )
}

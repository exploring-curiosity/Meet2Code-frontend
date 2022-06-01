import React from 'react';
import './text-editor.css';
import Style from 'style-it';

export default function TextEditor(props) {
  return Style.it(`
  
  `,
    <div className="docs-container" ref={props.wrapperRef}>
    </div>
  )
}

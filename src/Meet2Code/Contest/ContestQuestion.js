import React from 'react'
import '../Meet/components/MainArea/CodeArea/Questions/question.css';
import { useEffect } from 'react';
import Style from 'style-it';
// import { MathComponent } from 'mathjax-react';

export default function Question(props) {

  useEffect(()=>{

    let question = document.getElementsByClassName('question-container');
    if(question.length > 0)
    { 
      question = question[0]
      question.innerHTML = props.questionsHtml[props.currentTab]
    }

  },[props.currentTab, props.questionsHtml]);

  return Style.it(`
    .question-container{
      color:${props.theme[3]};
      background-color:${props.theme[2]};
    }
  `,
    <div className='question-container'>
        {/* {props.questionText !== "" ?
            <MathComponent tex={props.questionText}/> :
            ""
        } */}
    </div>
  )
}

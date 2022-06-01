import React from 'react';
import './code-editor.css';
import { useState, useEffect } from 'react'

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import * as monaco from 'monaco-editor'
import serverEndpoint from '../../../../../config';
import Style from 'style-it';

let editor;

export default function CodeEditor(props) {
    
    const [Qpop,setQpop] = useState(false);
    useEffect(()=>{

        let docEditor = document.getElementById("monaco-editor")
        
        if(!docEditor) return;
        docEditor.innerHTML = ""
    
        const ydocument = new Y.Doc()
    
        const provider = new WebsocketProvider('wss://demos.yjs.dev/', props.room + ":" + props.currentTab, ydocument)
        console.log(provider)
        const type = ydocument.getText('monaco')
    
        editor = monaco.editor.create(document.getElementById('monaco-editor' ), {
          value: '', // MonacoBinding overwrites this value with the content of type
          language: props.codeTabs[props.currentTab]['language'],
          theme : props.codeTabs[props.currentTab]['theme'],
          quickSuggestions: {
            "other": true,
            "comments": true,
            "strings": true
        },
          parameterHints: {
              enabled: true
          },
          ordBasedSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          wordBasedSuggestions: true
        })
    
    
        // Bind Yjs to the editor model
        const monacoBinding = new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness)
        console.log(monacoBinding.doc, editor.getValue())
    
        return ()=>{
            monaco.editor.getModels().forEach(model => model.dispose());
        }
      },[props.roomId, props.currentTab, props.codeTabs,props.room])
      useEffect(()=>{

        let api_fetch = async () => {
  
          let questions = await fetch(serverEndpoint + '/codeforces/questions?tags=' + props.tag);
          questions = await questions.json()
          props.setModalQuestions(questions['questions']['result']['problems']);
        }
  
        api_fetch()
        // eslint-disable-next-line
    },[props.tag]);
  
    //Change the current tab to point to tabId
    let changeTab=(tabId)=>{
        props.setCurrentTab(tabId)
    }
  
    // let closeTab=(tabId)=>{
  
    //     let curLen = props.tabLen, curList = [...props.codeTabs]
    //     curList.splice(curList.indexOf(tabId),1)
  
    //     if(curList.length === 0)
    //     {
    //       curList.push(curLen);
    //       props.setCurrentTab(curLen);
    //       props.setTablen(curLen+1)
    //     }
    //     props.setCodeTabs(curList)
    //     if(tabId === props.currentTab)
    //     { 
    //         props.setCurrentTab(curList[0])
    //     }
  
    // }
  
    let changeEditor=(language,theme)=>{
  
      let newObj = {}
      if(language !== undefined)
      {
        newObj = {
          'language' : language,
          'theme' : props.codeTabs[props.currentTab]['theme']
        }
      }
  
      else if(theme !== undefined)
      {
        newObj = {
          'language' : props.codeTabs[props.currentTab]['language'],
          'theme' : theme
        }
      }
  
      let tabsCopy = [...props.codeTabs]
      tabsCopy[props.currentTab] = newObj
      props.setCodeTabs(tabsCopy)
    }
  
    let setQuestion = (question) => {
  
      let curTabs = [...props.codeTabs]
      curTabs[props.currentTab]['question'] = question
      props.setCodeTabs(curTabs)
  
      console.log(question)
      props.setQuestion(question)
  
    }
    return Style.it(`
        .tab{
            background-color:${props.theme[2]};
        }
        .tab-content span{
            color:${props.theme[3]};
        }
        .dropdown-language{
            background-color:${props.theme[2]};
            color:${props.theme[3]};  
        }
        .dropdown-menu-language{
            background-color:${props.theme[2]};
            color:${props.theme[3]};
        }
        .dropdown-language:hover{
            background-color:${props.theme[4]};
        }
        .dropdown-theme{
            background-color:${props.theme[2]};
            color:${props.theme[3]};  
        }
        .dropdown-menu-theme{
            background-color:${props.theme[2]};
            color:${props.theme[3]};
        }
        .dropdown-theme:hover{
            background-color:${props.theme[4]};
        }
        .dropdown-item:hover{
            background-color:${props.theme[4]};
            cursor:pointer;
        }
        .question-picker{

            background-color:${props.theme[2]};
            color:${props.theme[3]};  
        }
        .question-picker:hover{
            background-color:${props.theme[4]};
            color:${props.theme[3]};  
        }
        .modal-dialog{
            background-color:${props.theme[2]};
        }
        .dropdown-category:hover{
            background-color:${props.theme[4]};
        }
    `,
        <div className='code-editor-container'>
            <div className='tabs-bar'>
                {
                    props.codeTabs.map((tab, index)=>
                    {
                        let stl = {} 
                        if(index === props.currentTab)
                        {
                            stl = {backgroundColor:props.theme[4]}
                        }
                        return(
                        <div key={index} className='tab'
                            onClick={()=>{changeTab(index)}} style={stl}>
                            <div className='tab-content' >
                                <span>Tab {index}</span>
                            </div>
                        </div>
                        )
                    })
                }
            </div>
            <div className='utility-bar'>
                <div className='dropdown-language' >
                    <span>
                        Language
                    </span>
                    <div className="dropdown-menu-language">
                        <div className="dropdown-item" onClick={()=>changeEditor("javascript", undefined)}>Javascript</div>
                        <div className="dropdown-item" onClick={()=>changeEditor("java", undefined)}>Java</div>
                        <div className="dropdown-item" onClick={()=>changeEditor("c", undefined)}>C</div>
                    </div>
                </div>

                <div className='question-picker'>
                    <div className='btn-primary' onClick={()=>setQpop(!Qpop)}>
                        <span>Choose a question</span>
                    </div>
                    <div className="modal-dialog" show={Qpop?1:0}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <strong>Select a question</strong>
                            </div>
                            <div className="modal-body">
                                <div className='dropdown-category'>
                                    <span>
                                       Category
                                    </span>
                                    <div className="dropdown-menu-category">
                                        <div className="dropdown-item" onClick={ () => props.setTag('2-sat')}>2-sat</div>
                                        <div className="dropdown-item" onClick={ () => props.setTag('fft')}>fft</div>
                                        <div className="dropdown-item" onClick={ () => props.setTag('implementation')}>implementation</div>
                                    </div>
                                </div>

                                <div className='question-list'>
                                    <ul>
                                    { props.modalQuestions.map(question => {
                                        return <li key={question['name']} className='question-item' style={{ "cursor" : "pointer" }} onClick = { () => {setQuestion(question);setQpop(!Qpop)} } >
                                                { question['name'] } : { question['rating']}
                                            </li>

                                    }) }
                                    </ul>
                                </div>
                            <div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dropdown-theme'>
                    <span>Theme</span>
                    <div className="dropdown-menu-theme">
                        <div className="dropdown-item" onClick={()=>changeEditor(undefined, "vs-dark")}>vs-dark</div>
                        <div className="dropdown-item" onClick={()=>changeEditor(undefined, "vs")}>vs</div>
                        <div className="dropdown-item" onClick={()=>changeEditor(undefined, "hc-black")}>hc-black</div>
                    </div>
                </div>

            </div>
            <div id="monaco-editor" className="monaco-editor">
            </div>
        </div>
    )
}


const returnData = () => {
    if(editor)
    {
      return editor.getValue()
    }
    else
    {
      return ""
    }
  }
  
  export {returnData}
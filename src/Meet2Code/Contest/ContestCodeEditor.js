import React from 'react';
import '../Meet/components/MainArea/CodeArea/CodeEditor/code-editor.css';
import './codearea.css';
import { useState, useEffect } from 'react'

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import * as monaco from 'monaco-editor'
import serverEndpoint from '../config';
import Style from 'style-it';

let editor;

export default function CodeEditor(props) {
    
    let [leaderboard, setLeaderBoard] = useState([]);

    useEffect(()=>{

        let docEditor = document.getElementById("monaco-editor-contest")
        
        if(!docEditor) return;
        docEditor.innerHTML = ""
    
        const ydocument = new Y.Doc()
    
        const provider = new WebsocketProvider('wss://demos.yjs.dev/', props.contestId + ":" + props.currentTab + ":" + props.user._id, ydocument)
        console.log(provider)
        const type = ydocument.getText('monaco')
    
        editor = monaco.editor.create(document.getElementById('monaco-editor-contest' ), {
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
    
      },[props.contestId, props.currentTab, props.codeTabs, props.user._id]);


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

    let toggleLeaderBoard = () => {
        let modal = document.querySelector("#leaderModal");
        modal.classList.toggle("show-modal");
    }

    let fetchLeaderBoard = async() => {

        let board = await fetch(serverEndpoint + '/leaderboard/' + props.contestId);
        board = await board.json();
        setLeaderBoard(board);
        console.log(board);
        toggleLeaderBoard();
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
        .leaderboard{

            background-color:${props.theme[2]};
            color:${props.theme[3]};  
        }
        .leaderboard:hover{
            background-color:${props.theme[4]};
            color:${props.theme[3]};  
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
                                <span>Question {index+1}</span>
                            </div>
                        </div>
                        )
                    })
                }
            </div>
            <div className='question-picker' onClick={() => fetchLeaderBoard() }>
                <span>
                    Leaderboard
                </span>
            </div>

            <div className='modalContest' id='leaderModal'>
                <div className='modal-content-create-contest'>
                    <span className="close-button" onClick={()=>toggleLeaderBoard()}>&times;</span>
                    <div className='contestListDisplay'>
                        <div className='contestListDisplayItem'>
                            Participant   -   Score
                        </div>
                        {
                            leaderboard.map((participant, index) => {
                                return  <div key={index} className='contestListDisplayItem'>
                                            {participant['user']}  -  {participant['score']}
                                        </div>
                            })
                        }
                    </div>
                </div>
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

                <div className='dropdown-theme'>
                    <span>Theme</span>
                    <div className="dropdown-menu-theme">
                        <div className="dropdown-item" onClick={()=>changeEditor(undefined, "vs-dark")}>vs-dark</div>
                        <div className="dropdown-item" onClick={()=>changeEditor(undefined, "vs")}>vs</div>
                        <div className="dropdown-item" onClick={()=>changeEditor(undefined, "hc-black")}>hc-black</div>
                    </div>
                </div>

            </div>
            <div id="monaco-editor-contest" className="monaco-editor">
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

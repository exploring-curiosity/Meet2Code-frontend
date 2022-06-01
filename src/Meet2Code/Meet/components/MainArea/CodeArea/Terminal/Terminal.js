import React from 'react';
import './terminal.css';
import axios from 'axios';
import { returnData } from '../CodeEditor/CodeEditor';
import Style from 'style-it';
import {serverEndpoint} from '../../../../../config';
export default function Terminal(props) {
    
    const createSubmisssion = async (userInput, expectedOutput, code) => {
    const bcode = btoa(JSON.parse(code))
    console.log(bcode)
    const binp = btoa(userInput)
    const expout = btoa(expectedOutput);

    // console.log(binp)

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'true', fields: '*' },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': 'b0b18fb8a5mshc14ae2dbf1dd753p1488bejsnd198d70f0ce1'
        },
    };
    options["data"] = {
        "language_id": 52, // C language
        "source_code": bcode,
        "stdin": binp
    }

    if (expectedOutput !== null && expectedOutput !== undefined) {
        options['data']['expected_output'] = expout
    }


    let outres = await axios.request(options)

    const subToken = outres.data["token"]
    // console.log(subToken)
    const inoptions = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/' + subToken,
        params: { base64_encoded: 'true', fields: '*' },
        headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': 'b0b18fb8a5mshc14ae2dbf1dd753p1488bejsnd198d70f0ce1'
        }
    };

    let res = await axios.request(inoptions)
    console.log(res.data)
    return res.data

}

const runCode = async() => {
    document.getElementById("code-output").value = '';
    const code = JSON.stringify(returnData())
    let contestId = props.question['contestId'], questionId = props.question['index']
    if(contestId === undefined && questionId === undefined)
    {   
        console.log("Question not found");
        return;
    }
    let testCases = await fetch(serverEndpoint + '/questionTestcases?contestId=' + contestId + '&questionId=' + questionId);
    testCases = await testCases.json();
    let passedtc = 0


    for (let index in testCases) {
        let res = await createSubmisssion(testCases[index].input, testCases[index].output, code)

        if(res!==undefined && res['status']['description']==='Accepted')
        {
            passedtc+=1
        }
    }
    console.log("PAssed: "+passedtc)
    window.alert("Passed " + passedtc+ " test cases :)")
}

const executeCode = async() => {
    document.getElementById("code-output").value = ''
    let bout = ''
    const userInput = document.getElementById("user-input").value
    const code = JSON.stringify(returnData())

    let res = await createSubmisssion(userInput, null, code)
    console.log(res);
    if (res["stdout"] == null) {
        bout = res["compile_output"]
    }
    else {
        bout = res["stdout"]
    }
    console.log("Bout", bout)
    const output = atob(bout)
    document.getElementById("code-output").value = output

}
  return Style.it(`
    .terminal-container{
      background-color:${props.theme[2]};
    }
    #user-input{
      color:${props.theme[3]};
      border: 1px solid ${props.theme[4]};
    }
    #user-input::placeholder{
      color:${props.theme[4]};
    }
    #code-output{
      color:${props.theme[3]};
      border: 1px solid ${props.theme[4]};
    }
    #code-output::placeholder{
      color:${props.theme[4]};
    }
    .user-console{
      color:${props.theme[3]};
    }
    .button-space button{
      background-color:${props.theme[4]};
      color:${props.theme[3]};
    }
  `,
    <div className='terminal-container'>
      <div className='user-console'>
        <div className="user-input">
          <label>Input</label>
          <textarea id="user-input" placeholder="Type your input here">
          </textarea>
        </div>
        <div className="code-output">
          <label>Compiler Ouput</label>
          <textarea id="code-output" readOnly>
          </textarea>
        </div>
      </div>
      <div className='button-space'>
        <button onClick={executeCode}>Test</button>
        <button onClick={runCode}>Submit</button>
      </div>
    </div>
  )
}

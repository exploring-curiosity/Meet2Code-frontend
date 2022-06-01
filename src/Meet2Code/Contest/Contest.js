import React from 'react';
import { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import Style from 'style-it';
import serverEndpoint from '../config';
import CodeArea from "./ContestCodeArea"

const Contest = (props) => {

    const [tabs, setTabs] = useState(1);
    let [question, setQuestion] = useState(undefined);
    let [questionText, setQuestionText] = useState("");

    let [codeTabs, setCodeTabs] = useState([
        {
          'theme' : 'vs',
          'language' : 'javascript',
          'question' : undefined
        },
        {
          'theme' : 'vs',
          'language' : 'javascript',
          'question' : undefined
        },
        {
          'theme' : 'vs',
          'language' : 'javascript',
          'question' : undefined
        },
        {
          'theme' : 'vs',
          'language' : 'javascript',
          'question' : undefined
        },
        {
          'theme' : 'vs',
          'language' : 'javascript',
          'question' : undefined
        }
    ]);
    let [tabLen, setTablen] = useState(4);
    let [currentTab, setCurrentTab] = useState(0);
    let [tag, setTag] = useState('2-sat');
    let [modalQuestions, setModalQuestions] = useState([]);
    let [contestQuestions, setContestQuestions] = useState([]);
    let [questionMeta, setQuestionMeta] = useState([]);

    let contestId = useParams()['id']
    useEffect(()=>{

        let fetch_questions = async () => {

            let contest = await fetch(serverEndpoint + '/contest/' + contestId);
            contest = await contest.json();

            let questionsHtml = [], questionMetaInfo = []
            for(let question of contest['questions'])
            {
                let [cid, pid] = question.split('/');
                questionMetaInfo.push({
                    'contestId' : cid,
                    'questionId' : pid
                });
                let questionHtml = await fetch( serverEndpoint + '/getProblem/?contest=' + cid + '&id=' + pid );
                questionHtml = await questionHtml.text()
                questionsHtml.push(questionHtml);
            }

            setContestQuestions(questionsHtml);
            setQuestionMeta(questionMetaInfo);
        }
        fetch_questions()

    },[contestId]);

    return Style.it(
        `
        .contest-area{
            background-color:${props.theme[0]};
            width : 100%;
            height : 100%;
        }
        `
        ,
            <div className='contest-area'>
                <CodeArea {...props} 
                contestId = {contestId}
                tabs={tabs}
                question={question}
                questionText={questionText}
                setQuestion={setQuestion}
                setQuestionText={setQuestionText}
                codeTabs={codeTabs}
                setCodeTabs={setCodeTabs}
                tabLen={tabLen}
                setTablen={setTablen}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                tag={tag}
                setTag={setTag}
                modalQuestions={modalQuestions}
                setModalQuestions={setModalQuestions}
                questionsHtml = {contestQuestions}
                questionMeta = {questionMeta}
                ></CodeArea>
            </div>
    )
}

export default Contest;
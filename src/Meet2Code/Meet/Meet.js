import React, { useEffect, useState, useCallback } from 'react'
import './meet.css';
import Style from 'style-it';
import { useParams } from 'react-router-dom';
import Quill from "quill";
import "quill/dist/quill.snow.css";
import io from 'socket.io-client';

import CommSwitch from './components/CommSwitch/CommSwitch';
import CommunicationArea from './components/CommunicationArea/CommunicationArea';
import MainArea from './components/MainArea/MainArea';
import TabArea from './components/TabArea/TabArea';
import TitleArea from './components/TitleArea/TitleArea';
import UtilityArea from './components/UtilityArea/UtilityArea';
import InviteModal from './components/InviteModal/InviteModal';
import {serverEndpoint} from '../config';

import { chatSocketListeners, chatStopListeners } from './Modules/Chat/Message';
import { participantsListener, stopParticipantsListener } from './Modules/Participants/UsersInRoom';
import {quillLoadDoc,quillUpdater,stopQuillListener} from './Modules/DocEditor/QuillListeners'
import {updateCanvasListener,stopCanvasListeners} from './Modules/WhiteBoard/draw';
import {leaveMeet} from './Modules/LeaveRoom/LeaveRoom';
import {CreatePeer} from './Modules/VideoCall/peer-init';

import {renderer} from './Modules/VideoCall/vc';

let myPeer;
let screenSocket;
let screenPeer;
let screenPeers={};
const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];
export default function Meet(props) {
    const [comm, setComm] = useState(1);
    const [tabs, setTabs] = useState(1);
    const [view, setView] = useState(1);
    const [prevTab, setPrevTab] = useState(1);
    const [commTooltip, setCommTooltip] = useState(0);
    const [tabTooltip, setTabTooltip] = useState(0);
    const [screenShare, setScreenShare] = useState(0);
    const [videoState, setVideoState] = useState(true);
    const [audioState, setAudioState] = useState(true);
    const [showInviteModal,setShowInviteModal] = useState(0);
    
    const [screenPeerId,setScreenPeerId] = useState('');
    const { id: roomID } = useParams()
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [ctx, setctx] = useState();
    const [timeout, settimeOut] = useState();
    const [image, setImage] = useState();
    const [quill, setQuill] = useState();
    const [roomName, setRoomName] = useState();
    const [clear, setClear] = useState(0);
    const [save, setSave] = useState(0);
    let [question, setQuestion] = useState(undefined);
    let [questionText, setQuestionText] = useState("");

    let [codeTabs, setCodeTabs] = useState([

        {
          'theme' : 'vs-dark',
          'language' : 'javascript',
          'question' : undefined
        },
        {
          'theme' : 'vs-dark',
          'language' : 'javascript',
          'question' : undefined
        },
        {
          'theme' : 'vs-dark',
          'language' : 'javascript',
          'question' : undefined
        }
        
    ]);
    let [tabLen, setTablen] = useState(4);
    let [currentTab, setCurrentTab] = useState(0);
    let [tag, setTag] = useState('2-sat');
    let [modalQuestions, setModalQuestions] = useState([]);

    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
        })
        q.disable()
        q.setText("Loading...")
        setQuill(q)
    }, []);

    

    useEffect(() => {
        const handleMouseEvent = (evt) => {
            const x = evt.clientX, y = evt.clientY;
            let l, w, t, h, Rect;
            let top = false,
                bottom = false,
                left = false,
                right = false;
            const titleBox = document.getElementById('title-space');
            const utilsBox = document.getElementById('utilities');
            const tabBox = document.getElementById('tab-switch');
            const commBox = document.getElementById('comm-switch');

            Rect = titleBox.getBoundingClientRect();
            l = Rect.left;
            w = l + Rect.width;
            t = Rect.top;
            h = t + Rect.height;
            if (x >= l && x <= w && y >= t && y <= h) top = true;

            Rect = utilsBox.getBoundingClientRect();
            l = Rect.left;
            w = l + Rect.width;
            t = Rect.top;
            h = t + Rect.height;
            if (x >= l && x <= w && y >= t && y <= h) bottom = true;

            Rect = tabBox.getBoundingClientRect();
            l = Rect.left;
            w = l + Rect.width;
            t = Rect.top;
            h = t + Rect.height;
            if (x >= l && x <= w && y >= t && y <= h) left = true;

            Rect = commBox.getBoundingClientRect();
            l = Rect.left;
            w = l + Rect.width;
            t = Rect.top;
            h = t + Rect.height;
            if (x >= l && x <= w && y >= t && y <= h) right = true;

            if (left || right || top || bottom) setView(1);
            else setView(0);
        };
        document.addEventListener('mousemove', handleMouseEvent);

        return () => {
            document.removeEventListener('mousemove', handleMouseEvent);
        }
    }, []);

    useEffect(() => {
        myPeer = CreatePeer();
        setRoom(roomID);
        let name = props.user.login;
        setName(name)
        let user = props.user;
        props.socket.emit('join', { roomID, user }, (roomName) => {
            setRoomName(roomName);
        });
        return () => {
            props.socket.off();
        }
    }, [roomID,props.user,props.socket]);

    useEffect(() => {
        chatSocketListeners(props.socket, setMessages, messages);
        return (() => {
            chatStopListeners(props.socket);
        })
    }, [messages, props.socket]);

    useEffect(() => {
        participantsListener(props.socket, usersInRoom, setUsersInRoom);
        return (() => {
            stopParticipantsListener(props.socket);
        })
    }, [usersInRoom, props.socket]);

    useEffect(() => {
        if (props.socket == null || quill == null) return;
        quillLoadDoc(props.socket,quill);
        props.socket.emit("get-document", room);
    }, [quill, room, props.socket])

    useEffect(() => {
        if (props.socket == null || quill == null) return;

        const interval = setInterval(() => {
            props.socket.emit("save-document", quill.getContents())
        }, SAVE_INTERVAL_MS);

        quillUpdater(props.socket,quill);
        
        const handler = (delta, oldDelta, source) => {
            if (source !== "user") return
            props.socket.emit("send-changes", delta)
        }
        quill.on("text-change", handler)

        return () => {
            clearInterval(interval);
            stopQuillListener(props.socket);
            quill.off("text-change", handler);
        }
    }, [quill, props.socket]);

    useEffect(()=>{
        updateCanvasListener(props.socket,ctx,setImage);
        return () =>{
            stopCanvasListeners(props.socket);
        } 
    },[ctx, props.socket]);
    useEffect(() => {

        let api_fetch = async () => {
            let ENDPOINT = serverEndpoint
            let resp = await fetch(ENDPOINT + '/getProblem?contest=' + question['contestId'] + '&id=' + question['index']);
            resp = await resp.text();
            setQuestionText(resp)
        }

        if (question !== undefined)
            api_fetch()

    }, [question])


    useEffect(()=>{
        if(room !=='' && name!=='' && myPeer !== undefined && myPeer !== null && props.socket!==undefined && props.socket !== null)
        {
            console.log(room,name);
            renderer(props.socket,myPeer, room, name,audioState,videoState);
        }
        //eslint-disable-next-line
    },[room,name]);

    function connectToNewUser(destId, stream,peer) 
    {
        // eslint-disable-next-line
        
        console.log("User Joined ",destId);
        const call = peer.call(destId, stream);
        screenPeers[destId] = call
        //console.log(peers)
    }

    

    const ShareScreen = () =>{
        let screenId;
        screenSocket = io(serverEndpoint);
        screenSocket.emit('screen-socket-join',room)
        screenSocket.once('screen-connected',()=>{
            screenPeer = CreatePeer();
            screenPeer.on('open', function(id) {
                console.log('Screen ID is: ' + id);
                setScreenPeerId(id);
                console.log(screenPeerId);
                screenId=id;
                console.log(screenId)
            });
        })
        navigator.mediaDevices.getDisplayMedia({cursor:true}).then(stream=>{
            screenPeer.on('call', call => {
                console.log('Call Screen');
                call.answer(stream);
                call.on('stream',(userStream)=>{
                    console.log('rcvd strm obj');
                })
            })
            setTimeout(()=>screenSocket.emit('sharing-screen',room,screenId,props.socket.id),1000);
            
            screenSocket.on('user-connected',(destId)=>{
                setTimeout(()=>connectToNewUser(destId,stream,screenPeer),1000);
            })

        })
        screenSocket.on('user-disconnected',(userId)=>{
            if (screenPeers[userId]) 
            {
                screenPeers[userId].close()
            }
        })
    }

    const stopShare = () => {
        screenSocket.off();
        for(const peer in screenPeers){
            screenPeers[peer].close();
        }
        screenSocket.emit('screen-disconnect',room,screenPeerId);
    }

    return Style.it(`
        .meet-app{
            background-color:${props.theme[0]};
        }
    `,
        <div className='meet-app' id='meet-app' view={view}>
            <div id='title-space' className='title-space'>
                <TitleArea 
                    {...props} 
                    view={view} 
                    roomName={roomName} 
                    commTooltip={commTooltip} 
                    tabTooltip={tabTooltip} 
                />
            </div>
            <div id='utilities' className='utilities'>
                <UtilityArea 
                    {...props} 
                    view={view} 
                    screenShare={screenShare} 
                    tabs={tabs}
                    ctx={ctx}
                    room={room}
                    setScreenShare={setScreenShare} 
                    videoState={videoState} 
                    setVideoState={setVideoState} 
                    audioState={audioState} 
                    setAudioState={setAudioState} 
                    setShowInviteModal={setShowInviteModal}
                    leaveMeet={leaveMeet}
                    myPeer={myPeer}
                    ShareScreen={ShareScreen}
                    stopShare={stopShare}
                />
            </div>
            <div id='tab-switch' className='tab-switch'>
                <TabArea 
                    {...props} 
                    view={view} 
                    tabs={tabs} 
                    setTabTooltip={setTabTooltip} 
                    setTabs={setTabs} 
                />
            </div>
            <div id='comm-switch' className='comm-switch'>
                <CommSwitch 
                    {...props} 
                    view={view} 
                    setCommTooltip={setCommTooltip} 
                    tabs={tabs} 
                    setComm={setComm}
                    comm={comm} 
                />
            </div>
            {
                comm !== 0 ? 
                (<div id='app-container' className='App-container'>
                    <MainArea 
                        {...props} 
                        save={save} 
                        setSave={setSave} 
                        clear={clear} 
                        setClear={setClear} 
                        room={room}
                        name={name} 
                        myPeer={myPeer}
                        image={image} 
                        ctx={ctx} 
                        setctx={setctx} 
                        timeout={timeout} 
                        settimeOut={settimeOut} 
                        wrapperRef={wrapperRef} 
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
                        show={comm === 3? 1: tabs ===0 ? 2:0}
                        className="half-size" 
                    /> 
                    <CommunicationArea 
                        {...props} 
                        users={usersInRoom} 
                        name={name} 
                        room={room} 
                        id={props.user._id} 
                        messages={messages} 
                        message={message} 
                        setMessage={setMessage} 
                        prevTab={prevTab} 
                        setPrevTab={setPrevTab} 
                        comm={comm} tabs={tabs} 
                        setComm={setComm} 
                        setTabs={setTabs}
                        myPeer={myPeer}
                        show={comm === 3? 1: tabs ===0 ? 2:0}
                    />
                </div>) : 
                (<div id='app-container' className='App-container'>
                    <MainArea  
                        {...props} 
                        save={save} 
                        setSave={setSave} 
                        clear={clear} 
                        setClear={setClear} 
                        room={room} 
                        image={image}  
                        ctx={ctx} 
                        setctx={setctx} 
                        timeout={timeout} 
                        settimeOut={settimeOut} 
                        wrapperRef={wrapperRef} 
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
                        show={comm === 3? 1: tabs ===0 ? 2:0}
                        className="full-size" 
                    />
                </div>)
            }
            <div className='invite-modal' show={showInviteModal}>
                <InviteModal 
                    {...props} 
                    room={room} 
                    setShowInviteModal={setShowInviteModal}
                />
            </div>
            <div id="video-loader"></div>
            <div id="screen-loader"></div>
        </div>
    )
}
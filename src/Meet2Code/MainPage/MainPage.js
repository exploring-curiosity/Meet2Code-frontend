import React from 'react';
import './main-page.css';
import Style from 'style-it';
import { useState, useEffect } from 'react';
import {serverEndpoint} from '../config';
import { useNavigate } from "react-router-dom";
import DateTimePicker from 'react-datetime-picker';

export default function MainPage(props) {

	let [ddst,setddst]=useState(false);
	let [prShowJoin,setprShowJoin]=useState(false);
	let [prShowCreate,setprShowCreate]=useState(false);
	let [joinShow,setJoinShow]=useState(false);
	let [createShow,setCreateShow]=useState(false);
    let [publicRooms, setPublicRooms] = useState([]);
    let [questions, setModalQuestions] = useState([]);
    let [contestTime, setContestTime] = useState(new Date()); 
    let [show,setShow]  = useState(false);
    let [contestList, setContestList] = useState([]);

    const [dispModal,setDispModal]=useState(0);
    let socket = props.socket;
    let navigate=useNavigate();


    useEffect(() => {
        const timeId = setTimeout(() => {
          if(show === true)
          {
            setShow(false);
            let notificationBar = document.getElementById('contestStartNotification')
            if(notificationBar !== undefined && notificationBar !== null)
            {
                notificationBar.classList.remove('contestStartNotificationOn');
                notificationBar.innerText = '';
            }

          }
        }, 5000)
    
        return () => {
          clearTimeout(timeId)
        }
      }, [show]);

    useEffect(()=>{

        socket.on('contestStarted',(contest)=>{

            //Display a light green notification at the top of the screen saying contest is on
            let notificationBar = document.getElementById('contestStartNotification')
            if(notificationBar !== undefined && notificationBar !== null)
            {
                notificationBar.classList.add('contestStartNotificationOn');
                notificationBar.innerText = 'Contest ' + contest['contest'] + 'has started';
                notificationBar.addEventListener("click",()=>{
                    navigate(`/contest/${contest['contestId']}`);
                })
                setShow(true);
            }
        })
        // eslint-disable-next-line
    },[socket]);

	useEffect(()=>{
		let doc=document.getElementById("profileDropdown-content")
		if(ddst===true)
			doc.style.display="block"
		else 
			doc.style.display="none"
	},[ddst]);

    useEffect(() => {

        let fetchPublicRooms = async () => {

            let publicRoomsRes = await fetch(serverEndpoint + '/publicRooms');
            publicRoomsRes  = await publicRoomsRes.json();
            setPublicRooms(publicRoomsRes);
        }
        fetchPublicRooms();

        //Get the list of questions from backend
        let api_fetch = async () => {

            let questions = await fetch(serverEndpoint + '/codeforces/questions?tags=2-sat');
            questions = await questions.json();
            setModalQuestions(questions['questions']['result']['problems']);
          }
          api_fetch();

        //Get the list of contests from backend
        let contest_fetch = async() => {

            let contests = await fetch(serverEndpoint + '/getContests');
            contests = await contests.json();
            setContestList(contests);
        }
        contest_fetch();

    },[]);


	let toggleDropDown=()=>{
        setddst(!ddst)
    }

    let logOutUser=()=>{
        props.logOutUser()
    }

	let showPwd=(type)=>{
        let option;
        if(type==="create")
            option=document.getElementById("mainPageCreateRoomFormType")
        else if(type==="join")
            option=document.getElementById("mainPageJoinRoomFormType")
        if(option!==undefined && option!==null){
            if(type==="create"){
                if(option.value==="private")
                    setprShowCreate(true);
                else
                    setprShowCreate(false);
            }
            else if(type==="join"){
                if(option.value==="private")
                    setprShowJoin(true);
                else
                    setprShowJoin(false);
            }
        }
    }

	
    let toggleOpen=(type)=>{
        if(type==="create"){
            let createForm=document.getElementById("create-room-box")
            if(createShow===true)
                createForm.style.height="4em"
            else
                createForm.style.height="30em"
            setCreateShow(!createShow)
        }
        else if(type==="join"){
            let joinForm=document.getElementById("join-room-box")
            let infoText=document.getElementById("info-text-join-room")
            if(infoText!==null){
                infoText.innerText=""
            }
            if(joinShow===true)
                joinForm.style.height="4em"
            else
                joinForm.style.height="30em"
            setJoinShow(!joinShow)
        }

    }

    //Join the already existing room.
    let joinExistingRoom=(id)=>{
        navigate(`/room/${id}`);
    }

    let leaveExistingRoom=()=>{
        props.socket.emit('leaveRoom',{host:props.user._id},(status)=>{
            let btnclose = document.getElementById('w-change-close');
            btnclose.click()
        })

    }
    //Leave the existing room.

    let createRoom=async(formData)=>{

        let body={}
        for(let pair of formData)
            body[`${pair[0]}`]=pair[1]


        props.socket.emit('createRoom',{...body, host:props.user._id},(roomId,status)=>{
            if(status===200 && roomId!==undefined && roomId!==null){
                navigate(`/room/${roomId}`);
            }
            else if(status===401){
                //User is already in a room.
                // var myModal = new bootstrap.Modal(document.getElementById('myModal'), options)
                // id="w-change-location" data-toggle="modal" data-target="#locModal"
                showModal(roomId)
            }
        })
    }

    //Join room
    let joinRoom=async(formData)=>{

        //Form validation pending
        let body={}
        for(let pair of formData)
            body[`${pair[0]}`]=pair[1]
        let infoText=document.getElementById("info-text-join-room")
        //Emit the details of the room and join the room.
        props.socket.emit('joinRoom',{...body,participant:props.user._id},(roomId,status)=>{
            
            if(status===401){
                //User is already in a room.
                showModal(roomId)
                return
            }
            //If the password given is wrong
            else if(status===403){

                if(infoText!==null){
                    infoText.innerText="Incorrect Password Provided"
                }
                return
            }
            //If room doesn't exist
            else if(status===404){
                if(infoText!==null){
                    infoText.innerText="Room Doesn't exist"
                }
            }

            //Successful join
            else if(status===200 && roomId!==undefined && roomId!==null){
                navigate(`/room/${roomId}`);
            }
        })

    }

    let showModal=(roomId)=>{
        
        var btnclose = document.getElementById('w-change-close');
        let rejoin=document.getElementById("reJoinRoom");
        let leave=document.getElementById("leaveJoinedRoom")

        setDispModal(1);
        rejoin.onclick=()=>{
            joinExistingRoom(roomId)
        }
        leave.onclick=()=>{
            leaveExistingRoom()
        }
        //hide the modal
        btnclose.addEventListener('click', (e) => {
            setDispModal(0);
        });
    }

    //Display modal if user is already in a room.
    let modalDisplay=()=>{
        return(
               <div className="modal-already-joined" disp={dispModal}>
                    <div className="inner-modal" id="loc-modal">
                        <div className="modal-text">
                            <h5 className="" id="locModalLabel">You've already joined a room.</h5>
                        </div>
                        <div className="modal-btn-container">
                            <button className="modal-rejoin-btn" id="reJoinRoom">Re-Join</button>
                            <button className="modal-leave-btn" id="leaveJoinedRoom">Leave</button>
                        </div>
                    </div>
                    <button id="w-change-close" type="button" className="modal-close-btn"><img id='modal-close-icon' src='/icons/cancel.png' alt='img'/></button>
               </div>
        )
    }

    let createContest = async() => {

        let host = props.user._id, startTime = contestTime
        let questions = [
                        document.getElementById('question 1').value,
                        document.getElementById('question 2').value,
                        document.getElementById('question 3').value,
                        document.getElementById('question 4').value,
                        document.getElementById('question 5').value
                    ]
        let size = await fetch(serverEndpoint + '/contestsSize');
        size = await size.json();
        let s = 1 + size['count']
        socket.emit('createContest',{host, startTime, questions, name:'Contest ' + s},()=>{

        });
        
    }

    let joinContest = (contest_id, db_id) => {

        socket.emit('joinContest',{contestId : contest_id, user : props.user, id : db_id},(status, code) => {

            if(code === 202 && status === 'running')
            {
                navigate('/contest/' + contest_id);
            }

        });

    }

    //Modal for creating a contest
    let toggleCreateContestModal = () => {

        let modal = document.querySelector(".modalContest");
        modal.classList.toggle("show-modal");
    }

    //Modal for joining a contest
    let toggleJoinContestModal = () => {

        let modal = document.querySelector("#joinModal");
        modal.classList.toggle("show-modal");

    }

    return Style.it(`
        .modal-rejoin-btn{
            background-color:${props.theme[4]};
            color:${props.theme[3]};
            border: 1px solid ${props.theme[3]};
        }
        .modal-leave-btn{
            background-color:${props.theme[4]};
            color:${props.theme[3]};
            border: 1px solid ${props.theme[3]};
        }
        .modal-already-joined{
            background-color:${props.theme[2]};
            border: 1px solid ${props.theme[3]};
        }
        .modal-text{
            color:${props.theme[3]};
        }
        #modal-close-icon{
            filter:${props.theme[5]};
        }
        .modal-close-btn{
            background-color: ${props.theme[4]};
        }
		.main-page-wrapper{
			background-color:${props.theme[0]};
		}
		.home-page-topbar{
			background-color:${props.theme[1]};
		}
		.search-bar{
			background-color:${props.theme[0]};
		}
        #search-icon{
            filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
        }
        .log-out-button{
            text-align:center;
            color:${props.theme[4]};
            background-color:${props.theme[1]};
        }
        .drop-down-profile{
            color:${props.theme[3]};
            background-color:${props.theme[0]};
        }
        .search-input-container{
            color:${props.theme[3]};
        }
        ::placeholder{
            color:${props.theme[4]};
        }
        .drop-down-icon{
            filter: ${props.theme[5]};
        }
        .create-room-desc{
            color:${props.theme[3]};
        }
        .create-room-toggler{
            background-color:${props.theme[1]};
        }
        .join-room-desc{
            color:${props.theme[3]};
        }
        .info-text-join-room{
            color:${props.theme[3]};
        }
        .join-room-toggler{
            background-color:${props.theme[1]};
        }
        .main-page-content{
            background-color:${props.theme[0]};
        }
        .create-room{
            background-color:${props.theme[1]};
        }
        .modal-content-create-contest{
            background-color:${props.theme[1]};
        }
        .modalContest{
            
        }
        .join-room{
            background-color:${props.theme[1]};
        }
        .header-text{
            color:${props.theme[3]};
        }
        .create-room-title{
            background-color:${props.theme[0]};
            color:${props.theme[3]};
        }
        .create-room-type{
            background-color:${props.theme[0]};
            color:${props.theme[3]};
        }
        .join-room-id{
            background-color:${props.theme[0]};
            color:${props.theme[3]};
        }
        .join-room-type{
            background-color:${props.theme[0]};
            color:${props.theme[3]};
        }
        .create-room-password{
            background-color:${props.theme[0]};
            color:${props.theme[3]};
        }
        .join-room-password{
            background-color:${props.theme[0]};
            color:${props.theme[3]};
        }
        .create-room-text-desc{
            background-color:${props.theme[0]};
            color:${props.theme[3]};
        }
        .create-room-submit{
            background-color:${props.theme[4]};
            color:${props.theme[3]};
        }
        .join-room-submit{
            background-color:${props.theme[4]};
            color:${props.theme[3]};
        }
        .homePageTopBarName{
            color:${props.theme[3]};
        }
        .publicRoomComponent{
            background-color:${props.theme[1]};
            color:${props.theme[3]};
        }

	`,  
		<div className='main-page'>
            <div id ='contestStartNotification' className='contestStartNotification'
            >

            </div>
            {modalDisplay()}
            <div  className='main-page-wrapper'>
                <div className="home-page-topbar" >
                    <div className="topbar-logo">
                        <img src="/icons/m2cLogo.png" id="topbar-app-logo"  alt=""/>
                        <h3  className="homePageTopBarName">Meet2Code</h3>
                    </div>

                    <div className="home-page-searchbar">
                        <div className='search-bar'>
                            <div className="search-icon-container">
                                <img id='search-icon' src='/icons/search.png' alt=""/>    
                            </div>
                            <div className="search-input-container">
                                <input placeholder="Search for public rooms" className="search-input">
                                </input>
                            </div>
                        </div>
                    </div>


                    <div className="profile-drop-down">
                        <div className="profileDropdown"  onClick={()=>{toggleDropDown()}}>
                            <img src={`${props.user.imageUrl}`} id="user-dp" alt=""/>
                            <div className="profileDropdown-content" id="profileDropdown-content">
                                <div className="drop-down-profile">
                                    <span>{props.user.login}</span>
                                </div>
                                <div className="log-out-button" onClick={logOutUser}>
                                    <span>Log Out</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
                <div className='main-page-content'>
                    <div className='create-room' id="create-room-box">
                        <div className="create-room-header" onClick={(e)=>{toggleOpen("create")}}>
                            <span className="header-text">New Room</span>
                            <img className="drop-down-icon" src='./icons/drop-down.png' invert={createShow ? 1 : 0} alt="" />
                        </div>
                        {createShow===true?
                            <div className="create-room-toggler" >
                                <div className="create-room-desc ">
                                    Fill the following fields to start a new room
                                </div>
                                <div className="create-room-form"> 
                                    <form  id="create-room-form">
                                        <div className="create-room-object">
                                            <input className="create-room-title" autoComplete="off" name="name" placeholder="Room name" maxLength="20"></input>
                                            <select className="create-room-type" name="type" id="mainPageCreateRoomFormType" onClick={(e)=>{showPwd("create")}}>
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                        {
                                            prShowCreate===true?
                                                <input className="create-room-password" type="password" name="password" placeholder="Room Password">
                                                </input>:""
                                        }
                                        <textarea name="description" className="create-room-text-desc" rows="3" maxLength="600" placeholder="Room Description"></textarea>
                                        <button className="create-room-submit" type="submit"
                                            onClick={async(e)=>{
                                                e.preventDefault()
                                                const formData = new FormData(document.getElementById('create-room-form'));
                                                await createRoom(formData)
                                            }}>
                                            Create Room
                                        </button>
                                    </form>
                                </div>
                            </div>
                        :""}
                    </div>

                    <div className='join-room' id="join-room-box">
                        <div className="join-room-header" onClick={(e)=>{toggleOpen("join")}}>
                            <span className="header-text">Join Room</span>
                            <img className="drop-down-icon" src='./icons/drop-down.png' invert={joinShow ? 1 : 0} alt="" />
                        </div>
                        {joinShow===true?
                            <div className="join-room-toggler" >
                                <div className="join-room-desc ">
                                    Fill the following fields to join a room
                                </div>
                                <div className="join-room-form"> 
                                    <form  id="join-room-form">
                                        <div className="join-room-object">
                                            <input className="join-room-id" autoComplete="off" name="id" placeholder="Room Id"></input>
                                            <select className="join-room-type" name="type" id="mainPageJoinRoomFormType" onClick={(e)=>{showPwd("join")}}>
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                        {
                                            prShowJoin===true?
                                                <input className="join-room-password" type="password" name="password" placeholder="Room Password">
                                                </input>:""
                                        }
                                        <div className='info-text-join-room'></div>
                                        <button className="join-room-submit" type="submit"
                                            onClick={async(e)=>{
                                                e.preventDefault()
                                                const formData = new FormData(document.getElementById('join-room-form'));
                                                await joinRoom(formData)
                                            }}>
                                            Join Room
                                        </button>
                                    </form>
                                </div>
                            </div>
                        :""}
                    </div>
                </div>

                <div className='contest-helper-ui'>
                    <div className='create-room create-contest' onClick={()=>toggleCreateContestModal()}>
                        <p>Create a contest</p>
                    </div>
                    <div className='create-room create-contest'  onClick={() => toggleJoinContestModal()} >
                            <p >Join a contest</p>
                    </div>
                </div>

                <div className="modalContest">
                    <div className="modal-content-create-contest">
                        <span className="close-button" onClick={()=>toggleCreateContestModal()}>&times;</span>
                        <div className="dropdown">
                            <select name='question 1' id='question 1' className='questionOption'>
                            {
                                questions.map((question, index) => {
                                    return <option key={index} value={question['contestId'] + '/' + question['index']}>
                                        {question['name'] + '  -  ' + question['rating']}
                                    </option>
                                })
                            }
                            </select>
                        </div>
                        <div className="dropdown">
                            <select name='question 2' id='question 2' className='questionOption'>
                            {
                                questions.map((question, index) => {
                                    return <option key={index} value={question['contestId'] + '/' + question['index']}>
                                        {question['name'] + '  -  ' + question['rating']}
                                    </option>
                                })
                            }
                            </select>
                        </div>
                        <div className="dropdown">
                            <select name='question 3' id='question 3' className='questionOption'>
                            {
                                questions.map((question, index) => {
                                    return <option key={index} value={question['contestId'] + '/' + question['index']}>
                                        {question['name'] + '  -  ' + question['rating']}
                                    </option>
                                })
                            }
                            </select>
                        </div>
                        <div className="dropdown">
                            <select name='question 4' id='question 4' className='questionOption'>
                            {
                                questions.map((question, index) => {
                                    return <option key={index} value={question['contestId'] + '/' + question['index']}>
                                        {question['name'] + '  -  ' + question['rating']}
                                    </option>
                                })
                            }
                            </select>
                        </div>
                        <div className="dropdown">
                            <select name='question 5' id='question 5' className='questionOption'>
                            {
                                questions.map((question, index) => {
                                    return <option key={index} value={question['contestId'] + '/' + question['index']}>
                                        {question['name'] + '  -  ' + question['rating']}
                                    </option>
                                })
                            }
                            </select>
                        </div>

                        <div className='contestTimePicker'>
                            <p>
                                Contest Start time
                            </p>
                            <DateTimePicker value={contestTime} onChange={setContestTime}></DateTimePicker>
                        </div>

                        <div className='contestTimePicker'>
                            <button onClick={createContest}>
                                Start the contest
                            </button>
                        </div>
                    </div>
                </div>

                <div className='modalContest' id='joinModal'>
                    <div className='modal-content-create-contest'>
                        <span className="close-button" onClick={()=>toggleJoinContestModal()}>&times;</span>
                        <div className='contestListDisplay'>
                            {
                                contestList.map((contest,index) => {
                                    return <div key={index} className='contestListDisplayItem'>
                                                {contest['name']}
                                                <button style={{marginLeft:"10px", marginRight:"10px", width:"30%"}}
                                                        onClick={()=>{joinContest(contest['contestId'], contest['_id'])}}
                                                >
                                                    Join
                                                </button>
                                            </div>
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className='home-public-display'>
                    {
                        publicRooms.map((room,index) => {

                            return <div key={index} className='publicRoomComponent'>
                                        <div style={{textAlign:'center'}}>
                                            <h3>{room['name']}</h3>
                                        </div>
                                        <div className='roomDispBorder'></div>
                                        <div style={{marginTop : "5%"}}>
                                            <h4>{room['desc']}</h4>
                                        </div>
                                        <div style={{marginTop : "5%"}}> 
                                            <img src={room['host']['imageUrl']} className='user-dp'
                                            title={room['host']['login']}
                                            alt='emplty'></img>
                                            {   
                                                room['participants'].map((participant,index) => {
                                                    return  <img key={participant['login']}
                                                                src={participant['imageUrl']} 
                                                                 alt='emplty'
                                                                 className='user-dp'
                                                                 title={participant['login']}
                                                            >
                                                            </img>
                                                })
                                            }
                                        </div>
                                        <div style={{alignItems:"center", 
                                                    textAlign:"center", 
                                                    color:"green", 
                                                    fontSize:"20px",
                                                    cursor:"pointer"}}
                                                    type="submit"

                                            onClick={async(e)=>{
                                                        e.preventDefault();
                                                        const formData = new FormData();
                                                        formData.append('id',room['id']);
                                                        formData.append('type','public');
                                                        await joinRoom(formData)
                                                    }}
                                        >
                                            Join room
                                        </div>
                                   </div>    
                        })
                    }
                </div>
            </div>
		</div>
    )
}

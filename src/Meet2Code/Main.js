import React from 'react';
import './main.css';
import { useState, useEffect } from 'react';
import serverEndpoint from './config';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { io } from "socket.io-client";


import Login from './OAuth/Login';
import MainPage from './MainPage/MainPage';
import Room from './Room/Room';
import Contest from './Contest/Contest';
let socket;
export default function Main() {
    
    //['background-color', 'window-color', 'icon-color','text-color','selected-item-color/secondary-text-color','black to icon-color filter']
    const colorPallete = [
        ['#000000','#222221','#A1A1A1','#D5D5D5','#666666','invert(72%) sepia(0%) saturate(108%) hue-rotate(183deg) brightness(93%) contrast(78%)','invert(37%) sepia(2%) saturate(26%) hue-rotate(353deg) brightness(105%) contrast(88%)'],
        ['#000205','#0E111A','#03050B','#BCF4EF','#199C95','invert(2%) sepia(8%) saturate(4372%) hue-rotate(188deg) brightness(103%) contrast(101%)','invert(56%) sepia(12%) saturate(5501%) hue-rotate(137deg) brightness(82%) contrast(80%)'],
        ['#FFFFFF','#BBBBBB','#767676','#575758','#949494','invert(47%) sepia(1%) saturate(0%) hue-rotate(210deg) brightness(96%) contrast(84%)','invert(76%) sepia(0%) saturate(3752%) hue-rotate(75deg) brightness(77%) contrast(100%)'],
        ['#EDC7B7','#EEE2DC','#AC3B61','#123C69','#BAB2B5','invert(27%) sepia(30%) saturate(2326%) hue-rotate(300deg) brightness(102%) contrast(87%)','invert(80%) sepia(0%) saturate(7458%) hue-rotate(9deg) brightness(93%) contrast(85%)'],
        ['#EAE7DC','#D8C3A5','#E85A4F','#E98074','#8E8D8A','invert(47%) sepia(35%) saturate(1100%) hue-rotate(316deg) brightness(93%) contrast(94%)','invert(62%) sepia(0%) saturate(2672%) hue-rotate(7deg) brightness(91%) contrast(74%)'],
        ['#FCE181','#FEF9E7','#0DEA05','#026670','#9FEDD7','invert(11%) sepia(84%) saturate(7074%) hue-rotate(240deg) brightness(87%) contrast(108%)','invert(93%) sepia(7%) saturate(1539%) hue-rotate(101deg) brightness(98%) contrast(90%)']
    ]; 
    
    const [theme,setTheme] = useState(colorPallete[1]);
    let [user,setUser]=useState({});
    let [loggedin,setLoggedin]=useState(false);
    let [loading,setLoading]=useState(true);
    
    useEffect(()=>{
        getInfo();
        var connectionOptions = {
            "force new connection": true,
            "reconnectionAttempts": "Infinity",
            "timeout": 10000,
            "transports": ["websocket"]
        };
        socket = io(serverEndpoint,connectionOptions);
    },[])
    
    async function getInfo(){
        let loginfo=await fetch(`${serverEndpoint}/oauth/isloggedin`,{
            method:"GET",
            credentials:"include"
        })
    
        loginfo=await loginfo.json()
        if(loginfo.loggedin===true){
            setUser(loginfo.user)
            setLoggedin(true);
            setLoading(false);
        }
        else{
            setLoading(false);
        }
    }

    let logOutUser=async()=>{
    
        fetch(`${serverEndpoint}/oauth/logout`,{
        method:"post",
        credentials:"include"
        })
        .then(resp=>{
        if(resp.status===200){
            setUser({})
            setLoggedin(false)
        }
        })
    }

    const renderHome=()=>{
        if(loading===true)
            return <div></div>

        if(loggedin===false){
            return <Login socket={socket} theme={theme} setTheme={setTheme}></Login>
        }
        else{
            return  <MainPage socket={socket} theme={theme} setTheme={setTheme} user={user} loggedin={loggedin} logOutUser={logOutUser}></MainPage>
        }
    }

    return (
        <div className='main-app'>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={renderHome()}/>
                         
                    <Route path='/room/:id' element={
                        <Room socket={socket} theme={theme} setTheme={setTheme} user={{...user}}></Room>
                    }/>

                    <Route path='/contest/:id' element={
                        <Contest socket={socket} theme={theme} setTheme={setTheme} user={{...user}}></Contest>
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

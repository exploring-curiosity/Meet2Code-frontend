const sendMessage=(e,message,socket,id,name,room,setMessage)=>{
    e.preventDefault();
    if(message){
        socket.emit('sendMessage',message,id,name,room,()=>{setMessage('')
    });
    }
}
const chatSocketListeners = (socket,setMessages,messages)=>{
    socket.on('message',(message)=>{
        setMessages([...messages,message]);
    })
}
const chatStopListeners = (socket) =>{
    socket.off('message');
}


export {sendMessage,chatSocketListeners,chatStopListeners};
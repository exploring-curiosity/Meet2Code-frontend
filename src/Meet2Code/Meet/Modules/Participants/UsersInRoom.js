const participantsListener = (socket,usersInRoom,setUsersInRoom) =>{
    socket.on('UserList',(users)=>{
        setUsersInRoom(users);
    })
    socket.on("userJoined", ({ user }) => {
        setUsersInRoom([...usersInRoom,user]);
    });
    socket.on("userLeft",({user})=>{
        setUsersInRoom(usersInRoom.filter((itr)=>itr._id!==user._id))
    })
}

const stopParticipantsListener = (socket)=>{
    socket.off('UserList');
    socket.off('userJoined');
    socket.off('userLeft');
}
export {participantsListener,stopParticipantsListener};
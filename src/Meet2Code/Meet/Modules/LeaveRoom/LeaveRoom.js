const leaveMeet = (e,socket,id) => {
    e.preventDefault();
    socket.emit('leaveRoom', { host: id }, (status) => {
        // console.log(status)
        socket.off();
        window.location.href = "http://localhost:3000/";
    })
}

export {leaveMeet}
const updateCanvasListener =(socket,ctx,setImage) =>{
    socket.on("canvas-data", function (data) {
        var image = new Image();
        image.onload = function () {
            if (ctx === undefined) return;
            ctx.drawImage(image, 0, 0);
        };
        image.src = data;
        setImage(image);
    })
}

const stopCanvasListeners = (socket) =>{
    socket.off("canvas-data");
}

const clearCanvas = (socket,ctx,room) =>{
    let canvas = document.getElementById('board');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var base64ImageData = canvas.toDataURL("image/png");
    socket.emit("canvas-data",base64ImageData,room);
}

export {updateCanvasListener,stopCanvasListeners,clearCanvas};
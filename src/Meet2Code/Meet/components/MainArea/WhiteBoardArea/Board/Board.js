import React, { useEffect } from 'react';
import './board.css';

const Board=(props)=> {
    useEffect(()=>{
        console.log(props.color,props.size);
        if(props.ctx===undefined) return;
        props.ctx.strokeStyle = props.color;
        props.ctx.lineWidth = props.size;
        if(props.image!==undefined && props.image.src!=="http://localhost:3000/null")
            props.ctx.drawImage(props.image,0,0);
    },[props.image,props.color,props.size,props.ctx]);
    useEffect(()=>{
        if(props.save===1)
        {
            let canvas = document.querySelector('#board');
            var imageName = prompt('Please enter image name');
            var canvasDataURL = canvas.toDataURL();
            var a = document.createElement('a');
            a.href = canvasDataURL;
            a.download = imageName || 'drawing';
            a.click();
            props.setSave(0);
        }
        // eslint-disable-next-line
    },[props.save])
    useEffect(()=>{
        var canvas = document.querySelector('#board');
        const drawOnCanvas=(canvas)=>{
            var ctx = canvas.getContext('2d');
            props.setctx(ctx);
            var sketch = document.querySelector('#sketch');
            var sketch_style = getComputedStyle(sketch);
            canvas.width = parseInt(sketch_style.getPropertyValue('width'));
            canvas.height = parseInt(sketch_style.getPropertyValue('height'));
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var mouse = {x: 0, y: 0};
            var last_mouse = {x: 0, y: 0};
    
            /* Mouse Capturing Work */
            canvas.addEventListener('mousemove', function(e) {
                
                last_mouse.x = mouse.x;
                last_mouse.y = mouse.y;
    
                const sketchBox = document.getElementById('sketch');
                const Rect = sketchBox.getBoundingClientRect();
                const l = Rect.left;
                const t = Rect.top;
                
                mouse.x = e.clientX - l;
                mouse.y = e.clientY - t;
            }, false);
    
    
            /* Drawing on Paint App */
            ctx.lineWidth = 5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = "black";
    
            canvas.addEventListener('mousedown', function(e) {
                canvas.addEventListener('mousemove', onPaint, false);
            }, false);
    
            canvas.addEventListener('mouseup', function() {
                canvas.removeEventListener('mousemove', onPaint, false);
                var base64ImageData = canvas.toDataURL("image/png");
                props.socket.emit("canvas-data",base64ImageData,props.room);
            }, false);
    
            var onPaint = function() {
                ctx.beginPath();
                ctx.moveTo(last_mouse.x, last_mouse.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.closePath();
                ctx.stroke();
            };
        }
        drawOnCanvas(canvas);
        // eslint-disable-next-line
    },[])
    return (  
            <div className='sketch' id='sketch'>
                <canvas className='board' id='board'></canvas>
            </div>
        );
}
export default Board;
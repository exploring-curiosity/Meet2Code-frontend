import React, { useState } from 'react';
import Board from '../Board/Board';
import './white-board.css';
import Style from 'style-it';
 
const WhiteBoard = (props) => {
    const [brushColor,setBrushColor] = useState('#000000');
    const [color,setColor] = useState('#000000');
    const [size,setSize] = useState(5);
    return Style.it(`
        .outer-container{
            color:${props.theme[3]};
            background-color:${props.theme[1]};
        }
        #board-erase-icon{
            filter: ${props.theme[6]};
        }
        .brush-size-container select{
            color:${props.theme[3]};
            border: 1px solid ${props.theme[4]};
        }
        .color-picker-container input{
            background:none;
            border: none;
            transform: translateY(0.3em);
        }
    `,  
        <div className='outer-container'>
            <div className='tools-section'>
                <div className='color-picker-container'>
                    Select color : &nbsp;
                    <input type='color' id='color-box' onChange={(e)=>{setColor(e.target.value);setBrushColor(color);}}/> 
                </div>
                <div className='brush-size-container'>
                    Select size : &nbsp;
                    <select value={size} onChange={(e)=>{setSize(e.target.value)}}>
                        <option>5</option>
                        <option>10</option>  
                        <option>15</option>  
                        <option>20</option>  
                        <option>25</option>  
                        <option>30</option>      
                    </select> 
                </div>
                <div>
                    <button id='erase' onClick={()=>{setBrushColor(color);setColor('#FFFFFF')}}><img id='board-erase-icon' src='/icons/eraser.png' alt="erase"/></button>
                </div>
                <div>
                    <button id='brush' onClick={()=>{setColor(brushColor);console.log(brushColor)}}><img id='board-brush-icon' src='/icons/paint-brush.png' alt="brush" /></button>
                </div>
            </div>
            <div className='board-container'>
                <Board {...props} color={color} size={size}/>
            </div>
        </div>
    ); 
}
 
export default WhiteBoard;
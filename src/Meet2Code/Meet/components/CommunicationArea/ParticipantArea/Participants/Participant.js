import './participant.css';
import React, {useEffect,useState} from 'react';
import {CSVLink} from 'react-csv';
import Style from 'style-it';
let data = [];
const headers = [
    {label: "Name", key:"name"}
];
const Participant = (props) => {
    let [csvReport,setCsvReport] = useState({data:data,headers:headers,filename:'Attendence.csv'});
    useEffect(()=>{
        data=[];
        props.users.forEach(user => data.push({name: user.login}));
        setCsvReport({
            data: data,
            headers: headers,
            filename: 'Attendence.csv'
        });
    },[props.users])
    return Style.it(`
        .click-link{
            color:${props.theme[3]};
            background-color:${props.theme[4]};
        }
        .participant{
            color:${props.theme[3]};
            background-color:${props.theme[2]};
        }
        .participant-score{
            color:${props.theme[3]};
            background-image: linear-gradient(to bottom right, ${props.theme[2]}, ${props.theme[4]});
        }
    `,  
        <div className='participantContainer'>
            <div className='participantArea'>
                {props.users.map((user,id) => (
                    <div key={id} className="participant">
                        <img src={user.imageUrl} alt=""/>
                        <div className='participant-score'>0</div>
                        <p>{user.login}</p>
                    </div>
                ))}
            </div>
            <div>
                <CSVLink {...csvReport} className='click-link'>Download Attendence</CSVLink>
            </div>
        </div>
    );
}
 
export default Participant;
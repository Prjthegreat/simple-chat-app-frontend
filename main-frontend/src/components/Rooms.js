import React,{useEffect} from 'react'
import {Link} from 'react-router-dom'
import plus from '../svg/plus.png'
const Rooms = (props) => {
   const deleteRoomHandler=(index)=>{
    props.setrooms(props.rooms.filter((room,i)=>i!=index))
   }
    return (
        <div style={{backgroundImage:'linear-gradient( 140deg,rgb(96, 104, 115),#3A6382)',boxShadow: '3px 3px 10px 0px rgba(0,0,0,0.75)',
        webkitBoxShadow: '3px 3px 10px 0px rgba(0,0,0,0.75)',
        mozBoxShadow: '3px 3px 10px 0px rgba(0,0,0,0.75)',padding:'10px 25px',justifyContent:'center',textAlign:'center',
            height:'215px',width:'300px',display:'inline-block', overflowX:'scroll',overflowX:'hidden' }} >
             <div style={{textAlign:'start'}} >
               <img style={{ position: 'relative',left:'-20px',top: '-8px', cursor:'pointer' }} src={plus} alt="plus" height="20px" width="20px" onClick={props.createRoomBoxHandler}  /> 
             </div> 
            <h2>Current Room</h2>
            <ul style={{display:'flex',paddingLeft:'0px',flexDirection:'column',
             listStyleType:'none' }} >
           
               <div style={{backgroundColor:'#DF8805',marginBottom:'10px'}}>
               { props.roomobj.roomid ? (<div  >
                   <div style={{textAlign:'justify',padding:'10px'}} >
                    <li  >RoomName : {props.roomobj.roomname} </li>
                    <span> RoomId :  {props.roomobj.roomid}</span><br/>
                    </div>
                    {/* <Link to={`/?roomname=${props.roomobj.roomname}&roomid=${props.roomobj.roomid}`} 
                    > */}
                        <input id="roomLink"
                          type="text"  
                          value={`${process.env.REACT_APP_FRONTEND_URL}?roomname=${props.roomobj.roomname}&roomid=${props.roomobj.roomid}`} readonly/>
                        <button
                         className="mybtn" 
                         onClick={()=>{
                            const copyText = document.getElementById("roomLink");
                            copyText.select();
                            copyText.setSelectionRange(0, 99999)
                            document.execCommand("copy");
                            

                         }}
                        
                        > Copy</button>
                   {/* </Link> */}
                    {/* <Link to={'/'} ><button onClick={(event)=>deleteRoomHandler(i)} >delete</button></Link> */}
                 </div>):  <div> No Room Selected... </div>  }
               </div>
          
           </ul>
        </div>
    )
}

export default Rooms

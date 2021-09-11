import React,{useState,useEffect} from 'react'
import ChatRoom from '../components/ChatRoom'
import Rooms from '../components/Rooms'
import CreateRoom from '../components/CreateRoom'
import CreateUser from '../components/CreateUser'
import './HomePage.css'
import socketioclient from 'socket.io-client'
import {useLocation} from 'react-router-dom'
import './HomePage.css'
import ParticleBackground from '../ParticleBackground'
import Particles from 'react-particles-js';
import ParticlesConfig from '../config/particle-config';
import { io } from "socket.io-client";

let socket
const ENDP=`${process.env.REACT_APP_BACKEND_URL}`
socket=socketioclient(ENDP)

const HomePage = (props) => {
    const [user,setUser]=useState(null)
    const [userid,setuserid]=useState(null)
    const [currroom,setcurrroom]=useState(null)
    // currroom------> { id:jdcjdeckj,name:'roomname }

   // const [socketID,setsocketID]=useState(null)
    const location=useLocation()
    const [rooms,setrooms]=useState([])
    const [usermode,setusermode]=useState(true)
    // {name:'ddcscc',id:'adc'}
   
    const [roomobj,setroomobj]=useState({
        roomid:null,
        roomname:null
    })
   
    

    useEffect(()=>{
       const userCredentials= JSON.parse(localStorage.getItem('user_chit_chat'))
       const roomCredentials= JSON.parse(localStorage.getItem('roomData'))
      //  const currroom=JSON.parse(localStorage.getItem('curr_room'))
       if(userCredentials){
           setusermode(userCredentials.usermode)
           setUser(userCredentials.user)
           setuserid(userCredentials.userid)
       }
       if(roomCredentials){
           setrooms(roomCredentials.rooms) 
          
       }
    },[])


    useEffect(() => {
      
         const rname=new URLSearchParams(location.search).get('roomname')
         const rid=new URLSearchParams(location.search).get('roomid')
         if(!rid && !rname)
           return;

         const allrooms=JSON.parse(localStorage.getItem('roomData'))
         console.log(rname,rid)
         let index=-1
         if(allrooms){
           index= allrooms.rooms.findIndex(room=>room.id===rid &&room.name===rname)
         }
         
            //   localStorage.getItem('roomData')
         if(index===-1){
            //localStorage.setItem('roomData',JSON.stringify({rooms:[...rooms]}))
            //setrooms([...rooms,{name:rname,id:rid}])
            if(allrooms)
            localStorage.setItem('roomData',JSON.stringify({rooms:[...(allrooms.rooms),{ name:rname,id:rid}]}))
            else{
              localStorage.setItem('roomData',JSON.stringify({rooms:[{ name:rname,id:rid}]}))
            }
            
         }
         //console.log(rooms)
         const allrooms2=JSON.parse(localStorage.getItem('roomData'))
            setrooms(allrooms2.rooms)
     }, [user])
 
   
 
   useEffect(() => {
    socket.on('leave-notification',(username)=>{
        console.log(username)
      const notification=document.createElement('Div')
      notification.classList.add("notificationouterpart");
      notification.innerHTML = `<h3>${username} has left the room</h3>`;
      document.querySelector('.main__body').appendChild(notification)

   })
       
   }, [])
    

const createRoomBoxHandler=()=>{
  const element=document.getElementsByClassName('create__room_box')[0]
  if( !element.style.height ||  element.style.height==='0px'){
    element.style.height='160px'
    element.style.opacity=1
  }
  else{
    element.style.height='0px'
    element.style.opacity=0
  }
}

    return (
        <React.Fragment>
          <div className="main_container"  >
          <div style={{zIndex:'1'}} ><Particles params={ParticlesConfig} ></Particles></div>
       { !usermode ? <div className="main__body" >
      
            { !usermode &&  <div style={{margin:'10px',background:'transparent',border:'none'}}  
            onClick={()=>setusermode(true)} className="middle"  > 
            <a className="btnn btn1" >Switch User</a></div>  }<br/>
            <h3> User:{user}</h3>
          <br/>
          
            {/* selected room:{roomobj.roomid===null ?'none':roomobj.roomname} */}
            <div style={{position:'relative',display:'inline-block' }} >
            <Rooms rooms={rooms} setrooms={setrooms} createRoomBoxHandler={createRoomBoxHandler}
             roomobj={roomobj} user={user} setroomobj={setroomobj}  socket={socket} />
            <CreateRoom rooms={rooms}  createRoomBoxHandler={createRoomBoxHandler} setrooms={setrooms} user={user} userid={userid} socket={socket} endpointdata={props.endpointdata} />
             </div> <br />
            {rooms.length==0 ? <div> 'No room selected' </div> :(
               
                <ChatRoom 
                    initialsocket={socket}
                    currroom={currroom} 
                    setrooms={setrooms}
                    setcurrroom={setcurrroom} 
                    rooms={rooms} 
                    setroomobj={setroomobj}
                    userid={userid}
                    user={user} 
                    endpointdata={props.endpointdata}
                />

            ) }
           
        </div> :  <CreateUser user={user} setUser={setUser} 
          setuserid={setuserid} userid={userid} setusermode={setusermode} /> }
          </div>
        </React.Fragment>
    )
}

export default HomePage

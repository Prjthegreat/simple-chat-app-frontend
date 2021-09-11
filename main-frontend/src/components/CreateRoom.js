import React,{useState} from 'react'
import cross from '../svg/close.png'

const CreateRoom=({socket,rooms,setrooms,user,userid,createRoomBoxHandler,endpointdata})=>{
  const [room,setroom]=useState()
  function generateRandomNumber(numberOfCharacters) {
    var randomValues = '';
    var stringValues = 'ABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyzPQRSTUVWXYZ123456789';  
    var sizeOfCharacter = stringValues.length;  
 for (var i = 0; i < numberOfCharacters; i++) {
       randomValues = randomValues+stringValues.charAt(Math.floor(Math.random() * sizeOfCharacter));
    }
    return randomValues;
 } 
  const createroomhandler=async()=>{
    //const roomid= generateRandomNumber(10)
    
   // rooms.push( { name:room,id:roomid })
   if(user==null){
     return;
   }

   const response= await fetch(`${process.env.REACT_APP_BACKEND_URL}chats/createroom`,{
      method:'POST',
      headers: {
      'Content-Type': 
          'application/json;charset=utf-8'
     },
     body:JSON.stringify({
       roomname:room,
       adminname:user,
       adminid:userid,
     })
   })
   if(!response.ok){
     console.log('error...........')
   }
   let responsedata
   if(response.status===201){
    responsedata= await response.json()
   }
  console.log(responsedata)


   //socket.emit('join-room',roomid,user,endpointdata)

    setrooms([...rooms,{ name:responsedata.room.roomname,id:responsedata.room._id }])
    setroom('')
    localStorage.setItem('roomData',JSON.stringify({rooms:[...rooms,{ name:room,id:responsedata.room._id }]}))
    console.log(rooms)
  }

   return(
     <div className="create__room" >
       
     <div className="create__room_box" >
       <div> <img style={{position:'relative',left:'110px',cursor:'pointer' }}
        src={cross} height="10px" width="10px" onClick={createRoomBoxHandler} />
       </div>
     <h3>Create You Room</h3>
       <input style={{width:'200px'}} placeholder="enter room name" 
       value={room} 
       onChange={(event)=>
        setroom(event.target.value)} 
       />
       <button onClick={createroomhandler} disabled={!room || room.length===0} className="mybtn" >Create Room</button>
     </div>
     </div>
   )
}

export default CreateRoom
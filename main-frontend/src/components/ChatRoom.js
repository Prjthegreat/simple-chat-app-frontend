import React,{useState,useEffect,useRef} from 'react'
import {Link } from 'react-router-dom'
import { io } from "socket.io-client";
import maximize from '../svg/maximize.png'
import cross from '../svg/close.png'
import userlist from '../svg/user.png'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './ChatRoom.css'
import DropDownbtn from './DropDownbtn';
const ChatRoom = ({user,rooms,setroomobj,setrooms,initialsocket,currroom,setcurrroom,userid,endpointdata}) => {
   const [message,setmessage]=useState()
   const [admin,setadmin]=useState()
   //admin:{id:ndjdc,name:dckndcd}
   const [current_room_users_list,setcurrent_room_users_list]=useState([])
   const [messages,setmessages]=useState([]) 
   const [fullscreenchat,setfullscreenchat]=useState(false)
   const [socket,setsocket]=useState(initialsocket)
  
   const messageEl = useRef(null);
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const [dropdownIndex,setdropdownIndex]=useState(-1)
   const[isBlackListed,setisBlackListed]=useState(false)
   const [userjoined,setuserjoined]=useState(false)
 
  let helperisBlackListed=false
  const toggle = () => setDropdownOpen(prevState => !prevState);
   //{ name:'room name',id:'dfdefefce }

    const notificationHandler=(parameter)=>{
      console.log(parameter)
      const notification=document.createElement('Div')
      notification.classList.add("notificationouterpart");
      notification.innerHTML = `<h3>${parameter.message}</h3>`;
      //setisBlackListed(true)
      document.querySelector('.main__body').appendChild(notification)
    }
    const renderinguserslist=(list,userid)=>{
      const index= list.findIndex(u=>u.userid===userid)
      if(index){
        [list[0],list[index]]=[list[index],list[0]]
        setcurrent_room_users_list(list)
      }
     
    }
    const sendMessageHandler=()=>{
      
        socket.emit('typing',currroom.id,null)

        //document.getElementById('chat').scrollTop=document.getElementById('chat').scrollHeight
        setmessages([...messages,{sendername:user,message:message,timeStamp: new Date(Date.now()).toLocaleString() }])
        socket.emit("sendMessage",message,user,userid,currroom.id,isBlackListed)
        setmessage('')
        //messagesEndRef.current.scrollIntoView({ behavior: "smooth" })

       
    }
   const leaveRoomHandler=async()=>{

    const response= await fetch(`${process.env.REACT_APP_BACKEND_URL}chats/leaveroom/${userid}`,{
      method:'POST',
      headers: {
      'Content-Type': 
          'application/json;charset=utf-8'
     },
     body:JSON.stringify({
       roomid:currroom.id,
       username:user
     })
   })
     if(!response.ok){
       console.log('error')
     }
      const responsedata=await response.json()
      console.log(responsedata)
      socket.emit('room-leave-notification',user,userid,currroom.id)
      let afterdeleionrooms= rooms.filter(r=>r.id!=currroom.id)
      socket.disconnect()
      setcurrroom(null)
      setroomobj({roomname:null,roomid:null})
      setcurrent_room_users_list([])
      setadmin(null)
      setrooms(afterdeleionrooms)
      setisBlackListed(false)
      localStorage.setItem('roomData',JSON.stringify({rooms:afterdeleionrooms}))

   }
    useEffect(() => {
        if (messageEl) {
            
          messageEl.current.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
          });
        }
    }, [])
  
    const handelEnter=(event)=>{
        if(event.keyCode===13){
          event.preventDefault()
          sendMessageHandler()
        }
    }

    const sideDrawerhandler=()=>{
      const sidedrawer= document.getElementsByClassName('responsive')[0]
      //sidedrawer.style.right='0px'
      if(sidedrawer.style.right==='0px'){
        sidedrawer.style.right='600px'
        //sidedrawer.style.opacity='0'
        const hamburger1=document.getElementsByClassName('hamburger')[0]
        hamburger1.style.transform="rotate(0deg)"
        hamburger1.style.margin="2px 0px"
        //hamburger1.style.translate="translate(0px 0px)"
        //hamburger1.style.transform="rotateX(0deg)"
        const hamburger2=document.getElementsByClassName('hamburger')[1]
        hamburger2.style.opacity="1"
        hamburger2.style.margin="2px 0px"
        const hamburger3=document.getElementsByClassName('hamburger')[2]
        hamburger3.style.transform="rotateZ(0deg)"
        hamburger3.style.margin="2px 0px"
      }
      else{
        sidedrawer.style.right='0px'
        //sidedrawer.style.opacity='1'
        const hamburger1=document.getElementsByClassName('hamburger')[0]
        hamburger1.style.transform="rotate(-45deg)"
        hamburger1.style.margin="-1.5px 0px"
        //hamburger1.style.translate="translate(20px 0px)"
        //hamburger1.style.transform="rotateX(-20deg)"
        const hamburger2=document.getElementsByClassName('hamburger')[1]
        hamburger2.style.opacity="0"
        hamburger2.style.margin="-1.5px 0px"
        const hamburger3=document.getElementsByClassName('hamburger')[2]
        hamburger3.style.transform="rotateZ(45deg)"
        hamburger3.style.margin="-1.5px 0px"
      }
    }
    const usersListHandler=()=>{
      if(!currroom){
        return;
      }
       
      const element=document.getElementsByClassName('users_list')[0]
      if(!element.style.height || element.style.height==='0vh'){
       element.style.height='26vh'
       element.style.opacity=1
      }
      else{
       element.style.height='0vh'
       element.style.opacity=0
      }
    }
    useEffect(()=>{
      sideDrawerhandler()
     },[])
    const fullScreenHandler=()=>{
      document.getElementById('chat').classList.toggle('fullscreenChat')
      document.documentElement.scrollTop=0
      setfullscreenchat(prev=>!fullscreenchat)
      console.log(fullscreenchat)
    }

     useEffect(() => {
       const fetchRoomChat=async()=>{
          const response=await fetch(`${process.env.REACT_APP_BACKEND_URL}chats/${currroom.id}/${userid}`,{
            headers: {
                'Content-Type': 
                    'application/json;charset=utf-8'
            },
          })

          const responsedata=await response.json()
          console.log(responsedata)
         // setmessages([...messages,responsedata.chats])
        
          setadmin({id:responsedata.adminid,name:responsedata.adminname})
          console.log(responsedata.users)
          renderinguserslist(responsedata.users,userid)
          setcurrent_room_users_list([...(responsedata.users)])
          //now check whether this user is blacklisted in this room or not...
          try{
            const shouldBlackListUser= await responsedata.blacklistedusers.find(u=>u.userid===userid)
            if(shouldBlackListUser){
             setisBlackListed(true)
             setmessages([{sendername:'Chit_Chat_Team',message:"You have been blacklisted by admin You can't message now"}])
             socket.emit('join-room',currroom.id,user,userid,true,endpointdata)
             helperisBlackListed=true
             //socket.emit('isBlackListedOrNot',true)
            }
            else{
             setisBlackListed(false)
             if(  responsedata.chats && responsedata.chats.length!=0){
                  setmessages(responsedata.chats)
              }
              else{
                  setmessages([])
              }
              //console.log(settings)
              socket.emit('join-room',currroom.id,user,userid,false,endpointdata)
              helperisBlackListed=false
              //socket.emit('isBlackListedOrNot',false)
            }
          }catch(err){

          }
         
       }
       if( user!=null && currroom!=null)
       fetchRoomChat()
     }, [currroom,user])
    
     useEffect(()=>{
      if(!isBlackListed && !helperisBlackListed){
        socket.on("receiveMessage",(newmessages)=>{
         
            if(!isBlackListed && !helperisBlackListed){
              setmessages(newmessages)
            }
            
    
          })
      }
    },[socket])
      if(socket){
 
        socket.on('welcome_user_notification',(mssg)=>{
          console.log(mssg)
          notificationHandler(mssg)
          renderinguserslist(mssg.usersList,userid)
          setcurrent_room_users_list([...(mssg.usersList)])
        }) 

        socket.on('personal_blackList_mssg',(mssg)=>{
          notificationHandler(mssg)
          setmessages([{sendername:'Chit_Chat_Team',message:"You have been blacklisted by admin You can't message now"}])
          setisBlackListed(true)
          helperisBlackListed=true
        })

        socket.on('personal_whiteList_mssg',(mssg)=>{
          notificationHandler(mssg)
          setmessages([...(mssg.roominfo.message)])
          setisBlackListed(false)
        })

        socket.on('notification',(joiningmssg)=>{
          console.log(joiningmssg)
          //socket.removeAllListeners("notification")
          socket.emit('webpush-notification',joiningmssg.user)
          notificationHandler(joiningmssg)
          setcurrent_room_users_list(joiningmssg.usersList)
       })

       socket.on('blacklisted_message',(blacklistuser)=>{
          notificationHandler(blacklistuser)
          // if admin.id!==userid this case is not for receving messages by admin(ones he blacklist someone) it is for user who is black listed and still tries to message so we give him the error... 
          if(admin && admin.id!==userid){
            setisBlackListed(true)
            setmessages([{sendername:'Chit_Chat_Team',message:"You have been blacklisted by admin You can't message now"}])
          }
          console.log(blacklistuser.usersList)
          if(blacklistuser.usersList){
            renderinguserslist(blacklistuser.usersList.users,userid)
            setcurrent_room_users_list(blacklistuser.usersList.users)
          } 
        
       })

       socket.on('whitelisted_message',(whitelistuser)=>{
        renderinguserslist(whitelistuser.usersList.users,userid)
          setcurrent_room_users_list(whitelistuser.usersList.users)
          notificationHandler(whitelistuser)
       })
       socket.on('announcement',(whiteorblacklistuser)=>{
          notificationHandler(whiteorblacklistuser)
          console.log(whiteorblacklistuser)
          renderinguserslist(whiteorblacklistuser.usersList.users,userid)
          setcurrent_room_users_list(whiteorblacklistuser.usersList.users)
       })
       socket.on('user_tying',(user_typing)=>{
           console.log(user_typing)
           const typingusercredential=document.getElementById('typing_user')
           if(user_typing.user==null){
            typingusercredential.innerHTML = ``
           }
           else{
            typingusercredential.innerHTML = `${user_typing.user} is typing`;
           }
           
       })
         socket.on('room-leave-noti-client',(leftuser)=>{
            notificationHandler(leftuser)
            setcurrent_room_users_list([...(leftuser.usersList)])
            setadmin({id:leftuser.admin.id,name:leftuser.admin.name})
         })
       
     
       
      }
 
    return (
        <div className="container" style={{position:'relative'}}  >
          {/* <DropDownbtn toggle={toggle} dropdownOpen={dropdownOpen} /> */}
        <div id="chat" className="row chatRoomCont"  style={{maxWidth:'1000px',display:'flex',justifyContent:'center',margin:'10px'}} >
            <div className="col-md-3 responsive" style={{backgroundColor:'#594E5C',paddingTop:'10px'}} > 
              <h3>All Rooms</h3>
            { rooms.length!=0 ? <ul style={{display:'flex',flexDirection:'column',
            height:`${fullscreenchat ? '94vh':'210px'}`,paddingLeft:'0px',margin:'0px',listStyleType:'none', overflow:'auto'}}>
              {rooms.length!=0 && rooms.map(r=>(
                  <li className={`${ currroom!=null && r.id===currroom.id && 'selected-room'}`}  style={{width:'90%',cursor:'pointer',
                  padding:'5px',backgroundColor:'#594E5C'}} onClick={()=>{
                      if(currroom==null ||  r.id!==currroom.id){
                          if(currroom!=null){
                            socket.disconnect()
                          }
                        sideDrawerhandler()
                        setroomobj({roomname:r.name,roomid:r.id})
                        setcurrroom(r)
                        //localStorage.setItem('curr_room',JSON.stringify({roomname:r.name,roomid:r.id}))
                        const Socket=io(`${process.env.REACT_APP_BACKEND_URL}connection`)
                        console.log(Socket)
                       // if(Socket && Socket.id){
                          //Socket.emit('join-room',r.id,user,userid,isBlackListed,endpointdata)
                        //}
                       
                    
                        setsocket(Socket)
                 }
                
                }} ><Link to={`?roomname=${r.name}&roomid=${r.id}`} >{r.name}</Link></li>
              ))}
              </ul> : "No Room exist may be You have'nt Created One " }
             </div>
           
        <div className="col-md-9" style={{backgroundImage:'linear-gradient(140deg, #00B82B, #76DC66)' ,padding:'10px 20px' }}  >
           
           <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}} >
           { currroom &&  <div  onClick={usersListHandler} ><img  src={userlist} alt="userlist" style={{cursor:'poniter'}} height="20px" width="20px" /> </div>}
          <div className="max_icon" onClick={fullScreenHandler} > 
             <img  src={maximize} height="20px" width="20px" />          
          </div>  <div>{ currroom!=null && currroom.name} Chats: { currroom!=null && messages.length}</div> 
             <div onClick={sideDrawerhandler} className="hamburgerHead" >
             <div className="hamburger" ></div>
             <div className="hamburger" ></div>
             <div className="hamburger" ></div>
             </div>
          </div> 
            <div id="admin_name" style={{height:'10px',color:'black',margin:'5px'}} >
              {admin ? (userid!==admin.id ? admin.name + ' is Admin' :  'You are Admin') :'' }</div>
            <div id="typing_user" style={{height:'20px',margin:'10px',fontSize:'10px'}} ></div>
            <ul ref={messageEl}  className="chat__room" id="chat" style={{display:'flex',flexDirection:'column',
           flexGrow:1 ,  height:`${fullscreenchat ? '69vh':'120px'}`,listStyleType:'none', overflow:'auto',overflowX:'hidden'}} >
               
            {messages.length==0 || currroom==null ? 'No Room Selected. You can create a room by clicking on Plus icon on Current Room box' : (

             messages.map(mssg=>(
               <div> 
              <div style={mssg.sendername===user? {justifyContent:'flex-end',display:'flex',flexDirection:'row'}:{justifyContent:'flex-end',display:'flex',justifyContent:'flex-start'} }   >
              <li style={{textAlign:'justify', display:'flex',flexDirection:'column', maxWidth:'200px',
              borderRadius:'5px',backgroundColor:'#455FE8',padding:'10px',margin:'5px'}} >
                   <span  ><b>{mssg.sendername}</b>  {mssg.message} </span> <br/> 
                   <div style={{display:'flex',justifyContent:'right'}} > 
                   <small style={{fontSize:'10px' }} >{ new Date(mssg.timeStamp).toLocaleString() }</small></div> 
              </li>
              </div>
             
              </div> 
             ))

            ) }
           
            </ul>
        {  currroom!==null &&  currroom.id!==null &&  <div style={{display:'flex', justifyContent:'space-between',flexWrap:'wrap'  }} >
            { !isBlackListed && <div>
                <input placeholder="Enter Message..." value={message} 
                    onChange={(event)=>{
                        if(event.target.value===''){
                            socket.emit('typing',currroom.id,null)
                        }
                        else{
                            socket.emit('typing',currroom.id,user)
                        }
                        
                    setmessage(event.target.value)}} 
                    onKeyUp={(e)=>handelEnter(e)}  ></input>
                <button onClick={sendMessageHandler} className="mybtn" >Send Message</button>
            </div>}
            <button  onClick={leaveRoomHandler} className="mybtn" ><Link to="/" >Leave Room</Link></button>
            </div>}
        </div>
        </div>
        <div className="row membersListRow" >
        <div id="user_list" className="col-md-12 users_list" >
          <div style={{paddingRight:'5px'}} >
          <h3>Members-List</h3>
          <div style={{float:'right',position:'relative',top:'-45px'}} >
          <img src={cross} height="10px" width="10px" onClick={usersListHandler} />
          </div>
          </div>
         
          {current_room_users_list && current_room_users_list.length!==0 && current_room_users_list.map((us,i)=>(us&&
          <li style={{display:'flex',justifyContent:'space-between'}} >
            <div>{ i===0 ? 'You' : us.username} {us && us.isblacklisted && <span className="blacklistedtag" >(BlackListed)</span>}</div>
            <div onClick={()=>{
              setdropdownIndex(i)
            }}>  
          { admin && admin.id===userid && admin.id!=us.userid && <DropDownbtn socket={socket} currroomid={ currroom && currroom.id} user={us.username} 
            userid={us.userid} adminid={admin && admin.id} isblacklisted={us.isblacklisted}  index={i} dropdownIndex={dropdownIndex} 
            toggle={toggle} dropdownOpen={dropdownOpen} />}
            </div>
          
           </li>
        ))}</div>
        </div>
        </div>
    )
}

export default ChatRoom

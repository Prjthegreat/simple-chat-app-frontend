import React from 'react'
import './CreateUser.css'
const CreateUser = ({user,setUser,setuserid,userid,setusermode}) => {
    function generateRandomNumber(numberOfCharacters) {
        var randomValues = '';
        var stringValues = 'ABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyzPQRSTUVWXYZ123456789';  
        var sizeOfCharacter = stringValues.length;  
     for (var i = 0; i < numberOfCharacters; i++) {
           randomValues = randomValues+stringValues.charAt(Math.floor(Math.random() * sizeOfCharacter));
        }
        return randomValues;
     }

    return (
        <div className="user_box"  >
            <div style={{display:'inline-block',height:'100vh', width:'100vw',padding:'20px',overflow:'hidden'}} >
                <h1>Welcome to Prj Chit_Chat App...</h1><br/>
                <div style={{display:'grid', justifyItems:'center', justifyContent:'space-around' }} > 
                <label  for="name" > Enter Your Name </label>
                <input id="name" type="text" style={{marginTop:'5px',marginBottom:'5px'}} />
                
                <button  className="mybtn"  onClick={ ()=>{
                    const nickname=document.getElementById('name').value
                    if(nickname==='')
                      return;
                   setUser(nickname)
                   setusermode(false)
                   const user_id=generateRandomNumber(5)
                   setuserid(user_id)
                  localStorage.setItem('user_chit_chat',JSON.stringify({usermode:false,user:nickname,userid:user_id})) 
                } } >Let's Begin</button><br/><br/>
                </div>
               
                <button className="mybtn" onClick={()=>window.location.reload()} >Back To Home</button>
                <p>Create Your Room Share Room-link with your friends to chat with them. </p>
            </div>
        </div>
    )
}

export default CreateUser

import logo from './logo.svg';
import React,{useEffect,useState} from 'react';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import HomePage from './pages/HomePage';

import './App.css';
import ParticleBackground from './ParticleBackground';

function App() {

  // useEffect(() => {
  //  const messaging= firebase.messaging()
  //  //console.log(messaging.getToken())
  //  Notification.requestPermission().then(async()=>{ 
  //   return await messaging.getToken()
  //  }).then((token)=>{
  //     console.log('Token : ',token)
  //  }).catch(()=>{
  //    console.log('error')
  //  })
  // }, [])
  const [endpointdata,setendpointdata]=useState()
  const [newuserjoining,setnewuserjoining]=useState()
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  const publicvabidkey='BA_iFS-s2oI6f4bpNnAZb_9zV-rp3mguKlSOnzHa-1ZX1EggHw7uigyCnsSO9Y7DOrl2mV6ZaRrwx5JdYu2D1_Y'

  useEffect(()=>{
  const subscribe=async()=>{
   
    
      let sw = await navigator.serviceWorker.ready;
      let push = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:urlBase64ToUint8Array(publicvabidkey)
      });
      setendpointdata(push)
      console.log(JSON.stringify(push));
     
 
  }
  subscribe();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      let sw = await navigator.serviceWorker.register('./sw.js',{
        scope:'/'
      });
      console.log(sw);
    });
  }

  },[])
 

  return (
    <div className="App">
     <Router>
     
       <Route path="/" >
       {/* <ParticleBackground /> */}
        <HomePage endpointdata={endpointdata}  />
       </Route>
      
     </Router>
    </div>
  );
}

export default App;

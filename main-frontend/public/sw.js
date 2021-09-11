self.addEventListener('push',function(e){
 const data=e.data.json()
  var options = {
    body: ` Hey ${data.user} You just got a new member ${data.newuser} in your room`,
    icon: 'images/example.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: 'Explore this new world',
        icon: 'images/checkmark.png'},
      {action: 'close', title: 'Close notification',
        icon: 'images/xmark.png'},
    ]
  };
  e.waitUntil(self.registration.showNotification('Alert!!!', options)) 
})  
var socket = io("localhost:3000");

var messages = document.getElementById('chat-messages-container');
var form = document.getElementById('chat-sender');
var message = document.getElementById('message-area');

// If there is any modification from our side then we tell the server
function emitUpdate(){
  socket.emit('update');
}

// Else if the modification comes from the server we update the table
socket.on('update', function() {
  load_games();
});


// If a new message is sent then we tell the server to deliver it
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (message.value) {
    socket.emit('chat message', [message.value,document.getElementById('user').value]);
    message.value = '';
  }
});

// If we receive a new message then we print it
socket.on('chat message', function(msg) {
  if (document.getElementById('message-disclaimer').style.display != "none"){
    document.getElementById('message-disclaimer').style.display = "none";
  }
  var message_container = document.createElement('p');
  message_container.innerText = msg;
  message_container.className = "user-message";
  messages.appendChild(message_container);
});

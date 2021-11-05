let socket=io();

socket.emit('new-user',roomname)

socket.on('user-count',data=>{
    //$('#usercount').text(data.currentUsers + ' users online');
  let message =
    data.name +
    (data.connected ? ' has joined the chat.' : ' has left the chat.');
  $('#messages').append($('<li>').addClass('list-group-item list-group-item-secondary').html('<b>' + message + '</b>'));
   
})

socket.on('chat-message',data=>{
  let message =
    data.name +":"+data.message
  $('#messages').append($('<li>').addClass('list-group-item list-group-item-secondary').html('<b>' + message + '</b>'));
   
})

socket.on('room-created',room=>{
  const roomContainer = document.getElementById('room-container')
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `room/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})


$(document).ready(function(){
    $('#chat-form').submit(()=>{
        const messageToSend=$('#m').val();
        socket.emit('chat-message',roomname, messageToSend);
        $('#m').val('');
        return false;
    })
})
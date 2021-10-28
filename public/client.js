let socket=io();

socket.on('user-count',data=>{
    $('#usercount').text(data.currentUsers + ' users online');
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


$(document).ready(function(){
    $('form').submit(()=>{
        const messageToSend=$('#m').val();
        socket.emit('chat-message', messageToSend);
        $('#m').val('');
        return false;
    })
})
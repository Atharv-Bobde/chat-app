let socket=io();

socket.emit('new-user',roomname)

socket.on('user-count',data=>{
  let t=new Date;
  let min=(t.getMinutes()<10 ? '0':'')+t.getMinutes();
  let hour=(t.getHours()<10 ? '0':'')+t.getHours();
  $('#usercount').text(data.usercount + ' Online');
  let message =
  (data.name==user ? 'You':data.name)  +
    (data.connected ? ' joined the chat.' : ' left the chat.');
  if(data.name==user)
    $('#conversation').append(`<div class="row message-body">
    <div class="col-sm-12 message-main-sender">
      <div class="sender">
        <div class="message-text">
          ${message}
        </div>
        <span class="message-time pull-right">
          ${hour}:${min}
        </span>
      </div>
    </div>
  </div>`)
  //$('#conversation').append($('<div>').addClass('row message-body').append($('<div>').addClass('col-sm-12 message-main-sender').append($('<div>').addClass('sender').append($('<div>').addClass('message-text').html(message)))));
  else
    $('#conversation').append(`<div class="row message-body">
    <div class="col-sm-12 message-main-receiver">
      <div class="receiver">
        <div class="message-text">
          ${message}
        </div>
        <span class="message-time pull-right">
          ${hour}:${min}
        </span>
      </div>
    </div>
    </div>`)
    //$('#conversation').append($('<div>').addClass('row message-body').append($('<div>').addClass('col-sm-12 message-main-receiver').append($('<div>').addClass('receiver').append($('<div>').addClass('message-text').html(message)))));
   
})

socket.on('chat-message',data=>{
  let t=new Date;
  let min=(t.getMinutes()<10 ? '0':'')+t.getMinutes();
  let hour=(t.getHours()<10 ? '0':'')+t.getHours();
  let message =(data.name==user ? 'You':data.name) +": "+data.message;
  if(data.name==user)
    $('#conversation').append(`<div class="row message-body">
    <div class="col-sm-12 message-main-sender">
      <div class="sender">
          <div class="message-text">
            ${message}
          </div>
          <span class="message-time pull-right">
            ${hour}:${min}
          </span>
        </div>
      </div>
    </div>`)
    //$('#conversation').append($('<div>').addClass('row message-body').append($('<div>').addClass('col-sm-12 message-main-sender').append($('<div>').addClass('sender').append($('<div>').addClass('message-text').html(message)))));
  else
    $('#conversation').append(`<div class="row message-body">
    <div class="col-sm-12 message-main-receiver">
      <div class="receiver">
        <div class="message-text">
          ${message}
        </div>
        <span class="message-time pull-right">
          ${hour}:${min}
        </span>
      </div>
    </div>
    </div>`)
    //$('#conversation').append($('<div>').addClass('row message-body').append($('<div>').addClass('col-sm-12 message-main-receiver').append($('<div>').addClass('receiver').append($('<div>').addClass('message-text').html(message)))));
   
})

socket.on('room-created',room=>{
  $('#room-container').append(`<tr class="table-light">
  <td>${room}</td>
  <td><a href="room/${room}">Join</a></td>
</tr>`)
})


$(document).ready(function(){
    $('#chat-form').submit(()=>{
        const messageToSend=$('#m').val();
        socket.emit('chat-message',roomname, messageToSend);
        $('#m').val('');
        return false;
    })
})
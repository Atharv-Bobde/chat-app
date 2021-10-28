const express=require('express');
const app=express();
const myDB=require('./connection');
const routes = require('./routes');
const auth=require('./auth');
const session=require('express-session');
require('dotenv').config();
const PORT=process.env.PORT || 3000;
const passport=require('passport')
const flash=require('connect-flash')
const MongoStore = require('connect-mongo')(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ url: URI });
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const passportSocketIo=require('passport.socketio')
const cookieParser=require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    key:'express.sid',
    store:store
  }));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

io.use(
    passportSocketIo.authorize({
      cookieParser: cookieParser,
      key: 'express.sid',
      secret: process.env.SESSION_SECRET,
      store: store,
      success: onAuthorizeSuccess,
      fail: onAuthorizeFail
    })
  );

app.set('view engine','ejs')

myDB(async client=>{
    const myDataBase=await client.db('chat-app').collection('users');
    routes(app,myDataBase);
    auth(app,myDataBase);
    let usercount=0;
    io.on('connection',socket=>{
        usercount++;
        io.emit('user-count',{currentUsers:usercount,name:socket.request.user.username,connected:true})
        socket.on('disconnect',()=>{
            usercount--;
            io.emit('user-count',{currentUsers:usercount,name:socket.request.user.username,connected:false})
        })
        socket.on('chat-message',message=>{
          io.emit('chat-message',{name:socket.request.user.username,message})
        })
    })
})
.catch(err=>{
    console.log(err)
})

function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');
  
    accept(null, true);
  }
  
  function onAuthorizeFail(data, message, error, accept) {
    if (error) throw new Error(message);
    console.log('failed connection to socket.io:', message);
    accept(null, false);
  }
  

http.listen(PORT,()=>{
    console.log(`your app is listening on port ${PORT}`)
})
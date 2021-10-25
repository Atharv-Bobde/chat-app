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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

app.set('view engine','ejs')

myDB(async client=>{
    const myDataBase=await client.db('chat-app').collection('users');
    routes(app,myDataBase);
    auth(app,myDataBase);
    
})
.catch(err=>{
    console.log(err)
})

app.listen(PORT,()=>{
    console.log(`your app is listening on port ${PORT}`)
})
const passport = require("passport")
const bcrypt=require('bcrypt');
//const { io } = require("socket.io-client");

module.exports=function(app,myDataBase,rooms,io){
    app.route('/').get((req,res)=>{
        res.render('index',{flash:req.flash('error')})
    })
    app.route('/register').post((req,res,next)=>{
        const hash = bcrypt.hashSync(req.body.password, 12);
        myDataBase.findOne({username:req.body.username},(err,user)=>{
            if(err)
                next(err);
            else if(user){
                res.redirect('/');
            }
            else
            {    
                myDataBase.insertOne({
                    username:req.body.username,
                    password:hash
                },(err,doc)=>{
                    if(err)
                        res.redirect('/')
                    else{
                        //console.log(doc.ops)
                        next()
                        
                    }
                })
            }
        })
    },passport.authenticate('local',{failureRedirect:'/'}),(req,res)=>{
        res.redirect('/profile');
    })

    app.route('/login').post(passport.authenticate('local',{failureFlash:true,failureRedirect: '/' }),(req,res)=>{
        res.redirect('/profile')
      })
    
    app.route('/profile').get(ensureAuthenticated, (req,res) => {
    res.render('profile',{username:req.user.username,rooms:rooms});
    });
    /*app.route('/chat').get(ensureAuthenticated,(req,res)=>{
        res.render('chat',{user:req.user});
    })*/
    app.route('/room').post(ensureAuthenticated,(req,res)=>{
        if(rooms[req.body.roomname!=null])
            return res.redirect('/profile');
        rooms[req.body.roomname]={users:{}};
        res.redirect('/room/'+req.body.roomname);
        io.emit('room-created',req.body.roomname);
    })
    app.route('/room/:room').get(ensureAuthenticated,(req,res)=>{
        if(rooms[req.params.room]==null)
            return res.redirect('/profile');
        res.render('chat',{roomname:req.params.room})
    })
    app.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
    });
  
}

function ensureAuthenticated(req,res,next)
{
  if(req.isAuthenticated())
  {
    return next();
  }
  res.redirect('/');
}
const passport = require("passport")
const bcrypt=require('bcrypt');

module.exports=function(app,myDataBase){
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
    res.render('profile',{username:req.user.username});
    });
    app.route('/chat').get(ensureAuthenticated,(req,res)=>{
        res.render('chat',{user:req.user});
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
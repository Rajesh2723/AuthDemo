const express=require('express');
const app=express();
const mongoose=require('mongoose');
const User=require('./models/user');
const bcrypt=require('bcrypt');
const session=require('express-session');
app.set('view engine','ejs');
app.set('views','views');
app.use(express.urlencoded({extended:true}));//to parse the req.body
app.use(session({secret:'notagoodsecret'}));
mongoose.connect('mongodb://localhost:27017/authDemo',{ //connecting mongoDb
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify:false
});
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("DataBase is Connected!!");
})
const requireLogin=(req,res,next)=>{
    if(!req.session.user_id){
       return res.redirect('/login');
    }
    next();
}
app.get('/',(req,res)=>{
    res.send("This is Home page!!");
})
app.get('/register',(req,res)=>{
    res.render('register');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.post('/login',async (req,res)=>{
    const {username,password}=req.body;
   const foundUser=await User.findAndValidate(username,password);
    if(foundUser){
        req.session.user_id=foundUser._id;
        res.redirect('/secret');
    }else{
        res.redirect('/login');
    }
    
})
app.post('/logout',(req,res)=>{
    // req.session.user_id=null;  //session id set to null to logout
    req.session.destroy();
    res.redirect('/login');
})
app.post('/register', async (req,res)=>{
    const {password,username}=req.body;
    const hash=await bcrypt.hash(password,12);//12 times it computes
    const user=new User({
        username,
        password:hash
    })
    await user.save();
    req.session.user_id=user._id;
    res.redirect('/');
})
app.get('/secret',requireLogin,(req,res)=>{
    // if(!req.session.user_id){
    //   return  res.redirect('/login'); //if session id is not set then redirects to login
    // }
    res.render('secret');
})
app.get('/topsecret',requireLogin,(req,res)=>{
    res.send("TOP SECRET BRO!!");
})
app.listen(3000,()=>{
    console.log("Serving at 3000 port !!");
})
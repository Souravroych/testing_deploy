const router = require('express').Router();
const User = require('../model/User');
const Feeds = require('../model/Feeds');
const Comments = require('../model/Comments');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {firstLoginValidation, registerValidation, loginValidation} = require('../validation');
const session = require('express-session');

var currentUserName = "admin"; // default [temporary]
var currentUserData;

router.use(session(
    {secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true,
    cookie: {secure: true}
    }));
router.use(bodyParser.urlencoded({extended: true}));

// var cart = [{postBody: req.body.myTextarea}];
var sess;

async function getAllPosts() {
    var allPosts = await Feeds.find({});
    allPosts.sort(function(a, b) {return b["timestamp"]-a["timestamp"]});

    //console.logle.log("Getting Comments");
    for(var curPost = 0; curPost<allPosts.length; curPost++) {
        var feedComments = await getAllComments(allPosts[curPost]["_id"]);
        allPosts[curPost].comments = feedComments;
    }

    return allPosts;
}

async function getAllComments(feedId) {
    var allComments = await Comments.find({feedId: feedId});
    allComments.sort(function(a, b) {return b["timestamp"]-a["timestamp"]});
    return allComments;
}
// ////old
// router.post('/idlogin', async (req, res) => {
//     // //console.logle.log("Request body: ", req.body);

//     // sess = req.session;
//     // sess.body = req.body;
//     //console.logle.log('Session initialized');


//     const { error } = firstLoginValidation(req.body);
//     //console.logle.log('Session Checking');
//     if(error) return res.status(400).send(error.details[0].message);

    
//     const user = await User.findOne({username: req.body.username});
//     if(!user) return res.status(400).send('ID code not found!');

//     currentUserName = user.name;
//     currentUserData = {username: user.name, name: user.name, bio: user.bio};

//     //CREATE A TOKEN
//     // const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
//     // res.header('auth_token', token).send(token);

//     // Get All posts
//     var posts = await getAllPosts();
//     userPosts = [currentUserData].concat(posts);
//     res.render('../views/feeds_page',{posts:userPosts});
// });

router.post('/idlogin', async (req, res) => {
    // //console.logle.log("Request body: ", req.body);

    sess = req.session;
    sess.body = req.body;
	
	
    //console.logle.log('Session initialized');


    const { error } = firstLoginValidation(req.body);
    //console.logle.log('Session Checking');
    if(error) return res.status(400).send(error.details[0].message);

  
	
	
    const user = await User.findOne({username: req.body.idcode});
	
	const salt = user.salt;
	//console.logle.log(user,"klkl");
	
	// const pass1=await bcrypt.hash(req.body.pass, salt);
	//  if(!user) return res.status(400).send('ID code not found!');
	//  //console.logle.log(pass1);
	//  //console.logle.log(user.password);
	// if(user.password.toString() === pass1.toString())
	
		
    currentUserName = user.username;

    //console.logle.log(user.connection + ' ..........................................')

    currentUserData = {username: user.username, name: user.name, bio: user.bio, location:user.location, connection:user.connection};
    
     
    //console.logle.log("hghg", currentUserData);
	var map=new Map();  // only because unsued variables are part of humanity!
	
	////console.logle.log(map);
	
	//console.logle.log(map.has('5e2b3564e2b3124f1bbd9f4e'));
    //CREATE A TOKEN
    // const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    // res.header('auth_token', token).send(token);

    // Get All posts
    var posts = await getAllPosts();
    userPosts = [currentUserData].concat(posts);
    //console.logle.log("hjhjhj",userPosts);
    
	
    res.render('../views/feeds_page',{posts:userPosts,map:map,user1:user});
		
	
		
	// else{
	// return res.status(400).send('userid/password  not correct!');	
		
	// }
   

});
// //POST for feeds page --> Post something
// router.post('/feedPost', async (req, res) => {
//     //console.logle.log("Button clicked from user", currentUserName);

//     let { feedId } = req.query;

//     if(feedId) {
//         //console.logle.log(feedId, "comment: ", req.body.comment)
//         const newComment = new Comments({
//             feedId: feedId,
//             author: currentUserName,
//             body: req.body.comment
//         });
//         try {
//             await newComment.save();
//         }catch(err){
//             res.status(400).send(err);
//         }
//     }
//     else {
//         var receiverName = currentUserName;
//         if(req.body.receiver != "") {
//             const user = await User.findOne({idcode: req.body.receiver});
//             if(!user) return res.status(400).send('Receiver not found!');
//             receiverName = user.name;
//         }

//         const newFeed = new Feeds({
//             author: currentUserName,
//             receiver: receiverName,
//             body: req.body.body
//         });
//         try {
//             await newFeed.save();
//         }catch(err){
//             res.status(400).send(err);
//         }
//     }

//     //console.logle.log('On feeds page');
//     var posts = await getAllPosts();

//     userPosts = [currentUserData].concat(posts);
//     res.render('../views/feeds_page',{posts:userPosts});
// });

//POST for feeds page --> Post something


router.post('/feedPost', async (req, res) => {
    //console.logle.log("Button clicked from user", currentUserName);
    //console.logle.log(req.query,"uiuiui");

    
    let { feedId } = req.query;

    if(feedId) {
        console.log("Comment: ", feedId);
		
		if(req.body.comment)
		{
		
        //console.logle.log(feedId, "comment: ", req.body.comment);
        //console.logle.log("okoko",);
        //console.logle.log("pppp");
        const newComment = new Comments({
            feedId: feedId,
            author: currentUserName,
            body: req.body.comment
        });
        try {
            await newComment.save();
        }catch(err){
            res.status(400).send(err);
        }
		}
        if(req.body.like)
		{
            //console.logle.log("like clicked");
            ////console.logle.log("newton 1111")
            
			   const newlikes = new Like({
            username: currentUserName,
            receiver: req.body.receiver,
            post_id: feedId
        });
                   await newlikes.save();
                   //console.logle.log("sss test")
		}
		if(req.body.retweet)
		{
            //console.logle.log("retweet clicked");
			 var receiverName = currentUserName;
             
            if(req.body.receiver != "") {
                const user = await User.findOne({username: req.body.receiver});
                if(!user) return res.status(400).send('Receiver not found!');
                receiverName = user.username;
            }       

            currentFeed = await Feeds.findById(feedId);
            currentFeed.count++;
            await currentFeed.save();
			
        const newFeed = new Feeds({
            author: currentUserName,
            receiver: receiverName,
            body: req.body.body,
            count:0,
            love_count:0
        });
        
        await newFeed.save();
        }
            

		if(req.body.edit)
		{
			//console.logle.log("edit clicked");
        }
        
		if(req.body.love)
		{   
            currentFeed = await Feeds.findById(feedId);
            currentFeed.love_count++;
            await currentFeed.save();

			//console.logle.log("love clicked");
		}
    }
    else {
        //console.logle.log("newton");
        var receiverName = currentUserName;
        if(req.body.receiver != "") {
            const user = await User.findOne({username: req.body.receiver});
            console.log(user,"ijiji");
            if(!user) return res.status(400).send('Receiver not found!');
            receiverName = user.name;
        }
        //console.logle.log("lplplp");
        const newFeed = new Feeds({
            author: currentUserName,
            receiver: receiverName,
            body: req.body.body,
            count:0,
            love_count:0
        });

        try {
            await newFeed.save();
        }catch(err){
            res.status(400).send(err);
        }
    }

    //console.logle.log('On feeds page');
    var posts = await getAllPosts();
    //console.logle.log(posts,"oiooioi")

    userPosts = [currentUserData].concat(posts);
    //console.logle.log("yyy",userPosts);
    res.render('../views/feeds_page',{posts:userPosts});
});

router.post('/profile', async (req, res) => {
    //VALIDATE BEFORE CREATE

     sess = req.session;
    //console.logle.log('Session signup');
     sess.body = req.body;
    //console.logle.log("Request body : ",req.body);


    //const {error} = registerValidation(sess.body);
    //if(error) return res.status(400).send(error.details[0].message);

    //Check if user already in DB
    //console.logle.log('Find User');
    const emailExists = await User.findOne({username: sess.body['username']});
    if(emailExists) return res.status(400).send('Email already exists!');

    //HASH PASSWORD
    //console.logle.log('Hash Pass');
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(sess.body.password, salt);
    //console.logle.log("iiii",req.body);

    //CREATE A NEW USER
    const user = new User({
        name: req.body['name'],
        username: req.body['username'],
        email: req.body['email'],
        location: req.body['location'],
        password: hashPassword,
        bio: req.body['bio']
    });
    try {
        const savedUser = await user.save();
        //console.logle.log("yyyy",savedUser);
        
        res.send({user: user._id});

    }catch(err){

        res.status(400).send(err);
    }
});


router.post('/retweet', async(req,res)=>{


}

)

//LOGIN
router.post('/login', async (req, res) => {
    //VALIDATE BEFORE CREATE
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    //Check if email is correct
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email not found!');

    //check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password')

    //CREATE A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth_token', token).send(token);

    res.send('Logged in!');
});

router.get('/logout', function logout(req, res) {
    //console.logle.log('Logout clicked');
    res.redirect('/idlogin');
});
router.post('/profile', async (req, res) => {
    //VALIDATE BEFORE CREATE

     sess = req.session;
    //console.logle.log('Session signup');
     sess.body = req.body;
    //console.logle.log("Request body : ",req.body);
	

    //const {error} = registerValidation(sess.body);
    //if(error) return res.status(400).send(error.details[0].message);

    //Check if user already in DB
    //console.logle.log('Find User');
    const emailExists = await User.findOne({username: sess.body['username']});
    if(emailExists) return res.status(400).send('Email already exists!');

    //HASH PASSWORD
    //console.logle.log('Hash Pass');
	
		
	const salt = await bcrypt.genSalt(10);
    
    const hashPassword = await bcrypt.hash(sess.body.password, salt);

    //CREATE A NEW USER
    const user = new User({
        name: req.body['name'],
        username: req.body['username'],
        email: req.body['email'],
		salt:salt,
        password: hashPassword,
        bio: req.body['bio']
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});

    }catch(err){
        res.status(400).send(err);
    }
});



// router.post('/login');

module.exports = router;

const express = require('express');
const router = express.Router();
const stripe = require("stripe")('sk_test_DKK9B8vDDO2VjewUYB7pkuUt00R6nEVqP0');
const uuid = require("uuid/v4");
const nodemailer = require('nodemailer');


/* setting DB path  */
const FlowerModel = require('../models/flowers');
const UserModel = require('../models/users');
const ChatModel = require('../models/chats');

function saveChat(res,data) {

	if(data.hot === 'yes'){
		data['hot'] = true
	}
	ChatModel.insertMany({ 	
        id: data.id,
        src: data.src,
        chatName: data.chatName, 
        adminName:  data.adminName,
        adminEmail: data.adminEmail,
        adminPhone: data.adminPhone,
        isOpen: data.isOpen,
        isPrivate: data.isPrivate,
        status: data.status,
        history:[],
        users:[]	
    }).then(() => res.json({
        'isRegisteredSuccesfully':true,
        'error' : 'The request was written in our system'
    })).catch(() => res.json({
        'isRegisteredSuccesfully':false,
        'error' : 'there is problem in our DB servers please try later'
    }))
}

/*>>>>>>>>>>>>>>>>>>>>>>>>>>subscribers<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
//subscribers call this to create a new chat
router.post('/createNewChat', function (req, res) {

    ChatModel.find().then(function (resultArry){
        var data = req.body
        var id = (Math.max.apply(null, resultArry.map(function(x){ return x.id}))+1).toString()
        data['id'] = id.toString()
        
        var name = data.name

        var root = __dirname.substring(0, __dirname.lastIndexOf("\\") + 1)

        if (resultArry.some(x => x.name === name)) {
            res.json({
                'error' : "this name was already taken",
                'isRegisteredSuccesfully' : false
            });
            return;
        }
        else {
            // maybe i should check also about req.files.upfile, but i dont think it necessary
            if (req.files) {
                console.log("try to upload file");
                var file = req.files.file, name = file.name;
                uploadpath = root + 'public/images/chats/' + name;
                file.mv(uploadpath, function (err) {
                    data ['src'] = "images/chats/" + name;
                    if (err) {
                        console.log("File Upload Failed", name, err);
                        res.send("Error Occured!, image issue")
                        return;
                    }
                    else {
                        console.log("File Uploaded", name);
                        saveChat(res, data);
                        return;
                    }
                });
            }
            else {
                console.log("try to upload url");
                dest = root + 'public/images/chats/';
                if (req.body.image_url != "") {
                    var _data = { url: req.body.image_url, dest: root + 'public/images/chats/' }
                    download.image(_data).then(({ filename }) => {
                        data ['src'] = "images/chats/" + filename.substring(filename.lastIndexOf("\\") + 1, filename.length);
                        saveChat(res, data);
                        return;
                        }).catch(() => {
                        res.send("Error Occured!, image issue")
                        return ;
                    });
                }
                else saveChat(res, data);
            }
        };
    });

})

//subscribers call this to see their chats
router.get('/chatsList', function (req, res) {
    var user = req.user
    ChatModel.find()
    .then(data => data.filter(item => item.status === 'confirmed'))
    .then(data => data.filter(item => item.users.some(x => x.name === user.name)))
    .then(chats => res.send(chats))

})

//subscribers call this to see other chats
router.get('/otherChatsList', function (req, res) {
    var user = req.user
    ChatModel.find()
    .then(data => data.filter(item => item.status === 'confirmed'))
    .then(data => data.filter(item => item.isPrivate === 'no'))
    .then(data => data.filter(item => !item.users.some(x => x.name === user.name)))
    .then(chats => res.send(chats))

})

//subscribers call this to see other chats with password
router.get('/otherChatsWithPasswordList', function (req, res) {
    var user = req.user
    ChatModel.find()
    .then(data => data.filter(item => item.status === 'confirmed'))
    .then(data => data.filter(item => item.isPrivate === 'yes'))
    .then(data => data.filter(item => !item.users.some(x => x.name === user.name)))
    .then(chats => res.send(chats))

})

//subscribers call this to leave a chat channel
router.post('/leaveChat', function (req, res) {

    var id = req.body.id
    var user = req.user
    ChatModel.find({id})
    .then(data => data[0])
    .then( async(chat) => {
        await chat.users.pull(user._id)
        await ChatModel.findOneAndUpdate({id},{users: chat.users})
    })
    .then(() => res.json({'isLeavedSuccesfully':true, 'message' : 'You leaved this chat now'}))
    .catch(() => res.json({'isLeavedSuccesfully':false, 'message' : 'There is an error please tell the IT guy'}))

})

//subscribers call this to leave a chat channel
router.post('/sendRequestToJoinChat', async function (req, res) {

    var user = req.user
    var id = req.body.id
    var chat = await ChatModel.find({id})[0];

    const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: `${process.env.email_user_name}`,
			pass: `${process.env.email_password}`,
		},
		});
    
        const mailOptions = {
            to: chat.adminEmail,
            subject: 'Reaquest to join to your chat channel',
            text:
                `hello ${chat.adminName}, my name is ${user.name} and i want to join to your channel named: ${chat.name}\n\n
                please email me an invation code to my email: ${user.email}`,
        };
    
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('there was an error: ', err);
                res.json({'isJoinedSuccesfully':false, 'message' : 'You are already in sined to this chat,\nplease refresh the browser'})
            } else {
                res.json({'isJoinedSuccesfully':true, 'message' : 'You succesfuly joined to the chat'})
            }
        })

})

//subscribers call this to join to an open chat channel
router.post('/joinChat', function (req, res) {

    var id = req.body.id
    var user = req.user
    ChatModel.find({id})
    .then(data => data[0])//data[0] because, find return array of chats and i want only the first
    .then( (chat) => {
    var index = chat.users.findIndex(x => x.name === user.name)
    if(index !== -1){
        //so you are already in this chat...
        res.json({'isJoinedSuccesfully':false, 'message' : 'You are already in sined to this chat,\nplease refresh the browser'})
    }
    else if (chat.isOpen === 'false' || chat.isPrivate === 'true') {
        //so you have no permission to join to this chat...
        res.json({'isJoinedSuccesfully':false, 'message' : 'You have no permission to join to this chat'})        
    }
    else{
        //so you want to join
        ChatModel.find({id})
        .then(data => data[0])
        .then(data => ChatModel.findOneAndUpdate({id},{'users': [...data.users,user]}))
        .then(()=>res.json({'isJoinedSuccesfully':true, 'message' : 'You succesfuly joined to the chat'}))
        .catch(()=>res.json({'isJoinedSuccesfully':false, 'message' : 'You are already in sined to this chat,\nplease refresh the browser'}))
    }
    })
})

//subscribers call this to join to an open chat channel
router.post('/joinToCloseChat', function (req, res) {

    var id = req.body.id
    var token = req.body.token
    var user = req.user
    ChatModel.find({id})
    .then(data => data[0])//data[0] because, find return array of chats and i want only the first
    .then( (chat) => {
    var index = chat.users.findIndex(x => x.name === user.name)
    if(index !== -1){
        //so you are already in this chat...
        res.json({'isJoinedSuccesfully':false, 'message' : 'You are already in sined to this chat,\nplease refresh the browser'})
        return
    }
    else if (chat.isPrivate === 'true') {
        //so you have no permission to join to this chat...
        res.json({'isJoinedSuccesfully':false, 'message' : 'You have no permission to join to this chat'})        
        return
    }
    else{
        if (chat.generatedToken !== token) {
            res.json({'isJoinedSuccesfully':false, 'message' : 'You have wrong token'})        
            return
        }
        //so you want to join
        ChatModel.find({id})
        .then(data => data[0])
        .then(data => ChatModel.findOneAndUpdate({id},{'users': [...data.users,user]}))
        .then(()=>res.json({'isJoinedSuccesfully':true, 'message' : 'You succesfuly joined to the chat'}))
        .catch(()=>res.json({'isJoinedSuccesfully':false, 'message' : 'You are already in sined to this chat,\nplease refresh the browser'}))
    }
    })
})

/*>>>>>>>>>>>>>>>>>>>>>>>>>>chat manager<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

//chat manager call this to see their managed chats
router.get('/managedChatsList', function (req, res) {
    var user = req.user
    ChatModel.find()
    .then(data => data.filter(item => item.adminName === user.name))
    .then(chats => res.send(chats))

})

//chat manager call this to delete user from chat
router.post('/deleteUser', async function (req, res) {

    var id = req.body.chatID
    var name = req.body.userName
    var user = await UserModel.find({name})
    user = user[0]
    ChatModel.find({id})
    .then(data => data[0])
    .then( async(chat) => {
        await chat.users.pull(user._id)
        await ChatModel.findOneAndUpdate({id},{users: chat.users})
    })
    .then(() => res.json({'isLeavedSuccesfully':true, 'message' : 'You kiked this guy out'}))
    .catch(() => res.json({'isLeavedSuccesfully':false, 'message' : 'There is an error please tell the IT guy'}))

})



/*>>>>>>>>>>>>>>>>>>>>>>>>>>admin<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
//admin call this see to new...
router.get('/newOpenChatRequestsList', function (req, res) {

    var user = req.user
    if(user.role !== 'admin'){
        res.send('hacker...')
        return
    }
        
    ChatModel.find()
    .then(data => data.filter(item => item.status === 'unconfirmed'))
    .then(chats => res.send(chats))
})

//admin call this to see all the chats
router.get('/existingChatRoomsList', function (req, res) {

    var user = req.user
    if(user.role !== 'admin'){
        res.send('hacker...')
        return
    }
        
    ChatModel.find()
    .then(data => data.filter(item => item.status === 'confirmed'))
    .then(chats => res.send(chats))
})

//admin call this to accept a new chat
router.post('/acceptChat', function (req, res) {

    var id = req.body.id
    ChatModel.findOneAndUpdate({id},{'status' : "confirmed"})
    .then(() => res.json({'isConfirmedSuccesfully':true, 'message' : 'The chat is confirmed now'}))
    .catch(() => res.json({'isConfirmedSuccesfully':false, 'message' : 'There is an error please tell the IT guy'}))

})

//admin call this to deny a new chat
router.post('/denyChat', function (req, res) {

    var id = req.body.id
    ChatModel.findOneAndUpdate({id},{'status' : "denyed"})
    .then(() => res.json({'isDenyedSuccesfully':true, 'message' : 'The chat is denyed now'}))
    .catch(() => res.json({'isDenyedSuccesfully':false, 'message' : 'There is an error please tell the IT guy'}))

})

//admin call this to delete  an existing chat
router.post('/deleteChat', function (req, res) {

    var id = req.body.id
    ChatModel.findOneAndUpdate({id},{'status' : "deleted"})
    .then(() => res.json({'isDeletedSuccesfully':true, 'message' : 'The chat is deleted now'}))
    .catch(() => res.json({'isDeletedSuccesfully':false, 'message' : 'There is an error please tell the IT guy'}))

})

//admin call this to see chat member list an existing chat
router.post('/showChatMemberList', function (req, res) {

    var id = req.body.id
    ChatModel.find({id})
    .then(data => { var x = [...data[0].users]
        res.json(x)})
    .catch(() => res.json({'isAccesingSuccesfully':false, 'message' : 'There is an error please tell the IT guy'}))

})

/*>>>>>>>>>>>>>>>>>>>>>>>>>>general porpose<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
//i need this in order to get chat details
router.post('/getChatByID', function (req, res) {

    var id = req.body.id
    ChatModel.find({id})
    .then(data => res.json(data))
    .catch(() => res.json({'isAccesingSuccesfully':false, 'message' : 'There is an error please tell the IT guy'}))

})



module.exports = router;
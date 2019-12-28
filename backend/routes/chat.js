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
        name: data.name, 
        adminName:  data.adminName,
        adminEmail: data.adminEmail,
        adminPhone: data.adminPhone,
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

module.exports = router;
const express = require('express');
const router = express.Router();
const download = require('image-downloader')
const rsa = require('Node-RSA')
const nodemailer = require('nodemailer');
const crypto = require('crypto');


/* setting DB path  */
const FlowerModel = require('../models/flowers');
const UserModel = require('../models/users');
const BranchModel = require('../models/branches');

//users CRUD
	router.post('/create_user', function (req, res) {
		var _root = __dirname.substring(0, __dirname.lastIndexOf("\\") + 1)
		var data = req.body
		
		var decrypted = key.decrypt(data.password, 'utf8')
		var pass = decrypted.substring(0, decrypted.length - 1);
		
		//need to delete next line because i dont want to save the pwd as plain text
		data['pwd']=pass
		
		//it would be more efficiant if i was reaplacing this two mongodb methods
		UserModel.find().then(function (resultArry){
			return (Math.max.apply(null,resultArry.map(function(x){ return x.id}))+1).toString()
		}).then(function(next_id){
			UserModel.findOne({ name: data.name }).then(async function (_user) {
				data['id']=next_id.toString()
				if (_user) 
				{
					console.log("try different username");
					res.send("try different username, this one was already taken");
				}
				else{//if this name is new(good)
					if(req.files)
					{
						var file = req.files.file, name = file.name
						console.log("try to upload file");
						uploadpath = _root + 'public/images/' + name;
						file.mv(uploadpath).then(async function (err) {
							if (err) {
								console.log("File Upload Failed", name, err);
								data['src'] = "images/err";
								console.log('לא הצליח להעלות תמונה');
								console.log('this should be 1')
								let response = await _register(data,pass)
								console.log(response);
								console.log('this should be 4')
								if(response == "registered"){
									res.send("Error Occured in image uploading! but don't worry your other data won't lost")
								}
								else res.send("Error Occured! non of your data was saved") 						
							}
							else {
								console.log("File Uploaded", name);
								data['src'] = "images/" + name;
								console.log('הצליח להעלות את התמונה');
								console.log('this should be 1')
								let response = await _register(data,pass)
								console.log(response);
								console.log('this should be 4')
								if(response == "registered"){
									res.send("The registration accomplished successfully")
								}
								else res.send("Error Occured! non of your data was saved") 						
							}
						})
					}
					else 
					{
						if(data.image_url!=""){
							dest = _root + 'public/images/';
							var _data = { url: data.image_url, dest: dest }
							download.image(_data).then(async function({filename,l}){
								data['src'] = "images/" + filename.substring(filename.lastIndexOf("\\") + 1, filename.length)
								console.log('this should be 1')
								let response = await _register(data,pass)
								console.log('this should be 4')
								console.log(response);
								if(response == "registered"){
									res.send("The registration accomplished successfully")
								}
								else res.send("Error Occured! non of your data was saved") 						
							})
						}
						else{ 	
							console.log('this should be 1')
							try {
							let response = await _register(data,pass)
							console.log('this should be 4')
							console.log('response:');
							console.log(response);
							if(response == "registered"){
								res.send("The registration accomplished successfully")
							}
							else res.send(response.message) 				
							} catch (error) {
								console.log("error:")
								console.log(error)
								res.send("וולאק חרא") 		
							}
										
						}
					}
				} 
			})
		})
	})
	
	router.get('/read_list', function (req, res) {
		var user = req.user
		if(user){
			var name = user.name
			UserModel.find().sort({ id: 1 }).then(function (arry) {
				UserModel.findOne({'name': name}).then(function (_user) {
					if(_user){
						arry.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
						res.render('generate_users', { users: arry, role: _user.role});
					}
					else{
						res.send("Do you think you are hacker?\n"+
						"Maybe sucker, otherwise ask the admin for help\n"+
						"you are not registered\n"+
						"router.get('/logOut', function (req, res)")					}
				})
			})
		}
		else{
			res.send("Do you think you are hacker?\n"+
					"Maybe sucker, otherwise ask the admin for help\n"+
					"you are not loged\n"+
					"router.get('/logOut', function (req, res)")
		}
	});

	router.get('/unothorized_read_list', function (req, res) {
			UserModel.find().sort({ id: 1 }).then(function (arry) {
						arry.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
						console.log('arry sent');
						res.send(arry);
			});
	})



	router.post('/update_user', async function (req, res) 
	{
		if (!req.user) {//need to debug this
			res.redirect('/')
		}
		var data = req.body
		
		var decrypted = key.decrypt(data.password, 'utf8')
		var pass = decrypted.substring(0, decrypted.length - 1);
		
		//need to delete next line because i dont want to save the pwd as plain text
		data['pwd']=pass

		const _user = await UserModel.findOne({ name: data.name });
		`with an unknown reason {name: data.name} doesn't jumping an error, it supose to be {'name': data.name}`
		if (_user) {
			//ok maybe you dont want to change your name
			if (data.id == _user.id.toString()) {
				//you dind't changed your name
				console.log('this should be 1');
				let response = await _update(data, pass);
				console.log('this should be 4');
				if (response == "updated") {
					res.send("הצליח לעדכן את הבחור עם אותו השם");
				}
				else
					res.send("Error Occured! non of your data was updated");
			}
			else {
				console.log("try different username");
				res.send("try different username, this one was already taken");
			}
		}
		else {
			//if this name is new
			console.log('this should be 1');
			let response = await _update(data, pass);
			console.log('this should be 4');
			if (response == "updated") {
				res.send("הצליח לעדכן את הבחור עם שם חדש");
			}
			else
				res.send("Error Occured! non of your data was updated");
		}
	})

	router.post('/edit_user', async function (req, res) 
	{
		var user = req.user
		if (!user) {//need to debug this
			res.send('redirect')
		}
		else{
			var data = req.body
			
			//need to delete next line because i dont want to save the pwd as plain text
			data['id']=user.id//patch

			const _user = await UserModel.findOne({ name: data.name });
			`with an unknown reason {name: data.name} doesn't jumping an error, it supose to be {'name': data.name}`
			if (_user) {
				//ok maybe you dont want to change your name
				if (data.id == _user.id.toString()) {
					//you dind't changed your name
					console.log('this should be 1');
					let response = await _minimal_update(data,req);
					console.log('this should be 4');
					if (response == "updated") {
						res.send("כל הכבוד הצלחת לשנות אתה פרטים שלך");
					}
					else
						res.send("Error Occured! non of your data was updated");
				}
				else {
					console.log("try different username");
					res.send("try different username, this one was already taken");
				}
			}
			else {
				//if this name is new
				console.log('this should be 1');
				let response = await _minimal_update(data,req);
				console.log('this should be 4');
				if (response == "updated") {
					res.send("כל הכבוד הצלחת לשנות אתה פרטים שלך");
				}
				else
					res.send("Error Occured! non of your data was updated");
			}
		}
	})

	router.get('/reset', async function (req, res) 
	{
		console.log('i am here');
		var token = req.query.token
		
		const _user = await UserModel.findOne({ 'resetPasswordToken': token });
		if (_user) {
			//ok lets check if your token is still validate
			if (Date.now() < _user.resetPasswordExpires){
				res.render('reset_password_view', {token : token})
			} 
			else {
				res.send("your reset link was expired")
			}
		}
		else {
			//if not, you have wrong token
			res.send("Error Occured! it seemed that you have wrong link");
		}
	})

	router.post('/reset_user_password', async function (req, res) 
	{
		var data = req.body
		
		var decrypted = key.decrypt(data.password, 'utf8')
		var pass = decrypted.substring(0, decrypted.length - 1);
		
		//need to delete next line because i dont want to save the pwd as plain text
		data['pwd']=pass

		const _user = await UserModel.findOne({ 'resetPasswordToken': data.token });
		if (_user) {
			//ok lets check if your token is still validate
			if (Date.now() < _user.resetPasswordExpires){
				await _user.update({'pwd':pass})
				await _user.setPassword(pass)
				await _user.save()
				res.send("הצליח לשנות לבחור את הסיסמא");
			} 
			else {
				res.send("your reset link was expired")
			}
		}
		else {
			//if not, you have wrong token
			res.send(`Error Occured! it seemed that you have wrong link
			\nbut the only option can be if you change the token in debugger mode`);
		}
	})

	router.get('/delete_user', function (req, res) {
		if(!req.user)//if there is no one logged in
			res.send("Do you think you are hacker?\n"+
			"Maybe sucker, otherwise ask the admin for help\n"+
			"there is not user with this id\n"+
			"router.get('/delete_user', function (req, res)")	
		else{
			UserModel.findOne({'name': req.user.name}).then(function (_user) {
				if(_user&&(_user.role=="admin"||_user.role=="worker")){//if you are not registered
					try {//search the and try to update our guy
						// UserModel.findOne({ id: req.query.id })
						// UserModel.findOne({ id: req.query.id.toString() })
						UserModel.findOneAndUpdate({ id: Number(req.query.id) }, { status: "deleted" }, { new: true })
							.then(function (tt) {
								UserModel.find().sort({ id: 1 }).then(function (resultArry) {
									res.render('generate_users', { users: resultArry, role: req.user.role});
								});
							});
					} catch (error) {//if you try to delete someone which isn't registered
						console.log(error)
						res.send("Do you think you are hacker?\n"+
						"Maybe sucker, otherwise ask the admin for help\n"+
						"there is not user with this id\n"+
						"router.get('/delete_user', function (req, res)")
					}
				}
				else{//if you aren't logged in
					res.send("Do you think you are hacker?\n"+
					"Maybe sucker, otherwise ask the admin for help\n"+
					"there is not user with this id\n"+
					"router.get('/delete_user', function (req, res)")		
				}
			})
		}
	})


	function _update(data,pass){
		console.log('this should be 2');
		try {
			return UserModel.findOneAndUpdate(	{'id':data.id},
												{'name':data.name
												,'username':data.name
												,'role':data.role
												,'pwd':data.pwd
												,'status':data.status})
			.then(function(){
				return 	UserModel.findOne({'id':data.id}).then(async function(x){
						console.log('this should be 3');		
						await x.setPassword(pass)
						await x.save()
						return "updated"
						})
			})
		} catch (error) {
			console.error();
			return "not updated"
		}
	}

	function _minimal_update(data,req){
		console.log('this should be 2');
		try {
			return UserModel.findOneAndUpdate(	{'id':data.id},
												{'name':data.name
												,'username':data.name
												,'status':data.status})
			.then(function(){
				return UserModel.findOne({'id':data.id})
			}).then(async function(user) {
						await req.login(user,function(err){
							if (err){
								return err
							}
							return "updated"
						})
						return "updated"
				}) 
		} catch (error) {
			console.error();
			return "not updated"
		}
	}

	function _register(data,pass){
		console.log('this should be 2');
			return UserModel.register(data, pass).then(function(user, err) {
				console.log('this should be 3');
				if(user){
					console.log("user:")
					console.log(user)
					return "registered"
				}
				if(err){
					return err
				}
				console.log("this souldn't be printed :(")
			}).catch( function(error) {
		console.log('error:')	
		console.log(error)	
		return error
		})
	}

module.exports = router;

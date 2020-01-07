const express = require('express');
const router = express.Router();
const stripe = require("stripe")('sk_test_DKK9B8vDDO2VjewUYB7pkuUt00R6nEVqP0');
const uuid = require("uuid/v4");
const nodemailer = require('nodemailer');
const rsa = require('Node-RSA')
const crypto = require('crypto');


// const io = require('../app');


/* setting DB path  */
const FlowerModel = require('../models/flowers');
const UserModel = require('../models/users');


const key = new rsa({ b: 512 })
const pk = key.exportKey(['public'])


/* general purpose http methods */
//GET
{
	
	router.post('/getMyLastOrders', function (req, res) {
		var user = req.user
		if(user.role !== 'subscriber'){
			res.send('i am not subscriber')
			return;
		}
		stripe.charges.list(
		// {customer : user.email},
		// user.name,
		{limit : 100},
		function(err,orders){
			var lastOrders = [];
			var filtered = orders.data.filter(x => x.receipt_email === user.email )
			filtered.forEach(element => {
				lastOrders.push({	date: new Date(element.created*1000),
									amount : element.amount,
									description : element.description
								})
			});
			res.send(lastOrders.slice(0,5));
		})
	});
	

	router.post('/getHisLastOrders', async function (req, res) {

		var user = await UserModel.findOne({id:req.body.id})
		var email = user.email;
		if(user.role !== 'subscriber'){
				res.send('this budyy is not subscriber')
				return;
			}

		stripe.charges.list(
		{limit : 100},
		function(err,orders){
			var lastOrders = [];
			var filtered = orders.data.filter(x => x.receipt_email === email )
			filtered.forEach(element => {
				lastOrders.push({	date: new Date(element.created*1000),
									amount : element.amount,
									description : element.description
								})
			});
			res.send(lastOrders.slice(0,5));
		})
	});
	

	router.get('/get_the_next_id', function (req, res) {
	UserModel.find().then(function (resultArry){
		return Math.max.apply(null,resultArry.map(function(x){ return x.id}))+1
	}).then(respon => res.send(respon.toString()) )
	});

	router.get('/get_PK_and_random', function (req, res) {
		// res.setHeader("Access-Control-Allow-Origin", "*")
		
		//generate nuber between 0 to nine.
		var rn = Math.floor(Math.random() * 10)
		// res.send(rn);
		res.send({ "pk": pk, "rn": rn });
	});
	
	router.get('/get_minimal_user_data', function (req, res) {
		console.log("router.get('/get_minimal_user_data', function (req, res) {")
		//generate nuber between 0 to nine.
		let user = req.user
		res.send({ "name": user.name, "id": user.id, "status": user.status });
	});
	
	// List of item categories.
	const categories = [
		{
		name: "All colors",
		},
		{
		name: "pink flowers",
		},
		{
		name: "white flowers",
		},
		{
		name: "red flowers",
		}
	];

	router.get('/menuData', function (req, res) {
		let menuData = [
			{ type: "item", name: "Home page", url: "/", id: 0, icon: "fas fa-home" },
			{ type: "title", name: "Product categories", id: 1 }
		];
		
		let initialLength = menuData.length;
		
		menuData = menuData.concat(
			categories.map((x, i) => {
				return {
					name: x.name,
					url: "/search/?category=" + x.name,
					id: initialLength + i,
					type: "item",
					parentID: 1,
					icon: x.icon
				};
			})
		);
		
		res.json(menuData);
		
	});

	router.get('/menuWarehouseData', function (req, res) {
		let menuData = [
			{ type: "item", name: "Home page", url: "/", id: 0, icon: "fas fa-home" },
			{ type: "title", name: "Product categories", id: 1 }
		];
		
		let initialLength = menuData.length;
		
		menuData = menuData.concat(
			categories.map((x, i) => {
				return {
					name: x.name,
					url: "/flower_CRUD/?category=" + x.name,
					id: initialLength + i,
					type: "item",
					parentID: 1,
					icon: x.icon
				};
			})
		);
		
		res.json(menuData);
		
	});

	router.get('/filterData', function (req, res) {
		res.json(categories);
		
	});
	
	
	router.get('/logOut', function (req, res) {
	var user = req.user
	if(user){
		var name = user.name
		UserModel.findOne({'name': name}).then(function (_user) {
			if(_user){//i think that this check is unnecessary
				console.log(_user.name + " is logging out")
				req.logout()
				res.send(false);
			}
			else{
				res.send("Do you think you are hacker?\nMaybe sucker, otherwise ask the admin for help\nrouter.get('/logOut', function (req, res)")
			}
		})
	}
	else{
		res.send("Do you think you are hacker?\nMaybe sucker, otherwise ask the admin for help\nrouter.get('/logOut', function (req, res)")
	}
	});
}

//POST
{
	router.post('/login', function (req, res) {
		var data = req.body
		var result = ""
		// serching the designated user
		return UserModel.findOne({ name: data.name }).then(function (user) {
			if (user) {
				var authenticate = UserModel.authenticate()
				
				let pass = key.decrypt(data.password, 'utf8')
				pass = pass.substring(0,pass.length-1)
				
				authenticate(data.name,pass,function(err,_user,_pass){
					if(err)
						{
							console.log("authenticate err:")
							console.log(err)
						}
					if(_user)
						{
							req.login(_user,function(err){
								if (err) 
								{ 
									console.log("login err:")
									console.log(err)
								}
								// return res.send('login sucessed');
								res.json({
									'email':_user.email,
									'role':_user.role,
									'name':_user.name,
									'isAuthenticated':true,
								});
								return
							})
						}
					else if(pass)
						{
							console.log("pass.name")
							console.log(pass.name)
							result = result.concat("wrong password")
							
							console.log(result)
							console.log("result")
							return res.send('login failed');
						}
					})
			}
			else {
				console.log("wrong username");
				result = result.concat("wrong username\n")
				res.send(result);
			}
		});	
	});

	router.post('/forgotPassword', (req, res) => {
		const token = crypto.randomBytes(20).toString('hex');
		const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: `${process.env.email_user_name}`,
			pass: `${process.env.email_password}`,
		},
		});
		var _name = req.body.name
		console.log('req.body.name:');
		console.log(req.body.name);
		if(_name === undefined)
			_name = req.query.token
		UserModel.findOne({'name':_name}).then(function(_user){
			console.log('lets check'); 
			console.log('_user:'); 
			console.log(_user); 
			if(_user){
				let _email = _user.email
				if (_email) {
					const mailOptions = {
						//   to: `${user.email}`,
						to: `${_email}`,
						//   to: `${process.env.email_user_name_target}`,
						subject: 'Link To Reset Password',
						text:
							`You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
							Please click on the following link, or paste this into your browser to complete the process within ten minutes of receiving it:\n\n
							http://localhost:3000/reset_password?token=${token}\n\n
							If you did not request this, please ignore this email and your password will remain unchanged.\n`,
					};



					UserModel.findOneAndUpdate({'name':_name},{'resetPasswordToken': token, 'resetPasswordExpires': Date.now() + 600000})
					.then(() =>{
						console.log('i am after find and update');
						transporter.sendMail(mailOptions, (err, response) => {
							if (err) {
								console.error('there was an error: ', err);
								res.send('there was an error with your mail addres please contact the admin');
							} else {
								console.log('here is the res: ', response);
								res.send('recovery email sent');
							}
						})
					})
				} 
				else {
					res.send(`ouch you have no email adress, i am sorry but you can't reset your pass`);
				}
			}
			else{
				res.send('there is no user with this username');
			}
		})
	})

	router.post('/upload_image', function (req, res) {
		console.log("welcome to upload image with cloudinary");
		const path = req.files[0]
		console.log('file');
		console.log(path);
		console.log('check');
		cloudinary.uploader.upload(path)
		.then(image => res.json([image]))
	});

	router.post('/_checkout', function () {

		try {
			stripe.customers.list(
				{
				  limit: 3,
				},
				function() {
				 console.log('succcesed');
				}
			  )
		} catch (error) {
			console.log(error);
			console.log('shit');
		}

	})

	

	
}


/* postman methods */
{
	router.post('/postman_register', function (req, res) {
		console.log("line 613")
		// var data = req.data
		// var pass = data.password
		// delete data.password;
		var data = {}
		data['username'] = req.query.name 
		data['name'] = req.query.name 
		data['role'] = req.query.role 
		data['id'] = req.query.id 
		//need to delete next line because i dont want to save the pwd as plain text
		data['pwd'] = req.query.password 
		
		console.log("line 621")
		

		// var decrypted = key.decrypt(data.password, 'utf8')
		// var pass = decrypted.substring(0, decrypted.length - 1);
		console.log(data)
		UserModel.register(data,req.query.password,function(err,user){
			if(err)
			{
				console.log(err)
				res.send(err)
			}
			res.send(user)
		})
		console.log(data)
	});

	router.post('/postman_reset_password', function (req, res) {
		// var token = req.query.token
		// if(token === undefined)
		// 	token = req.body.token
		// var pass = req.query.token
		// if(pass === undefined)
		// 	pass = req.body.token

		var data = req.body
		
		var decrypted = key.decrypt(data.password, 'utf8')
		var pass = decrypted.substring(0, decrypted.length - 1);
		
		//need to delete next line because i dont want to save the pwd as plain text
		data['pwd']=pass

		UserModel.findOne({'resetPasswordToken':token})
			.then(function(x){
					return x.setPassword(pass)
			.then(function(_user){
				if (Date.now() < _user.resetPasswordExpires){
					res.render('reset_password_view')
				} 
				else {
					res.send("your reset link was expired")
				}
			})
		})
	})	

	router.get('/postman_test', function (req, res) {
		console.log(req.query.id);
		UserModel.findOneAndUpdate(	{id:req.query.id},
									{status:"deleted"}).then(function(){
										UserModel.find().then(function(x){
											console.log(x)
											res.send(x)
										})
									})
							
	})	

	router.get('/postman_show_all', function (req, res) {
		UserModel.find().then(function(x){
							x.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
										
											console.log(x)
											res.send(x)
									})
							
	})
}

router.get('/image_test', function (req, res) {
		FlowerModel.findOne({'name': 'Lily'}).then(function (_user) {
	 
			setTimeout(function(){
				res.send(_user.src)
				//do what you need here
			}, 1000);
		})
	})


router.get('/authorized_read_list', function (req, res) {

	if(!req.user || (req.user.role !== 'worker' && req.user.role !== 'admin')){
		res.send('hacker....')
		return
	}
	UserModel.find().sort({ id: 1 }).then(function (arry) {
		arry.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
					res.send(arry);
		});
})

router.get('/unauthorized_flowers_list', function (req, res) {

	FlowerModel.find({status : 'not deleted'}).sort({ id: 1 }).then(function (arry) {
		arry.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
			res.send(arry);
		});
})

router.post('/authorized_getUserDataUsingID', function (req, res) {

	if(!req.user || (req.user.role !== 'worker' && req.user.role !== 'admin')){
		res.send('hacker....')
		return
	}
	var id = req.body.id
	UserModel.findOne({id:id}).then(function (arry) {
				res.send(arry);
	});
})

router.get('/getUserData', function (req, res) {

	if(!req.user){
		res.send('hacker....')
		return
	}
	res.send(req.user);
})

router.post('/authorized_getFlowerDataUsingID', function (req, res) {

	if(!req.user || (req.user.role !== 'worker' && req.user.role !== 'admin')){
		res.send('hacker....')
		return
	}
	var id = req.body.id
	id = parseInt(id);

	FlowerModel.findOne({id:id}).then(function (arry) {
				res.send(arry);
	});
})

router.post('/authorized_updateUsersDataToDB', async function (req, res) {

	if(!req.user || req.user.role !== 'admin'){
		res.send('hacker....')
		return
	}
	var user = req.body.user
	await UserModel.findOneAndUpdate({'id':user.id},{'name': user.name,'userName': user.name, 'email': user.email,})
	var updated_user = await UserModel.findOne({id:user.id})
	res.send(updated_user)
})

router.post('/authorized_deleteUserData', async function (req, res) {

	if(!req.user || req.user.role !== 'admin'){
		res.send('hacker....')
		return
	}
	var user = req.body.user

	await UserModel.findOneAndUpdate({'id':user.id},{'status': '_deleted_'})
	res.send('user was deleted')
})

router.post('/authorized_deleteFlowerData', async function (req, res) {

	if(!req.user || req.user.role !== 'admin'){
		res.send('hacker....')
		return
	}
	var flower = req.body.flower

	await FlowerModel.findOneAndUpdate({'id':flower.id},{'status': '_deleted_'})
	res.send('flower was deleted')
})

router.post('/authorized_updateFlowersDataToDB', async function (req, res) {

	if(!req.user || req.user.role !== 'admin'){
		res.send('hacker....')
		return
	}
	var flower = req.body.flower
	console.log(flower.id);
	await FlowerModel.findOneAndUpdate({'id':flower.id},{'price': flower.price,'quantity': flower.quantity,'description': flower.description})
	var updated_flower = await FlowerModel.findOne({id:flower.id})
	res.send(updated_flower)
})

router.get('/is_loged', function (req, res) {
		if (req.user){
			res.send(true)
			return;
		}
		res.send(false)
})

router.get('/who_is_loged', function (req, res) {
	if (req.user){
		res.send(req.user.name)
		return;
	}
	res.send('no one')
})

router.get("/", (req, res) => {
	res.send({ response: "Server is up and running." }).status(200);
});


// module.exports = {sk, router};
module.exports = router;
module.exports.key = key;
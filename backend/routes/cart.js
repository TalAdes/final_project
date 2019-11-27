const express = require('express');
const router = express.Router();
const stripe = require("stripe")('sk_test_DKK9B8vDDO2VjewUYB7pkuUt00R6nEVqP0');
const uuid = require("uuid/v4");
const nodemailer = require('nodemailer');


/* setting DB path  */
const FlowerModel = require('../models/flowers');
const UserModel = require('../models/users');


router.get('/getCartItemsMongoDB', async function (req, res) {

	if(!req.user || req.user.role !== 'subscriber'){
		res.send([])
		return
	}
	res.send(req.user.cartItems)
})

router.post('/addItemInCartMongoDB', async function (req, res) {

	if(!req.user || req.user.role !== 'subscriber'){
		res.send('hacker....')
		return
	}
	var flower = req.body.flower
	var index = req.user.cartItems.findIndex(x => x.id === flower.id)
	// Is the item user wants to add already in the cart?
	if (index !== -1) {
		// Yes, update the quantity.
		
		//create new flower from current and one from db
		flower = {
			...flower,
			quantity: req.user.cartItems[index].quantity + flower.quantity
		};

		//remove flower from db
		await req.user.cartItems.pull(flower._id);

		//add new flower to arry(embedded documents)
		req.user.cartItems = [...req.user.cartItems,flower];
		await UserModel.findOneAndUpdate({'id':req.user.id},{cartItems: [...req.user.cartItems]})

	} else {
		// No, add a new item.
		await UserModel.findOneAndUpdate({ name: req.user.name },{cartItems: [...req.user.cartItems,flower]})
	}
	res.send()
})

router.post('/deleteCartItemMongoDB', async function (req, res) {

	if(!req.user || req.user.role !== 'subscriber'){
		res.send('hacker....')
		return
	}
	var id = req.body.id
	var flower = await FlowerModel.findOne({id})

	//remove flower from db
	await req.user.cartItems.pull(flower._id);
	await UserModel.findOneAndUpdate({'id':req.user.id},{cartItems: req.user.cartItems})

	res.send()
})

router.post('/updateCartItemQntMongoDB', async function (req, res) {

	if(!req.user || req.user.role !== 'subscriber'){
		res.send('hacker....')
		return
	}
	var id = req.body.id
	var quantity = req.body.quantity

	var index = req.user.cartItems.findIndex(x => x.id === id)
	// Is the item user wants to add already in the cart?
	if (index !== -1) {
		// Yes, update the quantity.
		var flower = await FlowerModel.findOne({id})
		var _id = flower._id
		flower = flower._doc
		
		//create new flower from current and one from db
		flower = {
			...flower,
			quantity: quantity
		};

		//remove flower from db
		await req.user.cartItems.pull(_id);

		//add new flower to arry(embedded documents)
		req.user.cartItems = [...req.user.cartItems,flower];
		await UserModel.findOneAndUpdate({'id':req.user.id},{cartItems: [...req.user.cartItems]})
		res.send('updated')
	}
	else res.sendStatus('errrrrrrror')

})

router.post("/checkout", async (req, res) => {
	console.log("Request:", req.body);

	let error;
	let status;
	try {
		const { product, token } = req.body;
	
		const customer = await stripe.customers.create({
		name: req.user.name,
		email: req.user.email,
		source: token.id
	});

	const idempotency_key = uuid();
	const charge = await stripe.charges.create(
	{
		amount: product.price,
		currency: "usd",
		customer: customer.id,
	//   receipt_email: token.email,
		receipt_email: customer.email,
		description: `${product.description}`,
		shipping: {
			name: req.user.name,
			address: {
				line1: token.card.address_line1,
				line2: token.card.address_line2,
				city: token.card.address_city,
				country: token.card.address_country,
				postal_code: token.card.address_zip
			}
		}
	},
	{
		idempotency_key
	}
	);
		console.log("Charge:", { charge });
		status = "success";
		const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: `${process.env.email_user_name}`,
			pass: `${process.env.email_password}`,
		},
		});
		const mailOptions = {
			//   to: `${user.email}`,
			to: `${customer.email}`,
			//   to: `${process.env.email_user_name_target}`,
			subject: 'Thank you, this is your receipt',
			text:
				`you succesfuly purchased: ${charge.description}  and paied for it: ${charge.amount} usd\n,yours ${product.name}`,
		};
		transporter.sendMail(mailOptions, (err, response) => {
		if (err) {
			console.error('there was an error: ', err);
			res.send('there was an error with your mail addres please contact the admin');
		} else {
			console.log('here is the res: ', response);
			res.send('recovery email sent');
		}
		})
	} catch (error) {
		console.error("Error:", error);
		status = "failure";
	}

	res.json({ error, status });
});


//didn't checked' have to configure stripe first!!
router.post('/setCartItemsMongoDB', async function (req, res) {

	if(!req.user || req.user.role !== 'subscriber'){
		res.send('hacker....')
		return
	}
	
		await UserModel.findOneAndUpdate({ name: req.user.name },{cartItems: []})

	res.send()
})


module.exports = router;
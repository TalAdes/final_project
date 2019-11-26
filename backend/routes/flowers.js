const express = require('express');
const router = express.Router();
const download = require('image-downloader')



/* setting DB path  */
const FlowerModel = require('../models/flowers');


//flowers CRUD
{
	router.post('/upload_flower', function (req, res) {
		console.log("welcome to upload flower");
		var uploadpath = "";
		
		FlowerModel.find().then(function (resultArry){
			var data = req.body
			var id = (Math.max.apply(null, resultArry.map(function(x){ return x.id}))+1).toString()
			data['id'] = id.toString()
			
			var name        = data.name

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
					var file = req.files.add_flower_files_name, name = file.name;
					uploadpath = root + 'public/images/flowers/' + name;
					file.mv(uploadpath, function (err) {
						data ['src'] = "images/" + name;
						if (err) {
							console.log("File Upload Failed", name, err);
							res.send("Error Occured!, image issue")
							return ;
						}
						else {
							console.log("File Uploaded", name);
							saveFlower(res, data);
							return;
						}
					});
				}
				else {
					console.log("try to upload url");
					dest = root + 'public/images/';
					if (req.body.image_url != "") {
						var _data = { url: req.body.image_url, dest: root + 'public/images/' }
						download.image(_data).then(({ filename }) => {
							data ['src'] = "images/" + filename.substring(filename.lastIndexOf("\\") + 1, filename.length);
							saveFlower(res, data);
							return;
							}).catch(() => {
							res.send("Error Occured!, image issue")
							return ;
						});
					}
					else saveFlower(res, data);
				}
			};
		});
	});

	router.get('/flowers_catalog', function (req, res) {
		FlowerModel.find({}).then(function (flowers_arry) {
			if(req.user){
				res.render('‏‏generate_flowers', { flowers: flowers_arry, role: req.user.role, show_or_not: req.query.show_or_not });
			}	
			else if(req.query.show_or_not){
				res.render('‏‏generate_flowers', { flowers: flowers_arry, role: "guest", show_or_not: req.query.show_or_not });
			}
			else{
				res.render('‏‏generate_flowers', { flowers: flowers_arry, role: "guest", show_or_not: "dont" });
			}
		})
	})

	router.post('/update_flower', function (req, res) {
		var name = req.body.update_flower_name
		var description = req.body.update_flower_description_name
		var color = req.body.update_flower_color_name
		var price = req.body.update_flower_price_name
		var id = req.body.flower_update_id_name

		FlowerModel.find({ id: req.body.flower_update_id }).then(function () {
			console.log("the flowers to update was found");
			updateFlower(res, id, name, description, color, price)
		}).catch(function (e) {
			console.log(e)
			console.log("in valid id can be occured only if the client is hacker that changed the id by code");
		})
	});

	router.get('/deleteFlower', function (req, res) {
		if(req.user && req.user.role=='supplier'){
			FlowerModel.findOneAndUpdate({ _id: req.query.id }, { status: "deleted" }).then(function () {
				FlowerModel.find().sort({ id: 1 }).then(function (resultArry) {
					res.render('‏‏generate_flowers', { flowers: resultArry, role: 'supplier' , show_or_not: "dont" });
				});
			});
		}
	});
}

function saveFlower(res,data) {

	FlowerModel.insertMany({ 	
							name: data.name, 
							price: data.price, 
							id: data.id,
							color: data.color, 
							category: data.category,
							quantity: data.quantity, 
							hot: data.hot, 
							description: data.description, 
							status: data.status,
							src: data.src,
							imageUrls: data.src
						}).then(() => res.json({
							'isRegisteredSuccesfully' : true
						})).catch(() => res.json({
							'isRegisteredSuccesfully' : false
						}))
}

function updateFlower(res, id, name, description, color, price) {
	FlowerModel.findOneAndUpdate({ _id: id }, { name: name, description: description, color: color, price: price}, function () {
		res.redirect('/#flowers');
	});
}

module.exports = router;

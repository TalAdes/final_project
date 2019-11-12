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



//flowers CRUD
{
	router.post('/upload_flower', function (req, res) {
		console.log("welcome to upload flower");
		var uploadpath = "";
		FlowerModel.find().sort({ id: 1 }).then(function (resultArry) {
			var id = resultArry.length + 1;
			var name = req.body.add_flower_name;
			console.log(description);
			var color = req.body.add_flower_color_name;
			var description = req.body.add_flower_description_name;
			var price = req.body.add_flower_price_name;
			var root = __dirname.substring(0, __dirname.lastIndexOf("\\") + 1)
			console.log(name);
			console.log(color);
			console.log(price);
			if (resultArry.some(x => x.name === name)) {
				console.log("err");
				result = "ERROR1";
				managerRole = resultArry.find(x => x.name == req.body.managerName).role;
				res.redirect('/#flowers');
			}

			else {
				// maybe i should check also about req.files.upfile, but i dont think it necessary
				if (req.files) {
					console.log("try to upload file");
					var file = req.files.add_flower_files_name, name = file.name;
					uploadpath = root + 'public/images/flowers/' + name;
					file.mv(uploadpath, function (err) {
						uploadpath = "images/" + name;
						if (err) {
							console.log("File Upload Failed", name, err);
							res.send("Error Occured!")
						}
						else {
							console.log("File Uploaded", name);
						}
						saveFlower(res, id, req.body.add_flower_name, description, color, price, uploadpath);
					});
				}
				else {
					console.log("try to upload url");
					dest = root + 'public/images/';
					if (req.body.image_url != "") {
						var data = { url: req.body.image_url, dest: root + 'public/images/' }
						download.image(data).then(({ filename, image }) => {
							uploadpath = "images/" + filename.substring(filename.lastIndexOf("\\") + 1, filename.length);
							console.log("uploadPath:"),
								console.log(uploadpath),
								console.log('File saved to', filename),
								saveFlower(res, id, req.body.add_flower_name, description, color, price, uploadpath)
						}).catch((err) => {
							console.error(err)
						});
					}
					else saveFlower(res, id, req.body.add_flower_name, description, color, price, uploadpath);
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

function saveFlower(res, id, name, description, color, price, src, status) {

	FlowerModel.insertMany({ id: id, name: name, description: description, color: color, price: price, src: src, status: status }, function () {
		res.redirect('/#flowers');
	});
}

function updateFlower(res, id, name, description, color, price) {
	FlowerModel.findOneAndUpdate({ _id: id }, { name: name, description: description, color: color, price: price}, function () {
		res.redirect('/#flowers');
	});
}

module.exports = router;

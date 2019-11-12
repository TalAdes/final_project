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

//branches CRUD
{

	router.post('/upload_branch', function (req, res) {
		console.log("welcome to upload branch");
		var uploadpath = "";
		BranchModel.find().sort({ id: 1 }).then(function (resultArry) {
			var id = resultArry.length + 1;
			var name = req.body.add_branch_name;
			var addres = req.body.add_branch_addres_name;
			var root = __dirname.substring(0, __dirname.lastIndexOf("\\") + 1)
			if (resultArry.some(x => x.name === name)) {
				console.log("err");
				result = "ERROR1";
				managerRole = resultArry.find(x => x.name == req.body.managerName).role;
				res.redirect('/#branches');
			}

			else {
				// maybe i should check also about req.files.upfile, but i dont think it necessary
				if (req.files) {
					console.log("try to upload file");
					var file = req.files.add_branch_files_name, name = file.name;
					uploadpath = root + 'public/images/branches/' + name;
					file.mv(uploadpath, function (err) {
						uploadpath = "images/" + name;
						if (err) {
							console.log("File Upload Failed", name, err);
							res.send("Error Occured!")
						}
						else {
							console.log("File Uploaded", name);
						}
						saveBranch(res, id, req.body.add_branch_name, addres, uploadpath)
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
								saveBranch(res, id, req.body.add_branch_name, addres, uploadpath)
						}).catch((err) => {
							console.error(err)
						});
					}
					else saveBranch(res, id, req.body.add_branch_name, addres)
				}
			};
		});
	});

	router.get('/branches_list', function (req, res) {
		BranchModel.find({}).then(function (branches_arry) {
			if(req.user && req.user.role=='admin'){
				res.render('‏‏generate_branches', { branches: branches_arry});
			}	
			else{
				res.render('error');
			}
		})
	})

	router.post('/update_branch', function (req, res) {
		var id = req.body.branch_update_id_name
		var name = req.body.update_branch_name
		var addres = req.body.update_branch_addres_name
		var status = req.body.branch_update_status
		

		console.log("req.body.update_branch_id");
		console.log(id);
		console.log("req.body.update_branch_name");
		console.log(name);
		console.log("req.body.update_branch_addres_name");
		console.log(addres);
		console.log("req.body.update_branch_status_name");
		console.log(status);
		BranchModel.find({ id: req.body.branch_update_id }).then(function () {
			console.log("the branches to update was found");
			updateBranch(res, id, name, addres, status)
		}).catch(function () {
			e => console.log(e), console.log("in valid id can be occured only if the client is hacker that changed the id by code");
		})
	});

	router.get('/delete_branch', function (req, res) {
		if(req.user && req.user.role=='admin'){
			BranchModel.findOneAndUpdate({ id: req.query.id }, { status: "deleted" }).then(function () {
				BranchModel.find().sort({ id: 1 }).then(function (resultArry) {
					res.render('‏‏generate_branches', { branches: resultArry, role: 'admin'});
				});
			});
		}		
	});
}


function saveBranch(res, id, name, addres, src = "", status = "active") {
	console.log("id:");
	console.log(id);
	console.log("name:");
	console.log(name);
	console.log("addres:");
	console.log(addres);
	console.log("src:");
	console.log(src);
	console.log("status:");
	console.log(status);

	BranchModel.insertMany({ id: id, name: name, addres: addres, src: src, status: status }, function () {
		// UserModel.insertOne({ id: id, pwd: pwd, name: name, role: role, src: src ,status:status }, function () {
		console.log("src:");
		console.log(src);
		res.redirect('/#branches');
	});
}

function updateBranch(res, id, name, addres, status) {
	console.log("branch details:");
	console.log("id:");
	console.log(id);
	console.log("name:");
	console.log(name);
	console.log("addres:");
	console.log(addres);
	console.log("status:");
	console.log(status);

	// UserModel.insertMany({ id: id, pwd: pwd, name: name, role: role, src: src }, function () {
	BranchModel.findOneAndUpdate({ id: id }, { name: name, addres: addres, status: status }, function () {
		console.log("res.redirect('/#branches');");
		res.redirect('/#branches');
	});
}



module.exports = router;

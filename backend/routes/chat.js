const express = require('express');
const router = express.Router();
const stripe = require("stripe")('sk_test_DKK9B8vDDO2VjewUYB7pkuUt00R6nEVqP0');
const uuid = require("uuid/v4");
const nodemailer = require('nodemailer');


/* setting DB path  */
const FlowerModel = require('../models/flowers');
const UserModel = require('../models/users');



module.exports = router;
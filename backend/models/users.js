let mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

let flowerSchema = new mongoose.Schema({
  name: String,
  description: String,
  color: String,
  category: String,
  status: String,
  imageUrls: String,
  id: Number,
  price: String,
  src : String,
  hot : String,
  quantity : Number
})


let userSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true,
},
  pwd: {
    type: String,
    required: true,
},
  role: String,
  id: Number,
  status: String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
  email: String,
  cartItems: [flowerSchema],
  src : String,
  date: Date
})


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Users', userSchema)
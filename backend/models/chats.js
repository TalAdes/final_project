let mongoose = require('mongoose')

let messageSchema = new mongoose.Schema({
  date: String,
  sender: String,
  like: String,
  dislike: String,
  text : String
})

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


let chatSchema = new mongoose.Schema({
  id: Number,
  src : String,
  name: String,
  adminName: String,
  adminEmail: String,
  adminPhone: String,
  isPrivate: String,
  isOpen: String,
  generatedToken: String,
  status: String,
  history:[messageSchema],
  users:[userSchema]
})

module.exports = mongoose.model('Chats', chatSchema)

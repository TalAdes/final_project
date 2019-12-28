let mongoose = require('mongoose')

let messageSchema = new mongoose.Schema({
  date: String,
  sender: String,
  like: String,
  dislike: String,
  text : String
})

let tinyUserSchema = new mongoose.Schema({
  name: String
})

let chatSchema = new mongoose.Schema({
  id: Number,
  src : String,
  name: String,
  adminName: String,
  adminEmail: String,
  adminPhone: String,
  status: String,
  history:[messageSchema],
  users:[tinyUserSchema]
})

module.exports = mongoose.model('Chats', chatSchema)
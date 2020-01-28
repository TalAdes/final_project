let mongoose = require('mongoose')

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
  hot : Boolean,
  quantity : Number
})

module.exports = mongoose.model('Flowers', flowerSchema)
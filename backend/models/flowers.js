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
  hot : String,
  quantity : String
})

module.exports = mongoose.model('Flowers', flowerSchema)
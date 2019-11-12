let mongoose = require('mongoose')

let flowerSchema = new mongoose.Schema({
  name: String,
  description: String,
  color: String,
  status: String,
  price: String,
  src : String
})

module.exports = mongoose.model('Flowers', flowerSchema)
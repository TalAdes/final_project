let mongoose = require('mongoose')

let branchSchema = new mongoose.Schema({
  name: String,
  addres: String,
  status: String,
  id: Number,
  src : String
})

module.exports = mongoose.model('Branches', branchSchema)
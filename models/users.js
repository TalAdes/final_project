let mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');



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
  src : String,
  date: Date
})


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Users', userSchema)
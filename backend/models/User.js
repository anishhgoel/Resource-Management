const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name :  {type : String, required : true},
    email : {type : String, reqired : true, unique : true}, 
    password : {type : String, required : true},
    role : { type: String, enum: ['admin', 'team', 'client'], default: 'client' },
    created : {type: Date, default: Date.now}
})

module.exports = mongoose.model('User', userSchema);
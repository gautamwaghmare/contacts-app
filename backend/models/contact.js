const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    contactNumber : {type: Number, required: true},
    email : {type: String, required: true},
    status : {type: Boolean, required: true},
    imagePath: {type: String, required: false},
    address: {type: String, required: false},
    creator : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Contact', contactSchema);
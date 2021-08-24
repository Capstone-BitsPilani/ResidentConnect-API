var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var announcementInfoSchema = new Schema({
    communityid : {type: String},
    announcement:{type:String},
    createdat:{type:Date},
    expiredat:{type:Date}
   
});
// Compile model from schema
module.exports =mongoose.model('announcementinfo', announcementInfoSchema );;
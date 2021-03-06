const { Double, Decimal128 } = require('bson');
var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var maintenanceinfoSchema = new Schema({
    communityid : {type: String},
    apartmentid : {type:String},
    category:{type:String,required:true ,enum:  ['community','apartment']},
    type:{type:String},
    description:{type:String},
    status:{
        type:String
    },
    createdat:{type:Date},
    closedat:{type:Date},
    assignedto:{type:String},
    servicecharge:{type:Number},
    materialcharge:{type:Number}
 
    
});

module.exports =mongoose.model('maintenanceinfo', maintenanceinfoSchema );
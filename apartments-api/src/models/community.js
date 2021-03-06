var mongoose = require('mongoose');
var randtoken = require('rand-token');

var Schema = mongoose.Schema;

var communitySchema = new Schema({
  token: {
    type: String,
    default: function() {
        return randtoken.generate(5);
    },required:true,unique:true
   },
   profilecompletion:{type:Boolean,required:true,default:false},
    name : {type: String, required: true},
    builder: {type: String},
    createdat: { type: Date, default: Date.now() , required: true},
    address : {
      addressline : {type: String,default:''},
      area : {type: String,default:''},
      city: {type: String,default:''},
      state : {type: String,default:''},
      pincode : {type: String,default:''},
    

},

blockdetails:[
  {
      block: {type: String},
      floors: {type:Number,default: 0},
      flats:{type:Number,default: 0},
      floordetails:
      [
          {
              floor:{type:Number},
              flats:[{type: Schema.Types.ObjectId, ref: 'apartments'}]
          }              
      ]
  }
],
paidservices:
{
  carpooling : {type:Boolean,required:true,default:false},
  facility : {type:Boolean,required:true,default:false},
  maintenance : {type:Boolean,required:true,default:false},
  polling : {type:Boolean,required:true,default:false},
  visitor : {type:Boolean,required:true,default:false}
},
geo:{
  lat:{type:Number,required:true,default:0},
  lng:{type:Number,required:true,default:0}
}
    
   
});
communitySchema
.virtual('url')
.get(function () {
  return '/community/' + this._id;
});
// Compile model from schema
module.exports =mongoose.model('Communities', communitySchema );;
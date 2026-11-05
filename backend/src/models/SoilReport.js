const mongoose = require('mongoose');

const SOIL_TYPE_ENUM = [
'sandy','clay','loam','silt','black','red','volcanic','laterite','unknown'
];

const soilReportSchema = new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:'User',
required:true
},

soilType:{
type:String,
enum:SOIL_TYPE_ENUM,
default:'unknown'
},

soilColor:String,

previousCrop:String,

analysis:{
fertility:String,
organicMatter:String,
nutrientDeficiency:String,
phLevel:String
},

suggestions:{
fertilizers:[String],
compostMethods:[String],
cropRotation:[String],
waterRetention:[String],
improvementSteps:[String]
},

imageUrl:String

},{
timestamps:true
});

module.exports = mongoose.model('SoilReport',soilReportSchema);
module.exports.SOIL_TYPE_ENUM = SOIL_TYPE_ENUM;
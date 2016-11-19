var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NameSchema = new Schema({
	name: String
});

module.exports = mongoose.model('Name', NameSchema);

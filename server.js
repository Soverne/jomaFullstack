var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Name = require('./app/models/name');

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { 
   console.log("Database connected!");
  // we're connected!
});

var router = express.Router();

router.use(function(req, res, next) {
	console.log('Something is using the API');
	next();
});

router.get('/', function(req, res) {
	res.json({ message: 'API time' });
});

router.route('/names')
	.post(function(req, res) {
		var name = new Name();
		name.name = req.body.name;

		name.save(function(err) {
			if (err)
				res.send(err);
			res.json({ message: 'Name created ... hopefully' });
		});
	})

	.get(function(req, res) {
		Name.find(function(err, names) {
			if (err) 
				res.send(err);
			
			res.json(names);
		});
	});

router.route('/names/:name')
	.delete(function(req, res) {
		Name.remove({
			name: req.params.name
		}, function(err, name) {
			if (err)
				res.send(err);
			res.json({ message: 'Successfully deleted'});
		});
	});

router.route('/names/test/:id')
	.delete(function(req, res) {
		Name.remove({
			_id: req.params.id
		}, function(err, name) {
			if (err)
				res.send(err);
			res.json({ message: 'Deleted matching id' });
		});
	});

app.use('/api',router);

app.listen(port);
console.log('Magic happens on port ' + port);

//GET http://ec2-52-15-70-107.us-east-2.compute.amazonaws.com:8080/api/names to get all names
//POST http://ec2-52-15-70-107.us-east-2.compute.amazonaws.com:8080/api/names to add a single name using json
//DELETE http://ec2-52-15-70-107.us-east-2.compute.amazonaws.com:8080/api/names/:name to delete a name


/*
Author: Sandeep Roy
Purpose:
Date: 11/01/2017
*/
var bodyParser = require("body-parser");
var express = require('express'),
	employee = require('./DatabaseModel/employee'),
	app = express();

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	"extended": false
}));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE');
	res.header('Access-Control-Max-Age', '3600');
	res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
	next();
});

app.get('/employee', employee.findAllEmployee);
app.get('/employee/:id', employee.findEmployeeById);
app.post('/employee', employee.addEmployee);
app.put('/employee', employee.updateEmployeeData);
app.delete('/employee/:employeeId', employee.deleteEmployeeData);

//Setting the port number
app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
/*
Author: Sandeep Roy
Purpose:
Date: 11/01/2017
*/
var mongoose = require('mongoose');
var Response = require("../response.js");
//Establishing a connection to the Database 
mongoose.connect('mongodb://mike:qwerty@ds141185.mlab.com:41185/sandeeproy');
var db = mongoose.connection;
db.once('open', function() {
	console.log('connected to database');
});
//On failure to connect to the database
db.on('error', console.error.bind(console, 'connection error'));

//Declaring the schema
var Schema = mongoose.Schema;
//Defining the employee schema
var empSchema = new Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	dob: {
		type: String
	},
	department: {
		type: String
	},
	gender: {
		type: String
	},
	age: {
		type: Number
	}
});
//Build the Employee model
var Employee = mongoose.model('employee', empSchema);
//Declaring all the functions
var employeeDao = {

	findAllEmployee: findAllEmployee,
	findEmployeeById: findEmployeeById,
	updateEmployeeData: updateEmployeeData,
	addEmployee: addEmployee,
	deleteEmployeeData: deleteEmployeeData
};

//To find an employee from the data repository
function findAllEmployee(req, res) {
	var response = new Response();

	Employee.find().exec(function(err, employees) {
		if (!err) {
			response.data.employees = employees;
			response.status.statusCode = '200';
			response.status.message = 'fetched the employees';
			res.status(200).send(response);
		} else {
			response.status.statusCode = '500';
			response.status.message = 'unable to fetch blogs ';
			res.status(500).send(response);
		}
	});
}
//Finding an employee by ID
function findEmployeeById(req, res) {
	var response = new Response();

	Employee.find({
		_id: req.params.id
	}).exec(function(err, employees) {
		if (!err) {
			response.data.employee = employees;
			response.status.statusCode = '200';
			response.status.message = 'fetched the employees';
			res.status(200).send(response);
		} else {
			response.status.statusCode = '500';
			response.status.message = 'unable to fetch blogs ';
			res.status(500).send(response);
		}
	});
}
//To add an employee to the data repository
function addEmployee(req, res) {
	var response = new Response();
	req.body.employee.age = getAge(req.body.employee.dob);
	Employee.create(req.body.employee, function(err, data) {
		if (!err) {
			response.data.employee = data;
			response.status.statusCode = '200';
			response.status.message = 'add the employee';
			res.status(200).send(response);
		} else {
			response.status.statusCode = '500';
			response.status.message = 'unable to add employee ';
			res.status(500).send(response);
		}
	});
}
//To update the existing employee details
function updateEmployeeData(req, res) {
	var response = new Response();
	var employee = req.body.employee;
	var searchQuery = {
		"_id": req.body.employeeId
	};
	var updateQuery = {
		$set: {
			name: employee.name,
			email: employee.email,
			dob: employee.dob,
			department: employee.department,
			gender: employee.gender,
			age: getAge(employee.dob)
		}
	};
	var options = {
		new: true
	};

	Employee.findOneAndUpdate(searchQuery, updateQuery, options, function(err, updatedBlog) {
		if (!err) {
			response.data.employees = updatedBlog;
			response.status.statusCode = '200';
			response.status.message = 'updated the employee';
			res.status(200).send(response);
		} else {
			response.status.statusCode = '500';
			response.status.message = 'unable to update employee ';
			res.status(500).send(response);
		}
	});
}
//To delete an employee data from the data repository
function deleteEmployeeData(req, res) {
	var response = new Response();

	Employee.findOne({
		_id: req.params.employeeId
	}, function(err, employee) {
		if (!err) {
			employee.remove(function(err, data) {
				if (!err) {
					response.status.statusCode = '200';
					response.status.message = 'deleted the employee';
					res.status(200).send(response);
				} else {
					response.status.statusCode = '500';
					response.status.message = 'unable to delete employee ';
					res.status(500).send(response);
				}
			});

		} else {
			response.status.statusCode = '500';
			response.status.message = 'unable to delete employee ';
			res.status(500).send(response);
		}
	});
}
//To get the age of the employee 
function getAge(dateString) {
	var today = new Date();
	var birthDate = new Date(dateString);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

module.exports = employeeDao;
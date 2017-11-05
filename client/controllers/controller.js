/*
Author: Sandeep Roy
Purpose: Angular Controller defined here.
Date: 11/01/2017
*/
var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

  var updateView = function() {
    $http({
      method: 'GET',
      url: '/employee'
    }).success(function(response) {
      $scope.employees = response.data.employees;
      $scope.employee = "";
    });
  };

  updateView();
//TO add a new Employee to the data repository
  $scope.addEmployee = function() {
    console.log($scope.employee);
    $http({
      method: 'POST',
      url: '/employee',
      data: {
        employee: $scope.employee
      }
    }).success(function(response) {
      updateView();
    });
  };
//To remobe an Employee from the data repository
  $scope.removeEmployee = function(id) {
    $http({
      method: 'DELETE',
      url: '/employee/' + id.toString()
    }).success(function(response) {
      updateView();
    });
  };
//Initiates the edit option for the user .
  $scope.editEmployeeData = function(id) {
    $http({
      method: 'GET',
      url: '/employee/'+id.toString(),
    }).success(function(response) {
      $scope.employee = response.data.employee[0];
    });
  };
//To update the existing Employee details and saving it in the data repository.
  $scope.updateEmployeeData = function() {
    $http({
      method: 'PUT',
      url: '/employee',
      data: {
        employeeId: $scope.employee._id,
        employee: $scope.employee
      }
    }).success(function(response) {
      updateView();
    });
  };
}]);
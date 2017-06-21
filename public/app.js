var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

//SERVICES

weatherApp.service('cityService', function() {
  this.city = "New York, NY";

});

//for improved

weatherApp.service('weatherService',['$resource' ,function($resource) {
  this.GetWeather = function(city,days) {

    var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=d170ad88fe3a864fc42ad617343ff9a4", {
      callback: "JSON_CALLBACK"
    }, {
      get: {
        method: "JSONP"
      }
    });
    return weatherResult = weatherAPI.get({
      q: city,
      cnt: days
    });
  }

}]);


//controllers

weatherApp.controller('homeController', ['$scope', '$location', 'cityService', function($scope, $location, cityService) {

  $scope.city = cityService.city;

  $scope.$watch('city', function() {
    cityService.city = $scope.city;
  });

  $scope.submit = function() {
    $location.path("/forecast");
  };

}]);

weatherApp.controller('forecastController', ['$scope','$routeParams', 'cityService','weatherService',
function($scope, $routeParams, cityService,weatherService) {

  $scope.city = cityService.city;
  $scope.days = $routeParams.days || '2'; //gave 2 as string for bg-primary purpose, see forecast.html file

  $scope.weatherResult = weatherService.GetWeather($scope.city,$scope.days);
  //console.log($scope.weatherResult);
  $scope.convertToFahrenheit = function(degK) {
    return Math.round((1.8 * (degK - 273)) + 32);
  };

  $scope.convertToDate = function(dt) {

    return new Date(dt * 1000);

  };

}]);


//ROUTES

weatherApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home.html',
      controller: 'homeController'
    })
    .when('/forecast', {
      templateUrl: 'pages/forecast.html',
      controller: 'forecastController'
    })
    .when('/forecast/:days', {
      templateUrl: 'pages/forecast.html',
      controller: 'forecastController'
    })

});

//DIRECTIVES

weatherApp.directive('weatherReport', function() {
  return {
    restrict: 'E',
    templateUrl: 'directives/weatherReport.html',
    replace: true,
    scope: {
      weatherDay: '=',
      convertToStandard: '&',
      convertToDate: '&',
      dateFormat: '@'
    }
  };

});

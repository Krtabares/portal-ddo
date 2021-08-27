'use strict';

angular.module('app.config', ['ngRoute', 'ngNotify', 'ngMap', 'angular-bind-html-compile', 'swxLocalStorage'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/config', {
      templateUrl: 'comps/config/config.html',
      controller: 'ConfigCtrl'
    });
  }])

  .controller('ConfigCtrl', ['$scope', '$rootScope', '$routeParams', '$interval', '$timeout', 'ngNotify', 'request', 'NgMap','$localStorage',
    function($scope, $rootScope, $routeParams, $interval, $timeout, ngNotify, request, NgMap, $localStorage) {

      console.log("configContrl");

      $scope.conf = {
        "entorno" : null,
        "refrescamiento_session" : null
      }

      var ip = IP_SERVER_PYTHON;

      $scope.logOut= function(){
        var body = {}
        body.token=localstorage.get('token')
        request.post(ip+'/logout', body, {'Authorization': 'Bearer ' + localstorage.get('token')})
          .then(function successCallback(response) {
            localstorage.clear()
            window.location.href = "/";
         });
      }


      $scope.updEnviroment = function() {
        $scope.loading = true
        var body = {}
        body.value =JSON.stringify({ value: $scope.conf.entorno  } )
        request.post(ip+'/upd/enviroment', body,{})
        .then(function successCallback(response) {


          $scope.listBD = response.data.basesDeDatos
          $scope.conf  = response.data.variables
          $scope.loading = false

          $scope.logOut()

        }, function errorCallback(response) {

          $scope.loading = false

        });
      }

     $scope.getConf = function() {
        $scope.loading = true

        request.post(ip+'/get/conf', {},{})
        .then(function successCallback(response) {


          $scope.listBD = response.data.basesDeDatos
          $scope.conf  = response.data.variables
          $scope.loading = false

        }, function errorCallback(response) {

          $scope.loading = false

        });
      }
     $scope.getConf() 


    }
  ]);

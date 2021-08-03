'use strict';

angular.module('app.errorPage', ['ngRoute', 'cgNotify', 'ngMap', 'angular-bind-html-compile', 'ngStorage'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/error', {
      templateUrl: 'comps/errorPage/errorPage.html',
      controller: 'errorPageCtrl'
    });
  }])

  .controller('errorPageCtrl', ['$scope', '$rootScope', '$routeParams', '$interval', '$timeout', 'notify', 'request', 'NgMap', 'localstorage', '$localStorage', '$sessionStorage',
    function($scope, $rootScope, $routeParams, $interval, $timeout, notify, request, NgMap, localstorage, $localStorage, $sessionStorage) {



      console.log("errorPageCtrl");


    }
  ]);

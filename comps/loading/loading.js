'use strict';

angular.module('app.myLoading', ['ngRoute', 'ngNotify', 'ngMap', 'angular-bind-html-compile', 'ngStorage'])
.component("myLoading", {
    templateUrl: "comps/loading/loading.html",
    controller: 'loadingCtrl'
  })

  .controller('loadingCtrl', ['$scope', '$rootScope', '$routeParams', '$interval', '$timeout', 'ngNotify', 'localstorage', 'request', 'NgMap','$localStorage',
    function($scope, $rootScope, $routeParams, $interval, $timeout, ngNotify, localstorage, request, NgMap, $localStorage) {

        console.log("loadingCtrl entro")




    }
  ]).directive("loader", function ($rootScope) {
    return function ($scope, element, attrs) {
        $scope.$on("loader_show", function () {
            return element.show();
        });
        return $scope.$on("loader_hide", function () {
            return element.hide();
        });
    };
}
);

'use strict';

angular.module('app.errorOverlay', ['ngRoute', 'ngNotify', 'ngMap', 'angular-bind-html-compile', 'ngStorage'])
.component("errorOverlay", {
    templateUrl: "comps/errorOverlay/errorOverlay.html",
    controller: 'errorOverlayCtrl'
  })

  .controller('errorOverlayCtrl', ['$scope', '$rootScope', '$routeParams', '$interval', '$timeout', 'ngNotify', 'localstorage', 'request', 'NgMap','$localStorage',
    function($scope, $rootScope, $routeParams, $interval, $timeout, ngNotify, localstorage, request, NgMap, $localStorage) {

        console.log("errorOverlayCtrl entro")




    }
  ]).directive("overlay", function ($rootScope) {
    return function ($scope, element, attrs) {
        $scope.$on("overlay_show", function () {
            return element.show();
        });
        return $scope.$on("overlay_hide", function () {
            return element.hide();
        });
    };
}
);

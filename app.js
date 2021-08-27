'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
               'ngRoute',
               'ngMap',
               'ngStorage',
               'angular-bind-html-compile',
               'ngNotify',
               'cgNotify',
               'timer',
               'ngIdle',
               'app.login',
               'app.home',
               'app.perfil',
               'app.deuda',
               'app.saldo',
               'app.clientes',
               'app.generar',
               'app.consulta',
               'app.usuarios',
               'app.config',
               'app.pedidos',
               'app.facturado',
               'app.mySidebar',
               'app.myFooter',
               'app.myLoading',
               'app.headerClient',
               'app.olvidoPass',
               'app.estadisticas',
               'app.errorPage',
               'app.errorOverlay'
     ])
     .factory('request', ['$http','$q', function($http,$q) {
          return {
               get : function(url){
                    var defered = $q.defer();
                    $http({
                         method: "GET",
                         url: url
                    }).then(function(response) {
                         defered.resolve(response);
                    }, function(errorMsg) {
                         defered.reject(errorMsg);
                    });
                    return defered.promise;
               },
               post : function(url,data,headers){
                    var defered = $q.defer();
                    $http({
                         method: "POST",
                         url: url,
                         data: data,
                         headers: headers
                    }).then(function(response) {
                         defered.resolve(response);
                    }, function(errorMsg) {
                         defered.reject(errorMsg);
                    });
                    return defered.promise;
               }
          }
     }])
	 .factory('localstorage', ['$window', function($window) {
          return {
            set: function(key, value) {
              $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
              return $window.localStorage[key] || defaultValue || false;
            },
            setObject: function(key, value) {
              $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key, defaultValue) {
              if($window.localStorage[key] != undefined){
                  return JSON.parse($window.localStorage[key]);
              }else{
                return defaultValue || false;
              }
            },
            remove: function(key){
              $window.localStorage.removeItem(key);
            },
            clear: function(){
              $window.localStorage.clear();
            }
          }
     }])
     .factory('myHttpInterceptor', function($q,$rootScope,$location,$localStorage,$window) {

      var numLoadings = 0;

     return {
         request: function (config) {
          numLoadings++;
          // console.log("numLoadings",numLoadings)
          // console.log(config);
          $rootScope.$broadcast("loader_show");
          if(config.url.indexOf("/login") == -1  && config.url.indexOf(".html") == -1){
            var isLogged=$window.localStorage.logged;
            if(isLogged){
              var token = $window.localStorage.token;
              // var username = $window.localStorage.username
              config.headers['Authorization'] = 'Bearer ' + token;
              // config.headers['username'] = + token;
              }else{
                $location.path('/');
              }
          }
            return config || $q.when(config);
        },
        response: function (response) {

          if ((--numLoadings) === 0) {
              // Hide loader
              $rootScope.$broadcast("loader_hide");
          }

          // console.log(response);
          return response || $q.when(response);

      },


         responseError: function(response) {
         // Unauthorized
         console.log($('body'))
          if ((--numLoadings) === 0) {
            $rootScope.$broadcast("loader_hide");
          }
          if(response.status==401){
            $location.path('/');
          }else if(response.status == -1){
            
            // ngNotify.set('¡No existe conexion con el servidor por favor intente mas tarde!'  ,'error')
            $('body').append('<div id="notify" class="ngn ng-scope ngn-error ngn-bottom animated fadeOut" style="display: block; opacity: 1;"><span  class="ngn-message ng-binding ng-scope">¡No existe conexion con el servidor por favor intente mas tarde!</span><span  class="ngn-dismiss ng-hide">×</span></div>')
            
            $location.path('/');
            setTimeout(function () {
              $('#notify').remove()
            },5000)
          }
            $rootScope.$broadcast("overlay_show");

          return $q.reject(response);
         }
       };
     })
     .config(['$locationProvider', '$routeProvider','$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
          $locationProvider.hashPrefix('!');

          $routeProvider.otherwise({
               redirectTo: '/login'
          });
          $httpProvider.interceptors.push('myHttpInterceptor');
     }]);

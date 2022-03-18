'use strict';

angular.module('app.help', ['ngRoute', 'cgNotify', 'ngMap', 'angular-bind-html-compile', 'ngStorage'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/help', {
      templateUrl: 'comps/help/help.html',
      controller: 'helpCtrl'
    });
  }])

  .controller('helpCtrl', ['$scope', '$rootScope', '$routeParams', '$interval', '$timeout', 'notify', 'request', 'NgMap', 'localstorage', '$localStorage', '$sessionStorage',
    function($scope, $rootScope, $routeParams, $interval, $timeout, notify, request, NgMap, localstorage, $localStorage, $sessionStorage) {

      // CARGA INICIAL DE CHART

      // notify({ message:"¡Solo se pudieron reservar  unidades! verifique disponibilidad", position:'center', duration:10000, classes:'   alert-success '});

      $scope.client = {};
      $scope.client_info = {};
      $scope.hasUserClient = false;

      var ip = IP_SERVER_PYTHON;

      var logged = localStorage.getItem('logged','')
      if (logged) {
        window.location.href = "#!/help";
      }else{
        window.location.href = "#!/";
      }

      $scope.token_valid = false
      // validate_token()
      function validate_token() {
        $scope.loading = true
        // console.log("validaClienteDDO");
        request.post(ip+'/validate_token', {},{'Authorization': 'Bearer ' + localstorage.get('token', '')})
        .then(function successCallback(response) {
          console.log(response.data)
          $scope.loading = false
          $scope.token_valid = true
        }, function errorCallback(response) {
          // console.log(response)
          $scope.loading = false
          window.location.href = "#!/login";

        });
      }

      verificClient()

      function verificClient(){
        // notify({ message:'My message', position:'right', duration:100000, classes:'   alert-danger'});
        

        var client = localStorage.getItem('client')
        var client_info = localStorage.getItem('client_info')
        console.log(client)
         if ( client=='{}' ){
          $scope.hasUserClient = false;
        }else{
          $scope.hasUserClient = true;
          $scope.client_info = JSON.parse(client_info);
          $scope.client = JSON.parse(client);

        }
        console.log($scope.client)
      }



    }
  ]);

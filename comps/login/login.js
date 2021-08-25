'use strict';

angular.module('app.login', ['ngRoute', 'ngNotify', 'ngMap', 'angular-bind-html-compile', 'ngStorage'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/login', {
      templateUrl: 'comps/login/login.html',
      controller: 'LoginCtrl'
    });
  }])

  .controller('LoginCtrl', ['$scope', '$rootScope', '$routeParams', '$interval', '$timeout', 'ngNotify', 'localstorage', 'request', 'NgMap','$localStorage',
    function($scope, $rootScope, $routeParams, $interval, $timeout, ngNotify, localstorage, request, NgMap, $localStorage) {

      $scope.url = [
        "../img/slider-n.jpg",
        "../img/almacen-foto-cliente.jpg",
        "../img/img-about.jpg",
      ]
	  var ip = IP_SERVER_PYTHON;
    $scope.myLoadingVar = false
    $scope.user = {};
    function init() {
      console.log("estA ACTUALIZANDO otra vez");
      $(function(){
        $(document).ready(function() {document.title = 'Droguería del Oeste - Gestión de Órdenes'; });
        $('.modal-backdrop').remove();
        $('#modalConfirmSidebar').modal("hide");
      })

      localstorage.clear()
      
    }
    init()

    $scope.creditoClient = {}

    $scope.user = {};
    $scope.permisos = {}

	  $scope.login = function(){
      $scope.myLoadingVar=true
		  //console.log($scope.user);
      // $scope.user.password = CryptoJS.MD5($scope.user.password).toString();
      var body = {
        username: $scope.user.username.toUpperCase() ,
        password:  CryptoJS.MD5($scope.user.password).toString()
      }
		  request.post(ip+'/login',body,{})
		  .then(function successCallback(response) {
        //console.log(response.data.access_token);

        localstorage.set('user', JSON.stringify(response.data.user));
        localstorage.set('token', response.data.access_token);
        localstorage.set('logged', 1);
        var client = {}
        client.COD_CIA = response.data.user.COD_CIA
        client.GRUPO_CLIENTE = response.data.user.GRUPO_CLIENTE
        client.COD_CLIENTE = response.data.user.COD_CLIENTE

        localstorage.set('client',  JSON.stringify(client));
        // console.log(response.data.user)
        $scope.myLoadingVar = false
        if(response.data.user.role=='root' || response.data.user.role=='sisAdm' || response.data.user.role=='seller' ){
          ngNotify.set('¡Bienvenido! ','success')
          window.location.href = "#!/home";
        }else{
          // $scope.getClientNew(client)
          $scope.creditoClient = response.data.disponible_cliente
          $scope.creditoClient.disp_bs_format = (isNaN(parseFloat(response.data.disponible_cliente.disp_bs)))? 0:parseFloat(response.data.disponible_cliente.disp_bs)
          $scope.creditoClient.disp_usd_format = (isNaN(parseFloat(response.data.disponible_cliente.disp_usd)))? 0 : parseFloat(response.data.disponible_cliente.disp_usd)
          localstorage.set('creditoClient',  JSON.stringify($scope.creditoClient.disp_bs_format));
          localstorage.set('client_info',  JSON.stringify(response.data.cliente[0]));
          $scope.permisos = response.data.user.permisos  ;
          

          ngNotify.set('¡Bienvenido! '+response.data.cliente[0].nombre_cliente ,'success')

          if (response.data.user.permisos.pedido.ver) {
            window.location.href = "#!/pedidos";
          }else{
            window.location.href = "#!/home";
          }
          
        }


		  }, function errorCallback(response) {
			// console.log(response)
      $scope.myLoadingVar = false
			if(response.status == 403){
				ngNotify.set(response.data.msg,'error')
			}else if(response.status == 430){
				ngNotify.set('¡Usuario inactivo!','error')
			}
      else ngNotify.set(response.data.msg,'error')

		  });
    }


    }
  ]);

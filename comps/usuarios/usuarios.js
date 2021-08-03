'use strict';

angular.module('app.usuarios', ['datatables', 'datatables.buttons', 'datatables.bootstrap','ngRoute', 'ngNotify','cgNotify', 'ngMap', 'angular-bind-html-compile', 'swxLocalStorage'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/usuarios', {
      templateUrl: 'comps/usuarios/usuarios.html',
      controller: 'usuariosCtrl'
    });
  }])

  .controller('usuariosCtrl', ['$scope', 'localstorage', '$q', '$rootScope', 'DTOptionsBuilder', 'DTColumnBuilder', '$routeParams', '$interval', '$timeout', 'ngNotify','notify', 'request', 'NgMap','$localStorage',
    function($scope, localstorage, $q, $rootScope, DTOptionsBuilder, DTColumnBuilder, $routeParams, $interval, $timeout, ngNotify, notify, request, NgMap, $localStorage) {
        $scope.loading = false
        var userLog = localStorage.getItem('user')
        $scope.userLogged = JSON.parse(userLog)
      $scope.array_user = [];
      $scope.user = {};
      $scope.user_view = {};
      $scope.type_user = [

        {'id': 1, type : "admin", text: "Administrador"},
        {'id': 2, type : "generic", text: "Generico"},

      ];
      $scope.estatus_user = [

        {'id': 1, text: "Activo"},
        {'id': 2, text: "Inactivo"},

      ];
      var ip = IP_SERVER_PYTHON;

      $scope.nombre_cliente = null;
      $scope.client = {};
      $scope.typeview = ''
      $scope.client_info = {};
      $scope.hasUserClient = false;
      $scope.clientes=[];
      $scope.clientIndex = -1
      $scope.usuarios=[]
      $scope.permisos ={"deuda":{"ver":false},"cliente":{"ver":false},"perfil":{"ver":false,"editar":false},"producto":{"ver":false},"factura":{"ver":false},"pedido":{"ver":false,"crear":false,"editar":false,"eliminar":false},"usuario":{"ver":false,"crear":false,"editar":false,"eliminar":false},"estadisticas":{"ver":false}}

          $scope.permisosAccess ={
                "deuda": {
                  "access":["root","sisAdm","seller","admin","generic" ]
                },
                "cliente": {
                  "access":["root", "sisAdm","seller" ]
                },
                "perfil": {
                  "access":["root","sisAdm","seller","admin","generic" ]
                },
                "producto": {
                  "access":["root", "sisAdm","seller","admin","generic" ]
                },
                "factura": {
                  "access":["root", "sisAdm","seller","admin","generic" ]
                },
                "pedido": {
                  "access":["root", "sisAdm","seller","admin","generic" ]
                },
                "usuario": {
                  "access":['root', 'sisAdm', 'admin' ]
                },
                "estadisticas": {
                  "access":["root","sisAdm","seller","admin","generic" ]
                },

              }
      $scope.modulos = Object.keys($scope.permisos)
      $scope.tabs = 1
      $scope.tabsIndex = 0

      $scope.nextStep = function () {
        $scope.goToTab($scope.tabsIndex + 1 );
      }

      $scope.goToTab = function (index) {
        if(index <= $scope.tabs )
          $scope.tabsIndex = index

      }



      $scope.getUsers = function () {
        $scope.loading = true
        var body = {}
        body.pNoCia = ($scope.client.COD_CIA)?  $scope.client.COD_CIA : $scope.client.cod_cia ;
        body.pNoGrupo = ($scope.client.GRUPO_CLIENTE)? $scope.client.GRUPO_CLIENTE: $scope.client.grupo_cliente;
        body.pCliente = ($scope.client.COD_CLIENTE)? $scope.client.COD_CLIENTE: $scope.client.cod_cliente;
        if($scope.userLogged.role == 'root' ){
          if(body.pCliente == null){
            body.role = $scope.userLogged.role
          }

        }
        console.log(body)
         request.post(ip+'/get/users', body, {'Authorization': 'Bearer ' + localstorage.get('token')})
          .then(function successCallback(response) {
              $scope.loading = false
            console.log(response.data)
            $scope.usuarios = response.data
         });
      }

      $scope.getUser = function (username) {
        $scope.loading = true
        var body = {}
        body.pNoCia = ($scope.client.COD_CIA)?  $scope.client.COD_CIA : $scope.client.cod_cia ;
        body.pNoGrupo = ($scope.client.GRUPO_CLIENTE)? $scope.client.GRUPO_CLIENTE: $scope.client.grupo_cliente;
        body.pCliente = ($scope.client.COD_CLIENTE)? $scope.client.COD_CLIENTE: $scope.client.cod_cliente;
        body.username = username
         request.post(ip+'/get/user', body, {'Authorization': 'Bearer ' + localstorage.get('token')})
          .then(function successCallback(response) {
            console.log(response.data)
            $scope.user = response.data
            $scope.permisos = $scope.user.permisos
            $scope.typeview = 'view'
            $scope.modalTitle = 'Ver usuario'
            $scope.loading = false
         });
      }
      $scope.hasOwnProp = function (mod,prop) {
        if($scope.permisos[mod])
          return $scope.permisos[mod].hasOwnProperty(prop)
      }

      $scope.modalTitle = ""

      $scope.createUser = function () {
        $scope.reset()
        $scope.modalTitle = 'Crear usuario'
        $scope.typeview = 'add'
      }
      $scope.username = null
      $scope.confirmModal = function (username) {
        $scope.username = username
      }

      verificClient()

      function verificClient(){

       var client = localStorage.getItem('client')
       var client_info = localStorage.getItem('client_info')
       console.log(client)
        if ( Object.keys(JSON.parse(client)).length === 0 ){
         $scope.hasUserClient = false;
       }else{
         $scope.hasUserClient = true;
         $scope.client_info = JSON.parse(client_info);
         $scope.client = JSON.parse(client);
       }
       $scope.getUsers()
       console.log($scope.client)
     }

     $scope.selectCLient = function(){

       // $scope.client = x
       if($scope.clientes.length > 0){
         $scope.client  = $scope.clientes[ $scope.clientIndex ];
         // $scope.hasUserClient = true;
         console.log($scope.client )
         $scope.getUsers()
         angular.element('#clientes').focus();
       }


     }

     $scope.reset = function(){
       $scope.user = {};
      //  $scope.permisos = {"deuda":{"ver":false},"cliente":{"ver":false},"perfil":{"ver":false,"editar":false},"producto":{"ver":false},"factura":{"ver":false},"pedido":{"ver":false,"crear":false,"editar":false,"eliminar":false},"usuario":{"ver":false,"crear":false,"editar":false,"eliminar":false}}
       $scope.permisos ={"deuda":{"ver":false},"cliente":{"ver":false},"perfil":{"ver":false,"editar":false},"producto":{"ver":false},"factura":{"ver":false},"pedido":{"ver":false,"crear":false,"editar":false,"eliminar":false},"usuario":{"ver":false,"crear":false,"editar":false,"eliminar":false},"estadisticas":{"ver":false}}
      // $scope.nombre_cliente = null;
       // $scope.hasUserClient = false;
       // $scope.clientes=[];
       // $scope.clientIndex = -1
     }
     $scope.getClientNew = function (filter = false) {
       $scope.loading = true
       console.log("getClientNew");
       var body = {};
       if(filter){
         body.pNombre = $scope.nombre_cliente
       }
       request.post(ip+'/procedure_clientes', body,{})
       .then(function successCallback(response) {
         console.log(response)

         $scope.clientes = response.data.obj
         $scope.loading = false

       }, function errorCallback(response) {
         console.log(response)
         $scope.loading = false
       });
     }

     $scope.usernameValid = false;
     $scope.availableUser = function (filter = false) {
       console.log("availableUser");

       request.post(ip+'/available/user', $scope.user,{'Authorization': 'Bearer ' + localstorage.get('token')})
       .then(function successCallback(response) {
         console.log(response)
         if(response.data != null){
           $scope.usernameValid = true
         }else {
           $scope.usernameValid = false
         }
         // $scope.clientes = response.data.obj

       }, function errorCallback(response) {
         console.log(response)
       });
     }

     $scope.emailValid = false;
     $scope.availableEmail = function (filter = false) {
      console.log("availableEmail");

      request.post(ip+'/available/email', $scope.user,{'Authorization': 'Bearer ' + localstorage.get('token')})
      .then(function successCallback(response) {
        console.log(response)
        if(response.data != null){
          $scope.emailValid = true
        }else {
          $scope.emailValid = false
        }
        // $scope.clientes = response.data.obj

      }, function errorCallback(response) {
        console.log(response)
      });
    }

    $scope.validaUsuario = function (user) {

      if (!user.username || user.username == null || user.username == '' ) {
        notify({ message:'¡Seleccione un nombre de usuario !', position:'left', duration:10000, classes:'   alert-warning'});
        return true
      }
      if (!user.email || user.email == null || user.email == '') {
        notify({ message:'¡Seleccione un correo !', position:'left', duration:10000, classes:'   alert-warning'});
        return true
      }
      if (!user.estatus || user.estatus == null || user.estatus == '') {
        notify({ message:'¡Seleccione un estatus !', position:'left', duration:10000, classes:'   alert-warning'});
        return true
      }
      return false
    }

      $scope.addUser = function(user){
            $scope.loading = true
            user.password = "52400ede39b6a2098dc0ffb5aad536e6";
            if ( $scope.validaUsuario(user)) {
                $scope.loading = false
               return
            }
            user.username = user.username.toUpperCase()
            user.COD_CIA = ($scope.client.COD_CIA)?  $scope.client.COD_CIA : $scope.client.cod_cia ;
            user.GRUPO_CLIENTE = ($scope.client.GRUPO_CLIENTE)? $scope.client.GRUPO_CLIENTE: $scope.client.grupo_cliente;
            user.COD_CLIENTE = ($scope.client.COD_CLIENTE)? $scope.client.COD_CLIENTE: $scope.client.cod_cliente;
            user.permisos = $scope.permisos
            //
            console.log(user);
            request.post(ip+'/add/user', user,{'Authorization': 'Bearer ' + localstorage.get('token')})
                .then(function successCallback(response) {
                  console.log(response)
                  if (response.data == "OK") {
                        $scope.getUsers()
                    ngNotify.set('¡Usuario registrado exitosamente!','success')
                    $(function(){
                      $("#addUserModal").modal("hide");
                      $('.modal-backdrop').remove();
                    })
                  }
                  $scope.loading = false
                }, function errorCallback(response) {
                  $scope.loading = false
                  if(response.status == 400){
                    // notify({ message:response.data.msg, position:'left', duration:20000, classes:'   alert-danger'});
                    ngNotify.set(response.data.msg,'danger')
                  }
                });
        }

        $scope.updUser = function(user){
              $scope.loading = true
              // user.password = "ddo.2017";
              // if($scope.clientIndex!=-1 && user.role == 'cliente'){
                // user.role = "cliente"
              user.COD_CIA = ($scope.client.COD_CIA)?  $scope.client.COD_CIA : $scope.client.cod_cia ;
              user.GRUPO_CLIENTE = ($scope.client.GRUPO_CLIENTE)? $scope.client.GRUPO_CLIENTE: $scope.client.grupo_cliente;
              user.COD_CLIENTE = ($scope.client.COD_CLIENTE)? $scope.client.COD_CLIENTE: $scope.client.cod_cliente;
              user.permisos = $scope.permisos
              //
              console.log(user);
              request.post(ip+'/upd/user', user,{'Authorization': 'Bearer ' + localstorage.get('token')})
                  .then(function successCallback(response) {
                    console.log(response)
                    if (response.data == "OK") {
                          $scope.getUsers()
                      ngNotify.set('¡Usuario actualizado exitosamente!','success')
                    }
                      $scope.loading = false
                  }, function errorCallback(response) {
                    console.log(response)
                  });



          }

          $scope.delUser = function(){

                // user.password = "ddo.2017";
                // if($scope.clientIndex!=-1 && user.role == 'cliente'){
                  // user.role = "cliente"
                $scope.loading = true
                var body={}
                body.username = $scope.username
                // console.log(user);
                request.post(ip+'/del/user', body,{'Authorization': 'Bearer ' + localstorage.get('token')})
                    .then(function successCallback(response) {
                      console.log(response)
                      if (response.data == "OK") {
                            $scope.getUsers()
                        ngNotify.set('¡Usuario eliminado exitosamente!','success')
                      }
                      $scope.loading = false
                    }, function errorCallback(response) {
                      console.log(response)
                    });



            }

        $scope.listUser = function(){
          request.get(ip+'/get/user', {})
          .then(function(data){
            console.log(data);
            $scope.array_user = data.data;

          }, function(error){
            console.log(error);
          })
        }

      $scope.validaForm = function () {

        if (!$scope.client || Object.keys($scope.client).length === 0) {
          // ngNotify.set('Seleccione un cliente','warn')
          // $scope.hasUserClient = false;
          console.log('Seleccione un cliente','warn')
          return false;
        }
        if(!$scope.user_view){
          // ngNotify.set('Seleccione un nombre','warn')
          console.log('Seleccione un nombre','warn')
          return false;
        }
        if($scope.user_view.length < 5){
          // ngNotify.set('Nombre no valido','warn')
          console.log('Nombre no valido','warn')
          return false;
        }
        if($scope.user_view.role){
          // ngNotify.set('Debe seleccionar un tipo','warn')
          console.log('Debe seleccionar un tipo','warn')
          return false;
        }
        if(!$scope.user_view){
          // ngNotify.set('Seleccione un nombre de suario','warn')
          console.log('Seleccione un nombre de suario','warn')
          return false;
        }
        if($scope.user_view.length < 4){
          // ngNotify.set('Usuario no valido','warn')
          console.log('Usuario no valido','warn')
          return false;
        }

        return true;


      }

        $scope.showUser = function(user){
          $scope.user_view = user;
        }

        $scope.goToEdit = function () {
          $scope.typeview = 'edit'
        }

		// $scope.initDatatable = function(){
		// $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
    //     var defer = $q.defer();
    //
    //     request.post(ip+'/get/user', {'page': 1}, {'Authorization': 'Bearer ' + localstorage.get('token')})
    //       .then(function successCallback(response) {
    //         console.log(response)
		// 	         defer.resolve(response.data);
    //      });
    //
    //     return defer.promise;
		// })
		// .withDOM('frtip')
    //     .withPaginationType('full_numbers')
		// .withButtons([
    //
    //         'pdf',
    //         'excel'
    //     ])
    // .withLanguage(DATATABLE_LANGUAGE_ES)
    //
		// }
    //
		// $scope.initDatatable();

    $scope.validaAccess = function (modulo) {
      // console.log(modulo);
      // console.log($scope.permisosAccess[modulo].access);
      // console.log($scope.userLogged);
      var result = $scope.permisosAccess[modulo].access.indexOf($scope.userLogged.role);

      // console.log(result);

      if(result < 0 ){
        return false
      }
      return true
    }

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withOption('responsive', true)
        .withDOM('frtip')
        .withPaginationType('full_numbers')
        .withLanguage(DATATABLE_LANGUAGE_ES)
        .withDisplayLength(15)

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('name').withTitle('Nombre'),
            DTColumnBuilder.newColumn('username').withTitle('Username'),
            DTColumnBuilder.newColumn('role').withTitle('Tipo de usuario')
        ];

        //$scope.listUser();


    }]);

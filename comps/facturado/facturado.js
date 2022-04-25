'use strict';

angular.module('app.facturado', ['datatables', 'datatables.buttons', 'datatables.bootstrap','ngRoute', 'ngNotify', 'ngMap', 'angular-bind-html-compile', 'swxLocalStorage'])
  .config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/facturado', {
      templateUrl: 'comps/facturado/facturado.html',
      controller: 'facturadoCtrl'
    });
  }])
  .controller('facturadoCtrl', ['$scope', '$q', 'localstorage', '$http', '$rootScope', '$routeParams', '$interval', '$timeout', 'ngNotify', 'request', 'DTOptionsBuilder', 'DTColumnBuilder', 'NgMap','$localStorage',
    function($scope, $q, localstorage, $http, $rootScope, $routeParams, $interval, $timeout, ngNotify, request, DTOptionsBuilder, DTColumnBuilder, NgMap, $localStorage) {
        //init
        var ip = IP_SERVER_PYTHON;

        $scope.loading = false;
        $scope.hasUserClient = false;
        $scope.client = {};
        $scope.client_info = {}
        $scope.isEmpleado = false;
        $scope.totalesDdo = {                
        'descVol': 0, 
        'descDpp': 0,
        'desPreEmp': 0,
        'desCom': 0,
        'subTotExe': 0,
        'subTotGrav': 0,
        'iva': 0,
        'totalBs': 0,
        'totalUsd': 0,
        'anulada': "N",
        'tipoCambio': 0,
        'unidades': 0,
        'porcCom': 0,
        'porcVol': 0,
        'porcDpp': 0,
        'porcImp': 0,
        'porcInternet': 0,
        'descInternet': 0}

        verificClient()

        function verificClient(){

         var client = localStorage.getItem('client')
         var client_info = localStorage.getItem('client_info')
         console.log(client)
          if ( client=='{}' ){
           $scope.hasUserClient = false;
         }else{
           $scope.hasUserClient = true;
           $scope.client_info = JSON.parse(client_info);
           $scope.client = JSON.parse(client);
           facturacion()
           var grupo = ($scope.client.GRUPO_CLIENTE)? $scope.client.GRUPO_CLIENTE: $scope.client.grupo_cliente;
           // console.log(grupo);
           if(grupo == "02"){
             $scope.isEmpleado = true;
           }
         }
         console.log($scope.client)
       }

       function dateToNum(d) {
          // Convert date "26/06/2016" to 20160626
          d = d.split("/"); return Number(d[2]+d[1]+d[0]);
        }

    //     def agrupar_facturas(arreglo):
    // list = {}
    // for row in arreglo:
    //     if not row["nro_factura"] in list:
    //         list[int(row["nro_factura"])] = []

    // for row in arreglo:
    //     list[int(row["nro_factura"])].append(row)
 
    // return list

      function agruparFacturas(arreglo) {
        var list = []
        
        arreglo.forEach(element => {
          list[element["nro_factura"]].push(element)
        });
         return list
      }

       $scope.facturas = []
       $scope.facturasTotales = {}
       $scope.ofertas = null
       $scope.facturasList = []
       function facturacion() {
         $scope.loading = true
         var body = {}
         body.pNoCia = ($scope.client.COD_CIA)?  $scope.client.COD_CIA : $scope.client.cod_cia ;
         body.pNoGrupo = ($scope.client.GRUPO_CLIENTE)? $scope.client.GRUPO_CLIENTE: $scope.client.grupo_cliente;
         body.pCliente = ($scope.client.COD_CLIENTE)? $scope.client.COD_CLIENTE: $scope.client.cod_cliente;
          request.post(ip+'/procedure_facturacion', body, {'Authorization': 'Bearer ' + localstorage.get('token')})
           .then(function successCallback(response) {
             console.log(response.data)

            //  var facturas = agruparFacturas(response.data.obj)

             var facAux = Object.keys(response.data.obj)

             // $scope.facturas = Object.keys(response.data.obj)

             $scope.facturasList = response.data.obj
              var obj = {}
              var auxFact2 = []
            facAux.forEach((item, i) => {
              // console.log($scope.facturasList[item]);
              obj = {}
              obj.detalle = $scope.facturasList[item];
              obj.nro_factura = $scope.facturasList[item][0].nro_factura;
              obj.fecha_factura = $scope.facturasList[item][0].fecha_factura;
              obj.fecha_facturaDate = new Date($scope.facturasList[item][0].fecha_factura);
              obj.tipo_pedido = $scope.facturasList[item][0].tipo_pedido;
              obj.fecha_entrega = $scope.facturasList[item][0].fecha_entrega;

              $scope.facturasList[item].forEach((element, j) => {
                if( !$scope.facturasTotales.hasOwnProperty(element.nro_factura)){
                  $scope.facturasTotales[element.nro_factura] = {
                    total_bs: 0,
                    total_usd:0
                  }
                }
                $scope.facturasTotales[element.nro_factura].total_bs += element.total_producto
                $scope.facturasTotales[element.nro_factura].total_usd += element.total_producto_usd

              });
              // console.log($scope.facturasTotales);

              auxFact2.push(obj)
            });


            // $scope.facturas.sort(function (a, b) {
            //     return ('' + a.fecha_factura).localeCompare(b.fecha_factura);
            // })
            $scope.facturas = auxFact2.sort((a, b) => b.fecha_facturaDate - a.fecha_facturaDate)
            console.log($scope.facturas);
            $scope.loading = false
          });
       }
          $scope.totalfactura = {
            "bs" : 0,
            "usd": 0
          }
          $scope.factura = []
          $scope.selectFactura = function (fact) {
            $scope.factura = []
            $scope.totalesDdo = {                
              'descVol': 0, 
              'descDpp': 0,
              'desPreEmp': 0,
              'desCom': 0,
              'subTotExe': 0,
              'subTotGrav': 0,
              'iva': 0,
              'totalBs': 0,
              'totalUsd': 0,
              'anulada': "N",
              'tipoCambio': 0,
              'unidades': 0,
              'porcCom': 0,
              'porcVol': 0,
              'porcDpp': 0,
              'porcImp': 0,
              'porcInternet': 0,
              'descInternet': 0}
            console.log(fact);
            var body = {}
            body.pPedido = fact[0].id_pedido
            body.pNoCia = ($scope.client.COD_CIA)?  $scope.client.COD_CIA : $scope.client.cod_cia ;
            body.pNoFisico = fact[0].nro_factura


            // nro_factura

            request.post(ip+'/totales_factura', body, {'Authorization': 'Bearer ' + localstorage.get('token')})
            .then(function successCallback(response) {

              console.log(response);
              $scope.totalesDdo = response.data.totales
              // $scope.totalesDdo.anulada="S"

           });

            request.post(ip+'/ofertas/pedido', body, {'Authorization': 'Bearer ' + localstorage.get('token')})
            .then(function successCallback(response) {

              // console.log(response);

              $scope.ofertas=response.data.obj.mensaje

              // console.log("======================ORDENADO=======================")
              // console.log(fact);
              $scope.factura = fact
              $scope.totalfactura.bs =  $scope.facturasTotales[fact[0].nro_factura].total_bs
              $scope.totalfactura.usd =  $scope.facturasTotales[fact[0].nro_factura].total_usd

           });
            

            // fact.sort(function (a, b) {
            //   if (a.v_lin > b.v_lin) {
            //     return 1;
            //   }
            //   if (a.v_lin < b.v_lin) {
            //     return -1;
            //   }
              // a must be equal to b
            //   return 0;
            // })


              // angular.element('#btnfacturaInfo').trigger('click');
          }
          $scope.clientes = null;
          $scope.nombre_cliente = null;


          $scope.selectCLient = function(){

            // $scope.client = x
            if($scope.clientes && $scope.clientes.length > 0){
              $scope.client  = $scope.clientes[ $scope.clientIndex ];
                console.log($scope.client,"selectCLient" )
                facturacion()
                if($scope.client.grupo_cliente == "02"){
                  $scope.isEmpleado = true;
                }
                angular.element('#clientes').focus();
            }


              // selectCLientCAP( $scope.client)

          }

          const formatterUSD = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          })
          const formatterVe = new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES'
          })
          const formatterVeDECIMAL = new Intl.NumberFormat('es-VE', {
          })

          $scope.formato = function(tipo, valor){
            if(tipo == 1){
              return formatterVeDECIMAL.format(valor)
            }
            if(tipo==2){
              return "Bs."+formatterVeDECIMAL.format(valor)
            }
            if(tipo==3){
              return formatterUSD.format(valor)
            }
          }

          $scope.calculaMontoLinea=function (monto, cantidad, tipo) {

              // console.log(cantidad);
              // console.log(parseFloat(monto));
              // return $scope.formato(tipo, monto * parseInt(cantidad))
              return $scope.formato(tipo, monto )
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

          $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withPaginationType('full_numbers')
                    .withOption('responsive', true)
                    .withDOM('frtip').withPaginationType('full_numbers')
                    .withLanguage(DATATABLE_LANGUAGE_ES)
                    .withDisplayLength(20)
                    .withOption('bFilter', false)


        $scope.dtOptionsFact = DTOptionsBuilder.newOptions()
                  .withPaginationType('full_numbers')
                  .withOption('responsive', true)
                  .withDOM('frtip').withPaginationType('full_numbers')
                  .withLanguage(DATATABLE_LANGUAGE_ES)
                  .withDisplayLength(20)
                  .withOption('bFilter', false)


    }
]);


'use strict';

    angular.module('faceMgrClientApp',[])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise('login');

            $stateProvider
                .state('login', {
                  url: '/login',
                  views: {
                    'main@': {
                      templateUrl: 'login/login.html',
                      controller: 'LoginCtrl'
                    }
                  },
                  authenticate: false
                })
        }
    ]);

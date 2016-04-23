'use strict';
    
angular.module('faceMgrClientApp', ['ui.router'])
  .config(["$stateProvider","$urlRouterProvider",routeConfig])

    function routeConfig($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
     // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'common/home.html'
        })

        // nested list with custom controller
        .state('home.list', {
            url: '/list',
            templateUrl: 'common/partial-home-list.html',
            controller: function($scope) {
                $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
            }
        })

        // nested list with just some random string data
        .state('home.paragraph', {
            url: '/paragraph',
            template: 'I could sure use a drink right now.'
        })

        .state("login",{
            url:"/login",
            templateUrl:'login/login.html'
        })

        .state('about', {
            url: '/about',
            templateUrl:'common/about.html'
        
        });
    }


 
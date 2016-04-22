'use strict';
    angular
        .module('myApp',[])
        .controller('PhoneListCtrl',PhoneListCtrl);

    function PhoneListCtrl($scope,$location){
    $scope.phones = [
        {"name":"apple",
         "model":"iphone6s"},
        {"name":"htc",
         "model":"one"}
    ];
    $scope.hello = "hello world";

    // $scope.jumpToUrl = function(path){
    //     $location.path(path);
    //     var curUrl = $location.absUrl();
    // };
}
 
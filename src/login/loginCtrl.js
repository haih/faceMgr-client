
    angular.module('faceMgrClientApp')
        .controller('LoginCtrl',LoginCtrl);

    function LoginCtrl($scope){
        $scope.form = {};
        $scope.loginForm=function(){
            console.log($scope.form);
        }
    }
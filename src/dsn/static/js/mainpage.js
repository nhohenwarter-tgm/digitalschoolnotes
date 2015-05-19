var mainpageApp = angular.module('mainpageApp', ['ui.router','ngCookies']);

mainpageApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    // CONTENT
    $stateProvider.state('content', {
        url: '/',
        templateUrl: '/mainpage/mainpage_content.html',
        controller: 'contentCtrl'
    });

    // LOGIN
    $stateProvider.state('login', {
        url: '/',
        templateUrl: '/mainpage/login.html',
        controller: 'loginCtrl'
    });

    // RESET PASSWORD
    $stateProvider.state('reset_pwd', {
        url: '/',
        templateUrl: '/mainpage/reset_password.html',
        controller: 'resetPwdCtrl'
    });

    $locationProvider.html5Mode(true);

    // CSRF TOKEN
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});

mainpageApp.controller('contentCtrl', function($scope, $http, $cookies){
    $http({
            method  : 'GET',
            url     : '/api/csrf',
            headers : {'Content-Type': 'application/json'},
            data    : {}
        })
            .success(function(data){
                console.log($cookies['csrftoken']);
            })
            .error(function(data){

            });

    $scope.error = false;

    $scope.submitRegister = function(){
        var email = $scope.email;
        var password = $scope.password;
        var password_repeat = $scope.password_repeat;
        var first_name = $scope.firstname;
        var last_name = $scope.lastname;
        var accept = $scope.accept;
        $scope.error = false;
        $scope.registration_error = '';
        if(email == null || password == null || password_repeat == null || first_name == null || last_name == null) {
            $scope.error = true;
            $scope.registration_error = 'Bitte füll alle Felder aus!\n';
        }
        if(!accept){
            $scope.error = true;
            $scope.registration_error += 'Bitte akzeptiere unsere Nutzungsbedingungen!\n';
        }
        if(password != password_repeat){
            $scope.error = true;
            $scope.registration_error += 'Passwörter stimmen nicht überein!\n';
        }

        if(!$scope.error) {
            $http({
                method: 'POST',
                url: '/api/register',
                headers: {'Content-Type': 'application/json'},
                data: {
                    email: email,
                    password: CryptoJS.SHA256(password),
                    password_repeat: CryptoJS.SHA256(password_repeat),
                    firstname: first_name,
                    lastname: last_name,
                    accept: accept
                }
            })
                .success(function (data) {
                    if (data['registration_error'] != null) {
                        $scope.error = true;
                        $scope.registration_error = data['registration_error'];
                    }
                })
                .error(function (data) {

                });
        }
    }
});

mainpageApp.controller('loginCtrl', function($scope, $http){
    $scope.submitLogin = function(){
        var email = $scope.email;
        var password = $scope.password;
        $http({
            method  : 'POST',
            url     : '/api/login',
            headers : {'Content-Type': 'application/json'},
            data    : {email: email, password: CryptoJS.SHA256(password)}
        })
            .success(function(data){
                if (data['login_error'] != null) {
                    $scope.error = true;
                    $scope.login_error = data['login_error'];
                }
            })
            .error(function(data){

            });
    }
});

mainpageApp.controller('resetPwdCtrl', function($scope){
    $scope.a = '3';
});
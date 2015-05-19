var mainpageApp = angular.module('mainpageApp', ['ui.router']);

mainpageApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

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

});

mainpageApp.controller('contentCtrl', function($scope){
    $scope.a = '1';
});

mainpageApp.controller('loginCtrl', function($scope){
    $scope.a = '2';
});

mainpageApp.controller('resetPwdCtrl', function($scope){
    $scope.a = '3';
});
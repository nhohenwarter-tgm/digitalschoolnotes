var administrationApp = angular.module('administrationApp', ['ui.router']);

administrationApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/admin');

    // USERMANAGEMENT
    $stateProvider.state('usermanagement', {
        url: '/admin',
        templateUrl: '/admin/admin_usermanagement.html',
        controller: 'usermanagementCtrl'
    });

    // BILLS
    $stateProvider.state('bills', {
        url: '/admin',
        templateUrl: '/admin/admin_bills.html',
        controller: 'billsCtrl'
    });

    // LDAP CONFIGURATION
    $stateProvider.state('ldapConfiguration', {
        url: '/admin',
        templateUrl: '/admin/admin_ldapConfiguration.html',
        controller: 'ldapConfigurationCtrl'
    });

    // USER QUOTAS
    $stateProvider.state('userquotas', {
        url: '/admin',
        templateUrl: '/admin/admin_userquotas.html',
        controller: 'userquotasCtrl'
    });

    // STATISTICS
    $stateProvider.state('statistics', {
        url: '/admin',
        templateUrl: '/admin/admin_statistics.html',
        controller: 'statisticsCtrl'
    });

    $locationProvider.html5Mode(true);

    // CSRF TOKEN
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});

administrationApp.controller('usermanagementCtrl', function($scope, $http){
    $http({
        method  : 'GET',
        url     : '/api/admin_user',
        data    : {}
    })
        .success(function(data){
            $scope.users = data;
        })
        .error(function(data){

        });
});

administrationApp.controller('deleteCtrl', function($scope, $http){
    $scope.delete = function(){
        $http({
            method  : 'GET',
            url     : '/api/delete',
            data    : {}
        })
            .success(function(data){
                alert("A")
            })
            .error(function(data){
                alert("B")
            });
    }
});

administrationApp.controller('billsCtrl', function($scope){
    $scope.a = '1';
});

administrationApp.controller('ldapConfigurationCtrl', function($scope){
    $scope.a = '2';
});

administrationApp.controller('statisticsCtrl', function($scope){
    $scope.a = '3';
});

administrationApp.controller('logoutCtrl', function($scope, $http){
    $scope.logout = function(){
        $http({
            method  : 'GET',
            url     : '/api/logout',
            data    : {}
        })
            .success(function(data){
                if (data['logout_error'] != null) {
                    $scope.error = true;
                    $scope.logout_error = data['logout_error'];
                }
            })
            .error(function(data){

            });
    }
});

administrationApp.run(function($rootScope, $state, $http){
    $http({
        method  : 'GET',
        url     : '/api/csrf',
        headers : {'Content-Type': 'application/json'},
        data    : {}
    })
        .success(function(data){

        })
        .error(function(data){

        });
});
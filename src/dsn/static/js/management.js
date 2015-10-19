var managementApp = angular.module('managementApp', ['ui.router']);

managementApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/management');

    // TIMETABLE
    $stateProvider.state('timetable', {
        url: '/management',
        templateUrl: '/management/management_timetable.html',
        controller: 'timetableCtrl'
    });

    // ACCOUNT SETTINGS
    $stateProvider.state('accsettings', {
        url: '/management',
        templateUrl: '/management/management_accsettings.html',
        controller: 'accsettingsCtrl'
    });

    // NOTEBOOKS
    $stateProvider.state('notebooks', {
        url: '/management',
        templateUrl: '/management/management_notebooks.html',
        controller: 'notebooksCtrl'
    });

    // PROFILE
    $stateProvider.state('profile', {
        url: '/management/profile',
        templateUrl: '/management/management_profile.html',
        controller: 'profileCtrl'
    });

    $locationProvider.html5Mode(true);

});

managementApp.controller('accsettingsCtrl', function($scope){
    $scope.a = '1';
});

managementApp.controller('notebooksCtrl', function($scope){
    $scope.a = '2';
});

managementApp.controller('timetableCtrl', function($scope){
    $scope.a = '3';
});

managementApp.controller('profileCtrl', function($scope, $http){
    $http({
        method: 'GET',
        url: '/api/profile'
    }).success(function(data){
            $scope.first_name = data['first_name'];
            $scope.last_name = data['last_name'];
            $scope.email = data['email'];
            $scope.date_joined = data['date_joined'];
            console.log(data);
        }

    )

});
var mainApp = angular.module('mainApp');
mainApp.controller('managementCtrl', function ($scope, $http, $state) {
    $scope.search = function () {
        $http({
            method: 'POST',
            url: '/api/otherprofile',
            headers: {'Content-Type': 'application/json'},
            data: {searchtext: $scope.q}
        })
            .success(function (data) {
                $scope.profiles = data['profiles'];
                $state.go('management.search');
            })
            .error(function (data) {
            });
    }
});

mainApp.controller('accsettingsCtrl', function ($scope) {
});

mainApp.controller('notebooksCtrl', function ($scope, $http) {
    $http({
        method: 'POST',
        url: '/api/get_notebooks'
    }).success(function(data){
                $scope.notebooks = JSON.parse(data['notebooks']);
            })
});

mainApp.controller('timetableCtrl', function ($scope, $http) {
    $scope.submitTimeTable = function () {
        var subject = $scope.subject;
        var teacher = $scope.teacher;
        var begin = $scope.begin;
        var end = $scope.end;
        var room = $scope.room;
        $http({
            method: 'POST',
            url: '/api/timetable',
            headers: {'Content-Type': 'application/json'},
            data: {subject: subject, teacher: teacher, begin: begin, end: end, room: room}
        })
            .success(function (data) {
            })
            .error(function (data) {

            });
    }
});

mainApp.controller('notebooksCreateCtrl', function ($scope, $http, loggedIn) {
    $scope.submitCreateNotebook = function () {
        var name = $scope.name;
        var is_public = $scope.is_public;
        $http({
            method: 'POST',
            url: '/api/notebooks_create',
            headers: {'Content-Type': 'application/json'},
            data: {
                name: name,
                is_public: is_public
            }
        });
    }
});

mainApp.controller('notebooksEditCtrl', function($scope, $http, loggedIn){

    $scope.submitEditNotebook = function() {
        var name = $scope.name;
        var is_public = $scope.is_public;
        $http({
            method: 'POST',
            url: '/api/notebooks_edit',
            headers: {'Content-Type': 'application/json'},
            data: {
                name: name,
                is_public: is_public
            }
        });
    }
});

mainApp.controller('logoutCtrl', function($scope, $http, $state){
    $scope.logout = function(){
        $http({
            method: 'GET',
            url: '/api/logout',
            data: {}
        })
            .success(function (data) {
                $state.go('mainpage.content');
            })
            .error(function (data) {
                alert('Beim ausloggen ist ein Fehler aufgetreten! Bitte versuche es erneut!');
            });
    }
});

mainApp.controller('profileCtrl', function($scope, $http, $stateParams){
    $http({
        method: 'POST',
        url: '/api/profile',
        data: {id: $stateParams.id}
    }).success(function(data){
            $scope.first_name = data['first_name'];
            $scope.last_name = data['last_name'];
            $scope.email = data['email'];
            $scope.date_joined = data['date_joined'].substring(0, 10);
            $scope.is_prouser = data['is_prouser'];
            $scope.is_admin = data['is_superuser'];
            $scope.notebooks = JSON.parse(data['notebooks']);
            console.log(data);
        }
    )
});

mainApp.controller('searchCtrl', function ($scope,$http) {
});
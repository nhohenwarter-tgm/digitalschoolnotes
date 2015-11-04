var mainApp = angular.module('mainApp');
mainApp.controller('managementCtrl', function ($scope, $http, $state) {
    $scope.search = function () {
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        $scope.l = 0;
        $scope.sort = {
            sortingOrder: 'email'
        };
        $http({
            method: 'POST',
            url: '/api/otherprofile',
            headers: {'Content-Type': 'application/json'},
            data: {searchtext: $scope.q, Page: $scope.currentPage, counter: $scope.itemsPerPage,}
        })
            .success(function (data) {
                localStorage.setItem('search', document.getElementById('search').value);
                $scope.profiles = data['profiles'];
                localStorage.setItem('profiles', data['profiles']);
                $scope.len = data['len'];
                localStorage.setItem('len', $scope.len);
                $scope.currentPage = 0;
                localStorage.setItem('currentPage', $scope.currentPage);
                $scope.l = Math.ceil($scope.len/$scope.itemsPerPage);
                localStorage.setItem('l', $scope.l);
                $state.go('management.search');
            })
            .error(function (data) {
            });
    }
    $scope.len = localStorage.getItem('len');
    $scope.q = localStorage.getItem('search');
    //$scope.profiles = localStorage.getItem('profiles');
    $scope.l = localStorage.getItem('l');
    $scope.currentPage = localStorage.getItem('currentPage');
    $scope.search();

    $scope.next = function (current) {
        $http({
            method: 'POST',
            url: '/api/otherprofile',
            headers: {'Content-Type': 'application/json'},
            data: {searchtext: $scope.q, Page: current, counter: $scope.itemsPerPage,}
        })
            .success(function (data) {
                $scope.profiles = data['profiles'];
                localStorage.setItem('profiles', data['profiles']);
                localStorage.setItem('currentPage', $scope.currentPage);
            })
            .error(function (data) {
            });
    }


    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    $scope.range = function (size, start, end) {
        var ret = [];
        if (size < end) {
            end = size;
            start = size;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.firstPage = function () {
        $scope.currentPage = 0;
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.l- 1) {
            $scope.currentPage++;
        }
    };

    $scope.lastPage = function () {
        $scope.currentPage = $scope.l-1;
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };
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

mainApp.controller('notebooksCreateCtrl', function ($scope, $http, loggedIn, $state) {
    $scope.submitCreateNotebook = function () {
        var name = $scope.name;
        if($scope.is_public == true){
             var is_public = true;
        }
        else {
            var is_public = false;
        }

        $http({
            method: 'POST',
            url: '/api/notebooks_create',
            headers: {'Content-Type': 'application/json'},
            data: {
                name: name,
                is_public: is_public
            }
        })
            .success(function (data) {
                if(data['message'] != null){
                    $scope.message = data['message'];
                }else{
                    $state.go('management.notebooks');
                }
            })
            .error(function (data) {

            });
    }
});

mainApp.controller('editNotebookCtrl', function($scope, $http, $stateParams, loggedIn){

    $http({
            method: 'POST',
            url: '/api/get_notebook',
            headers: {'Content-Type': 'application/json'},
            data: {
                id: $stateParams.id
            }
        })
            .success(function (data) {
                $scope.notebookname = JSON.parse(data['notebook'])['name'];
                $scope.notebook_is_public = JSON.parse(data['notebook'])['is_public'];
                if(data['message'] != null){
                    $scope.message = data['message'];
                }else{
                    $state.go('management.notebooks');
                }
            })
            .error(function (data) {
                $scope.notebookname = "";
                $scope.notebook_is_public = "";
            });

    $scope.submitEditNotebook = function() {
        var name = $scope.name;
        var is_public = $scope.is_public;
        $http({
            method: 'POST',
            url: '/api/notebook_edit',
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
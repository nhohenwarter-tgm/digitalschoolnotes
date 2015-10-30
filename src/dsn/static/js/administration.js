var administrationApp = angular.module('administrationApp', ['ui.router']);

administrationApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/admin');

    // HEADER
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: '/admin/admin.html',
        controller: 'adminCtrl',
        data: {
            authorization: true,
            admin: true
        }
    });

    // USERMANAGEMENT
    $stateProvider.state('admin.usermanagement', {
        url: '',
        templateUrl: '/admin/admin_usermanagement.html',
        controller: 'usermanagementCtrl',
        data: {
            authorization: true,
            admin: true
        }
    });

    // BILLS
    $stateProvider.state('admin.bills', {
        url: '',
        templateUrl: '/admin/admin_bills.html',
        controller: 'billsCtrl',
        data: {
            authorization: true,
            admin: true
        }
    });

    // LDAP CONFIGURATION
    $stateProvider.state('admin.ldapConfiguration', {
        url: '',
        templateUrl: '/admin/admin_ldapConfiguration.html',
        controller: 'ldapConfigurationCtrl',
        data: {
            authorization: true,
            admin: true
        }
    });

    // USER QUOTAS
    $stateProvider.state('admin.userquotas', {
        url: '',
        templateUrl: '/admin/admin_userquotas.html',
        controller: 'userquotasCtrl',
        data: {
            authorization: true,
            admin: true
        }
    });

    // STATISTICS
    $stateProvider.state('admin.statistics', {
        url: '',
        templateUrl: '/admin/admin_statistics.html',
        controller: 'statisticsCtrl',
        data: {
            authorization: true,
            admin: true
        }
    });

    $locationProvider.html5Mode(true);

    // CSRF TOKEN
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});

administrationApp.controller('adminCtrl', function(){

});

administrationApp.controller('usermanagementCtrl', function ($scope, $http, $filter, $window) {

    $scope.itemsPerPage = 2;
    $scope.security_list = [{name: 'Benutzer', security_level: 1},
                {name: 'Pro User', security_level: 2},{name: 'Administrator', security_level: 3}];
    $scope.currentPage = 0;
    $scope.l = 0;
    $scope.sort = {
        sortingOrder: 'email'
    };

    $scope.next = function (current) {
        $http({
            method: 'POST',
            url: '/api/admin_user',
            headers : {'Content-Type': 'application/json'},
            data    : {Page: current, counter: $scope.itemsPerPage}
        })
            .success(function (data) {
                $scope.users = data['test'];
            })
            .error(function (data) {
            });
    }


    $http({
        method: 'GET',
        url: '/api/admin_user',
        data: {}
    })
        .success(function (data) {
            $scope.users = data['test'];
            $scope.len = data['len'];
            $scope.currentPage = 0;
            $scope.l = Math.floor($scope.len / $scope.itemsPerPage) + $scope.len % $scope.itemsPerPage;

        })
        .error(function (data) {

        });

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
    
    $scope.send = function (email, subject, body) {
        var link = "mailto:" + email
            + "?subject=New%20email " + escape(subject)
            + "&body=" + escape(body);

        window.location.href = link;
    }

    $scope.delete = function (email,currentPage) {

        deleteUser = $window.confirm('Wollen Sie den User '+email+' wirklich löschen?');
        if(deleteUser){
            alert('Der User '+email+' wurde erfolgreich gelöscht');
            $http({
            method: 'POST',
            url: '/api/delete',
            headers: {'Content-Type': 'application/json'},
            data: {email: email}
        })
            .success(function (data) {
                $window.location.href = '/admin';
            })
            .error(function (data) {
            });
        }
    }

    $scope.update = function(email, securty_level, index){
        $http({
            method: 'POST',
            url: '/api/admin_user_update',
            headers: {'Content-Type': 'application/json'},
            data: {email: email, security_level: securty_level}
        })
            .success(function (data) {
                alert($scope.users[index].security_level);
                $scope.users[index].security_level = securty_level;
            })
            .error(function (data) {
            });
    }

     $scope.search = function(text){
         alert(text);
        $http({
            method: 'POST',
            url: '/api/admin_user_search',
            headers: {'Content-Type': 'application/json'},
            data: {text: text}
        })
            .success(function (data) {
                alert("A");
                $scope.users = data['test'];
            })
            .error(function (data) {
            });
    }

    $scope.sort = function(spalte){
        $http({
            method: 'POST',
            url: '/api/admin_user_sort',
            headers: {'Content-Type': 'application/json'},
            data: {spalte: spalte}
        })
            .success(function (data) {
                //
            })
            .error(function (data) {
            });
    }
});


administrationApp.controller('billsCtrl', function ($scope) {

});

administrationApp.controller('ldapConfigurationCtrl', function ($scope) {

});

administrationApp.controller('userquotasCtrl', function ($scope) {

});

administrationApp.controller('statisticsCtrl', function ($scope) {

});

administrationApp.controller('logoutCtrl', function ($scope, $http, $window) {
    $scope.logout = function () {
        $http({
            method: 'GET',
            url: '/api/logout',
            data: {}
        })
            .success(function (data) {
                $window.location.href = '/';
            })
            .error(function (data) {
                alert('Beim ausloggen ist ein Fehler aufgetreten! Bitte versuche es erneut!');
            });
    }
});

administrationApp.service('loggedIn', function ($http, $q) {
    this.getUser = function () {
        var d = $q.defer();
        $http({
            method  : 'POST',
            url     : '/api/loggedInUser',
            headers : {'Content-Type': 'application/json'},
            data    : {}
        }).success(function (data) {
            d.resolve(data);
        }).error(function (data) {
            d.reject(data);
        });
        return d.promise;

    };
});

administrationApp.run(function ($rootScope, $state, $http, $window, loggedIn) {
    $rootScope.show_header = false;
    $http({
        method: 'GET',
        url: '/api/csrf',
        headers: {'Content-Type': 'application/json'},
        data: {}
    })
        .success(function (data) {

        })
        .error(function (data) {

        });

    loggedIn.getUser().then(function(data){
        var user = data['user'];
        if(user == null){
            auth = false;
        }else{
            auth = user['is_admin'];
        }
        if(auth == false){
            $window.location.href = '/login';
        }else{
            $rootScope.show_header = true;
            $state.go('admin.usermanagement');
        }
    }, function(data){
        $window.location.href = '/login';
    });
});
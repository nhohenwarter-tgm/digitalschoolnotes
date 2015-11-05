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

    // USERMANAGEMENT
    $stateProvider.state('admin.usermanagementdetails', {
        url: '/test',
        templateUrl: '/admin/admin_usermanagement_details.html',
        controller: 'usermanagementdetailsCtrl',
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

administrationApp.controller('adminCtrl', function () {

});

administrationApp.controller('usermanagementCtrl', function ($scope, $http, $filter, $window) {

    $scope.itemsPerPage = 20;
    $scope.security_list = [{name: 'Benutzer', security_level: 1},
        {name: 'Pro User', security_level: 2}, {name: 'Administrator', security_level: 3}, {
            name: 'Inaktiv',
            security_level: 4
        }];
    $scope.currentPage = 0;
    $scope.l = 0;
    $scope.sort = {
        sortingOrder: 'email'
    };
    $scope.order = null;
    $scope.spalte = null;

    $scope.next = function (current) {
        $http({
            method: 'POST',
            url: '/api/admin_user',
            headers: {'Content-Type': 'application/json'},
            data: {
                spalte: $scope.spalte,
                text: $scope.q,
                Page: current,
                counter: $scope.itemsPerPage,
                order: $scope.order
            }
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
            /**for(var i = 0; i<$scope.users.length; i++){
                var now =  new Date();
                now.setHours(now.getHours() - 98);
                var last =  new Date($scope.users[i].last_login);
                var diff = new Date((now.getTime() - last.getTime()));
                $scope.users[i].last_login = diff.getDay() + ' ' + diff.getHours() + ' ' + diff.getMinutes() + ' ' + diff.getSeconds();
                if(diff.getDay() >= 6){
                    alert("Write Mail to "+$scope.users[i].email);
                }
            }**/
            $scope.len = data['len'];
            $scope.currentPage = 0;
            $scope.l = Math.ceil($scope.len / $scope.itemsPerPage);
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
        if ($scope.currentPage < $scope.l - 1) {
            $scope.currentPage++;
        }
    };

    $scope.lastPage = function () {
        $scope.currentPage = $scope.l - 1;
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

    $scope.delete = function (email) {

        deleteUser = $window.confirm('Wollen Sie den User ' + email + ' wirklich löschen?');
        if (deleteUser) {
            alert('Der User ' + email + ' wurde erfolgreich gelöscht');
            $http({
                method: 'POST',
                url: '/api/admin_user',
                headers: {'Content-Type': 'application/json'},
                data: {
                    email: email,
                    text: $scope.q,
                    spalte: $scope.spalte,
                    Page: $scope.currentPage+1,
                    counter: $scope.itemsPerPage,
                    order: $scope.order
                }
            })
                .success(function (data) {
                    $scope.users = data['test'];
                    $scope.len = data['len'];
                    $scope.l = Math.ceil($scope.len / $scope.itemsPerPage);
                })
                .error(function (data) {
                });
        }
    }

    $scope.update = function (email, securty_level, index) {
        securty_level_old = $scope.users[index].security_level;
        Userup = $window.confirm('Soll der User ' + email + ' wirklich auf die Berechtigungsstufe ' + $scope.security_list[securty_level - 1].name + ' geändert werden?');
        if (Userup) {
            alert('Der User ' + email + ' wurde erfolgreich auf ' + $scope.security_list[securty_level - 1].name + 'geändert');
            $http({
                method: 'POST',
                url: '/api/admin_user_update',
                headers: {'Content-Type': 'application/json'},
                data: {
                    email: email,
                    security_level: securty_level
                }
            })
                .success(function (data) {
                    $scope.users[index].security_level = securty_level;
                    document.getElementById(email).selectedIndex = "" + securty_level - 1;
                })
                .error(function (data) {
                });
        } else {
            $scope.selectedDay;
            document.getElementById(email).selectedIndex = "" + securty_level_old - 1;
        }
    }

    $scope.search = function (current) {
        $http({
            method: 'POST',
            url: '/api/admin_user',
            headers: {'Content-Type': 'application/json'},
            data: {
                text: $scope.q,
                spalte: $scope.spalte,
                Page: current,
                counter: $scope.itemsPerPage,
                order: $scope.order
            }
        })
            .success(function (data) {
                $scope.users = data['test'];
                $scope.len = data['len'];
                $scope.currentPage = 0;
                $scope.l = Math.ceil($scope.len / $scope.itemsPerPage);
            })
            .error(function (data) {
            });
    }

    $scope.sort = function (spalte, current) {
        if ($scope.order == null) {
            $scope.order = true;
        } else {
            $scope.order = !$scope.order
        }
        $scope.spalte = spalte
        $http({
            method: 'POST',
            url: '/api/admin_user',
            headers: {'Content-Type': 'application/json'},
            data: {
                text: $scope.q,
                spalte: $scope.spalte,
                Page: current,
                counter: $scope.itemsPerPage,
                order: $scope.order
            }
        })
            .success(function (data) {
                $scope.users = data['test'];
                $scope.len = data['len'];
                $scope.l = Math.ceil($scope.len / $scope.itemsPerPage);
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

/**
administrationApp.controller('usermanagementdetailsCtrl', function ($scope) {
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open = function ($event) {
        alert("A");
        $scope.status.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.getDayClass = function (date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };
});
**/
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
            method: 'POST',
            url: '/api/loggedInUser',
            headers: {'Content-Type': 'application/json'},
            data: {}
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

    loggedIn.getUser().then(function (data) {
        var user = data['user'];
        if (user == null) {
            auth = false;
        } else {
            auth = user['is_admin'];
        }
        if (auth == false) {
            $window.location.href = '/login';
        } else {
            $rootScope.show_header = true;
            $state.go('admin.usermanagement');
        }
    }, function (data) {
        $window.location.href = '/login';
    });
});
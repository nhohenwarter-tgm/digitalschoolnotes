var mainApp = angular.module('mainApp', ['ui.router','ngCookies']);

mainApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    // MAIN PAGE
    $stateProvider.state('mainpage', {
        abstract: true,
        url: '',
        templateUrl: '/mainpage/mainpage.html',
        controller: 'mainpageCtrl',
        data: {
            authorization: false
        }
    });

    // MANAGEMENT PAGE
    $stateProvider.state('management', {
        abstract: true,
        url: '/management',
        templateUrl: '/mgmt/management.html',
        controller: 'managementCtrl',
        data: {
            authorization: true
        }
    });

    // CONTENT
    $stateProvider.state('mainpage.content', {
        url: '/',
        templateUrl: '/mainpage/mainpage_content.html',
        controller: 'contentCtrl',
        data: {
            authorization: false
        }
    });

    // LOGIN
    $stateProvider.state('mainpage.login', {
        url: '/login',
        templateUrl: '/mainpage/login.html',
        controller: 'loginCtrl',
        data: {
            authorization: false
        }
    });

    // RESET PASSWORD REQUEST
    $stateProvider.state('mainpage.reset_pwd_req', {
        url: '/resetpassword',
        templateUrl: '/mainpage/reset_password_req.html',
        controller: 'resetPwdCtrl',
        data: {
            authorization: false
        }
    });

    // RESET PASSWORD
    $stateProvider.state('mainpage.reset_pwd', {
        url: '/resetpassword/:hash',
        templateUrl: '/mainpage/reset_password.html',
        controller: 'resetPwdCtrl',
        data: {
            authorization: false
        }
    });

    // TIMETABLE
    $stateProvider.state('management.timetable', {
        url: '',
        templateUrl: '/mgmt/management_timetable.html',
        controller: 'timetableCtrl',
        data: {
            authorization: true
        }
    });

    // ACCOUNT SETTINGS
    $stateProvider.state('management.accsettings', {
        url: '',
        templateUrl: '/mgmt/management_accsettings.html',
        controller: 'accsettingsCtrl',
        data: {
            authorization: true
        }
    });

    // NOTEBOOKS
    $stateProvider.state('management.notebooks', {
        url: '/notebooks',
        templateUrl: '/mgmt/management_notebooks.html',
        controller: 'notebooksCtrl',
        data: {
            authorization: true
        }
    });

    // NOTEBOOKS
    $stateProvider.state('management.notebooks_create', {
        url: '/notebooks_create',
        templateUrl: '/mgmt/management_notebooks_create.html',
        controller: 'notebooksCtrl_create',
        data: {
            authorization: true
        }
    });

    // PROFILE
    $stateProvider.state('management.profile', {
        url: '/profile',
        templateUrl: '/mgmt/management_profile.html',
        controller: 'profileCtrl',
        data: {
            authorization: true
        }
    });

    $locationProvider.html5Mode(true);

    // CSRF TOKEN
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});

mainApp.service('loggedIn', function ($http) {
    this.isAdmin = function () {
        $http({
            method  : 'POST',
            url     : '/api/loggedInUser',
            headers : {'Content-Type': 'application/json'},
            data    : {}
        })
            .success(function(data){
                var user = data['user'];
                if(user == null){
                    return false;
                }else{
                    return user.is_admin;
                }
            })
            .error(function(data){
                return false
            });

    }
    this.isAuthenticated = function () {
        var getData = function() {
            $http({
                method  : 'POST',
                url     : '/api/loggedInUser',
                headers : {'Content-Type': 'application/json'},
                data    : {}
            }).then(function (result) {
                return result.data;
            });
            /**
            var user = data['user'];
            if(user == null){
                return false;
            }else{
                return user['is_active'];
            }
        }, function errorCallback(response) {
            return false;*/
        };
        return {getData: getData};

    }
});

mainApp.run(function($rootScope, $state, $http, $window, loggedIn){
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

    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        var authorization = toState.data.authorization;

        if (authorization){
            /**
            var auth = loggedIn.isAuthenticated().getData();
            var isAuth = auth.then(function(result){
                var user = result['user'];
                if(user == null){
                    alert("Not authenticated!");
                    return false;
                }else{
                    return user['is_active'];
                }
            });
            alert(toState.name + ": " + isAuth);
            if(!isAuth){
                alert('Bitte melde dich zuerst an!');
                event.preventDefault();
                //$state.go('mainpage.login');
                $window.location.href = '/login';
            }*/
        }
    });
});
var mainApp = angular.module('mainApp', ['ui.router','ngCookies','vcRecaptcha']);

mainApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    // MAIN PAGE
    $stateProvider.state('mainpage', {
        abstract: true,
        url: '',
        templateUrl: '/mainpage/mainpage.html',
        controller: 'mainpageCtrl',
        data: {
            authorization: false,
            admin: false
        }
    });

    // MANAGEMENT PAGE
    $stateProvider.state('management', {
        abstract: true,
        url: '/management',
        templateUrl: '/mgmt/management.html',
        controller: 'managementCtrl',
        data: {
            authorization: true,
            admin: false
        }
    });

    // CONTENT
    $stateProvider.state('mainpage.content', {
        url: '/',
        templateUrl: '/mainpage/mainpage_content.html',
        controller: 'contentCtrl',
        data: {
            authorization: false,
            admin: false
        }
    });

    // LOGIN
    $stateProvider.state('mainpage.login', {
        url: '/login',
        templateUrl: '/mainpage/login.html',
        controller: 'loginCtrl',
        data: {
            authorization: false,
            admin: false
        }
    });

    // VALIDATE EMAIL
    $stateProvider.state('mainpage.validate_email', {
        url: '/validate/{hash:[0-9a-z]{64,64}}', //
        templateUrl: '/mainpage/validate_email.html',
        controller: 'validateEmailCtrl',
        data: {
            authorization: false,
            admin: false
        }
    });

    // RESET PASSWORD
    $stateProvider.state('mainpage.reset_pwd', {
        url: '/resetpassword/{hash:[0-9a-z]{64,64}}',
        templateUrl: '/mainpage/reset_password.html',
        controller: 'resetPwdCtrl',
        data: {
            authorization: false,
            admin: false
        }
    });

    // RESET PASSWORD REQUEST
    $stateProvider.state('mainpage.reset_pwd_req', {
        url: '/passwordreset',
        templateUrl: '/mainpage/reset_password_req.html',
        controller: 'resetPwdCtrl',
        data: {
            authorization: false,
            admin: false
        }
    });

    // TIMETABLE
    $stateProvider.state('management.timetable', {
        url: '',
        templateUrl: '/mgmt/management_timetable.html',
        controller: 'timetableCtrl',
        data: {
            authorization: true,
            admin: false
        }
    });

    // ACCOUNT SETTINGS
    $stateProvider.state('management.accsettings', {
        url: '',
        templateUrl: '/mgmt/management_accsettings.html',
        controller: 'accsettingsCtrl',
        data: {
            authorization: true,
            admin: false
        }
    });

    // NOTEBOOKS
    $stateProvider.state('management.notebooks', {
        url: '/notebooks',
        templateUrl: '/mgmt/management_notebooks.html',
        controller: 'notebooksCtrl',
        data: {
            authorization: true,
            admin: false
        }
    });

    // NOTEBOOKS
    $stateProvider.state('management.notebooks_create', {
        url: '/notebooks_create',
        templateUrl: '/mgmt/management_notebooks_create.html',
        controller: 'notebooksCreateCtrl',
        data: {
            authorization: true,
            admin: false
        }
    });

    // PROFILE
    $stateProvider.state('management.profile', {
        url: '/profile',
        templateUrl: '/mgmt/management_profile.html',
        controller: 'profileCtrl',
        data: {
            authorization: true,
            admin: false
        }
    });

    $locationProvider.html5Mode(true);

    // CSRF TOKEN
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});

mainApp.service('loggedIn', function ($http, $q) {
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
        var auth = false;

        if (authorization){
            loggedIn.getUser().then(function(data){
                var user = data['user'];
                if(user == null){
                    auth = false;
                }else{
                    auth = user['is_active'];
                }
                if(auth == false){
                    alert('Bitte melde dich zuerst an!');
                    event.preventDefault();
                    $state.go('mainpage.login');
                }
            }, function(data){
                alert('Bitte melde dich zuerst an!');
                event.preventDefault();
                $state.go('mainpage.login');
            });
        }
    });
});
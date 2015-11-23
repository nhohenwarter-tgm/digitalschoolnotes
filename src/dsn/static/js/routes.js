var mainApp = angular.module('mainApp', ['ui.router','ngCookies','vcRecaptcha', 'ui.codemirror']);

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

    // NOTEBOOK EDIT PAGE
    $stateProvider.state('notebookedit', {
        url: '/notebook/{id}',
        templateUrl: '/notebook.html',
        controller: 'notebookEditCtrl',
        data: {
            authorization: true,
            admin: false
        }
    });

    // IMPRESSUM
    $stateProvider.state('mainpage.impressum', {
        url: '/impressum',
        templateUrl: '/mainpage/impressum.html',
        controller: 'impressumCtrl',
        data: {
            authorization: false,
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

    // LOGIN OAUTHERROR
    $stateProvider.state('mainpage.login.oautherror', {
        url: '/oautherror',
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
        url: '/settings',
        templateUrl: '/mgmt/management_accsettings.html',
        controller: 'accsettingsCtrl',
        data: {
            authorization: true,
            admin: false
        }
    });

    // SEARCH RESULTS
    $stateProvider.state('management.search', {
        url: '/searchresults',
        templateUrl: '/mgmt/management_search.html',
        controller: 'searchCtrl',
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

        // EDIT NOTEBOOKS
    $stateProvider.state('management.notebook_edit', {
        url: '/notebook_edit/{id}',
        templateUrl: '/mgmt/management_notebook_edit.html',
        controller: 'editNotebookCtrl',
        data: {
            authorization: true,
            admin: false
        }
    });

    // PROFILE
    $stateProvider.state('management.profile', {
        url: '/profile/{id}',
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

mainApp.run(function($rootScope, $state, $http, $window, $urlRouter, loggedIn){
    $rootScope.loginFromState = null;
    $rootScope.loginFromParams = null;
    authenticated = false;
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
        if(toState.name == 'notebookedit'){
            $rootScope.notebookView = true;
        }else{
            $rootScope.notebookView = false;
        }
        if(toState.name != 'mainpage.login') {
            $rootScope.error = false;
            $rootScope.login_error = '';
        }
        if(authenticated == true){
            authenticated = false;
            var auth = true;
        }else{
            var auth = false;
        }
        var authorization = toState.data.authorization;
        if (authorization && !auth) {
            event.preventDefault();
            loggedIn.getUser().then(function (data) {
                var user = data['user'];
                if (user == null) {
                    auth = false;
                } else {
                    auth = user['is_active'];
                }
                if (auth == true) {
                    authenticated = true;
                    $state.go(toState, toParams);
                } else {
                    $rootScope.loginFromState = toState;
                    $rootScope.loginFromParams = toParams;
                    $rootScope.error = true;
                    $rootScope.login_error = 'Bitte melde dich zuerst an!';
                    $state.go('mainpage.login');
                }
            }, function (data) {
                $rootScope.error = true;
                $rootScope.login_error = 'Bitte melde dich zuerst an!';
                $state.go('mainpage.login');
            });
        }
    });
});
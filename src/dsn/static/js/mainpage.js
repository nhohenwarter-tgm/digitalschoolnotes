var mainApp = angular.module('mainApp');

mainApp.controller('mainpageCtrl', function($scope, $http, $location, $anchorScroll, $window, $state, loggedIn){
    scrollLocation = null;
    loggedIn.getUser().then(function(data){
            var user = data['user'];
            if(user == null){
                $scope.menu_toapp = false;
                $scope.menu_login = true;
            }else{
                $scope.menu_toapp = true;
                $scope.menu_login = false;
            }
        }, function(data){

        });

    $scope.goto = function(locationId){
        if($state.current.name != 'mainpage.login') {
            var old = $location.hash();
            $location.hash(locationId);
            $anchorScroll();
            $location.hash(old);
        }else{
            scrollLocation = locationId;
            $state.go('mainpage.content');
        }
    }
});

mainApp.controller('contentCtrl', ['vcRecaptchaService','$scope','$http', function(vcRecaptchaService, $scope, $http){
    if(scrollLocation != null){
        $scope.goto(scrollLocation);
        scrollLocation = null;
    }
    $scope.registerSuccess = false;
    $scope.error = false;
    //$scope.publicKey = "6Ldj4A8TAAAAAANFOMC0XlVx3AG3KvX5vKhCXqQc"; //Echter Key
    $scope.publicKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Testing

    $scope.submitRegister = function(){
        $scope.submitted = true;
        var email = $scope.email;
        var password = $scope.password;
        var password_repeat = $scope.password_repeat;
        var first_name = $scope.firstname;
        var last_name = $scope.lastname;
        var accept = $scope.accept;
        $scope.captchaerror = false;
        $scope.emailerror = false;
        $scope.passworderror = false;
        $scope.email_error = '';
        $scope.password_error = '';
        $scope.captcha_error = '';
        if(vcRecaptchaService != null && vcRecaptchaService.getResponse() === ""){
            $scope.captchaerror = true;
            $scope.captcha_error = "Bitte löse das Captcha.\n";
        }
        if(password != password_repeat){
            $scope.passworderror = true;
            $scope.password_error = "Die Passwörter stimmen nicht überein.\n";
        }
        password=CryptoJS.SHA256(password);
        password_repeat=CryptoJS.SHA256(password_repeat);
        if($scope.register.$valid && !$scope.captcha_error && !$scope.passworderror) {
            $http({
                method: 'POST',
                url: '/api/register',
                headers: {'Content-Type': 'application/json'},
                data: {
                    email: email,
                    password: password.toString(),
                    password_repeat: password_repeat.toString(),
                    firstname: first_name,
                    lastname: last_name,
                    accept: accept,
                    'recaptcha': vcRecaptchaService.getResponse()
                }
            })
                .success(function (data) {
                    if (data['registration_error'] != null) {
                        $scope.emailerror = true;
                        $scope.email_error = data['registration_error'];
                        vcRecaptchaService.reload();
                    }else{
                        $scope.registerSuccess = true;
                        $scope.message = 'Vielen Dank für deine Registrierung! \n' +
                            'Sobald du deine E-Mail Adresse bestätigt hast kannst du dich einloggen und sofort starten!';
                    }
                })
                .error(function (data) {

                });
        }
    }
}]);

mainApp.controller('loginCtrl', function($scope, $window, $http, $state, $rootScope, loggedIn){
    loggedIn.getUser().then(function(data){
        var user = data['user'];
        if(user != null && user.is_active){
            if($rootScope.loginFromState != null){
                var toState = $rootScope.loginFromState;
                var toParams = $rootScope.loginFromParams;
                $rootScope.loginFromState = null;
                $rootScope.loginFromParams = null;
                $state.go(toState, toParams);
            }else {
                $state.go('management.timetable');
            }
        }
    }, function(data){
        $state.go('mainpage.content');
    });

    console.log($state.current.name);
    if($state.current.name == 'mainpage.login.oautherror'){
        $scope.error = true;
        $scope.login_error = 'Diese E-Mail Adresse wird bereits verwendet!';
    }

    $scope.submitLogin = function(){
        $scope.submitted = true;
        var email = $scope.email;
        var password = CryptoJS.SHA256($scope.password);
        if($scope.login.$valid){
            $http({
                method  : 'POST',
                url     : '/api/login',
                headers : {'Content-Type': 'application/json'},
                data    : {email: email, password: password.toString()}
            })
                .success(function(data){
                    if (data['login_error'] != null) {
                        $scope.error = true;
                        $scope.login_error = data['login_error'];
                    }else{
                        if($rootScope.loginFromState != null){
                            var toState = $rootScope.loginFromState;
                            var toParams = $rootScope.loginFromParams;
                            $rootScope.loginFromState = null;
                            $rootScope.loginFromParams = null;
                            $state.go(toState, toParams);
                        }else {
                            $state.go('management.timetable');
                        }
                    }
                })
                .error(function(data){

                });
        }
    }
});

mainApp.controller('validateEmailCtrl', function($scope, $http, $state){
    var hash = $state.params.hash;
    $http({
        method: 'POST',
        url: '/api/validate_email',
        headers: {'Content-Type': 'application/json'},
        data: {
            hash: hash
        }
    })
        .success(function (data) {
            $scope.message = data['message'];
            $scope.success = data['success'];
        })
        .error(function (data) {

        });

});

mainApp.controller('resetPwdCtrl', ['vcRecaptchaService','$scope','$http','$state',function(vcRecaptchaService, $scope, $http, $state){
    $scope.success = false;
    $scope.linkInvalid = false;
    //$scope.publicKey = "6Ldj4A8TAAAAAANFOMC0XlVx3AG3KvX5vKhCXqQc"; //Echter Key
    $scope.publicKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Testing

    $scope.resetPasswordReq = function() {
        $scope.submitted = true;
        $scope.error = false;
        $scope.reset_error = "";
        var email = $scope.email;

        if(vcRecaptchaService != null && vcRecaptchaService.getResponse() === ""){
            $scope.error = true;
            $scope.reset_error += "Bitte löse das Captcha.\n";
        }

        if(!$scope.error && $scope.resetpwdreq.$valid) {
            $http({
                method: 'POST',
                url: '/api/resetpasswordrequest',
                headers: {'Content-Type': 'application/json'},
                data: {email: email, 'recaptcha': vcRecaptchaService.getResponse()}
            })
                .success(function (data) {
                    $scope.error = false;
                    $scope.reset_error = "";
                    if (data['reset_error'] != null) {
                        $scope.error = true;
                        $scope.reset_error += data['reset_error']+"\n";

                    }else{
                        $scope.success = true;
                    }
                    vcRecaptchaService.reload();
                })
                .error(function (data) {

                });
        }
    };

    $scope.resetPassword = function() {
        $scope.submitted = true;
        var password = $scope.pwd;
        var password_repeat = $scope.pwdrepeat;
        var hash = $state.params.hash;
        $scope.error = false;
        $scope.reset_error = '';
        if(password != password_repeat) {
            $scope.error = true;
            $scope.reset_error = 'Passwörter stimmen nicht überein\n';
        }
        password = CryptoJS.SHA256(password)
        password_repeat = CryptoJS.SHA256(password_repeat)
        if(!$scope.error && $scope.resetpwd.$valid) {
            $http({
                method: 'POST',
                url: '/api/resetpassword',
                headers: {'Content-Type': 'application/json'},
                data: {
                    hash: hash,
                    password: password.toString(),
                    password_repeat: password_repeat.toString()
                }
            })
                .success(function (data) {
                    if (data['reset_error'] != null && data['reset_error'] != true) {
                        $scope.error = true;
                        $scope.reset_error = data['reset_error'];
                    }
                    if(data['reset_error'] == true){
                        $scope.success = true;
                    }
                })
                .error(function (data) {

                });
        }
    };

    if($state.params.hash != null){
    $http({
        method: 'GET',
        url: '/api/resetpassword',
        headers: {'Content-Type': 'application/json'},
        params: {
            hash: $state.params.hash
        }
    })
        .success(function (data) {
            if (data['reset_error'] != null) {
                $scope.linkInvalid = true;
            }
        })
        .error(function (data) {

        });
    }
}]);

mainApp.controller('impressumCtrl', function($scope, $http, $state){

});
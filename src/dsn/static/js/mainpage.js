var mainApp = angular.module('mainApp');

mainApp.controller('mainpageCtrl', function($scope, $http, loggedIn){
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
});

mainApp.controller('contentCtrl', ['vcRecaptchaService','$scope','$http',function(vcRecaptchaService, $scope, $http){
    $scope.error = false;

    $scope.publicKey = "6Ldj4A8TAAAAAANFOMC0XlVx3AG3KvX5vKhCXqQc"

    $scope.submitRegister = function(){
        var email = $scope.email;
        var password = $scope.password;
        var password_repeat = $scope.password_repeat;
        var first_name = $scope.firstname;
        var last_name = $scope.lastname;
        var accept = $scope.accept;
        $scope.error = false;
        $scope.registration_error = '';
        if(vcRecaptchaService.getResponse() === ""){
            $scope.error = true;
            $scope.registration_error = "Bitte löse das Captcha.\n";
        }
        if(email == null || password == null || password_repeat == null || first_name == null || last_name == null) {
            $scope.error = true;
            $scope.registration_error += 'Bitte füll alle Felder aus!\n';
        }
        if(!accept){
            $scope.error = true;
            $scope.registration_error += 'Bitte akzeptiere unsere Nutzungsbedingungen!\n';
        }
        if(password != password_repeat){
            $scope.error = true;
            $scope.registration_error += 'Passwörter stimmen nicht überein!\n';
        }
        password=CryptoJS.SHA256(password)
        password_repeat=CryptoJS.SHA256(password_repeat)
        if(!$scope.error) {
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
                        $scope.error = true;
                        $scope.registration_error = data['registration_error'];
                        vcRecaptchaService.reload();
                    }else{
                        alert('Vielen Dank für deine Registrierung!\n' +
                            'Sobald du deine E-Mail Adresse bestätigt hast kannst du dich einloggen und sofort starten!');
                    }
                })
                .error(function (data) {

                });
        }
    }
}]);

mainApp.controller('loginCtrl', function($scope, $http, $state){
    $scope.submitLogin = function(){
        var email = $scope.email;
        var password = CryptoJS.SHA256($scope.password);
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
                    $state.go('management.timetable');
                }
            })
            .error(function(data){

            });
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
        })
        .error(function (data) {

        });

});

mainApp.controller('resetPwdCtrl', ['vcRecaptchaService','$scope','$http','$state',function(vcRecaptchaService, $scope, $http, $state){


    $scope.publicKey = "6Ldj4A8TAAAAAANFOMC0XlVx3AG3KvX5vKhCXqQc"

    $scope.resetPasswordReq = function() {
        $scope.error = false;
        $scope.reset_error = "";
        var email = $scope.email;

        if(vcRecaptchaService.getResponse() === ""){
            $scope.error = true;
            $scope.reset_error += "Bitte löse das Captcha.\n";
        }

        if(email == null){
            $scope.error = true;
            $scope.reset_error += "Bitte gib deine E-Mail Adresse an.\n";
        }

        if(!$scope.error) {
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
                        vcRecaptchaService.reload();
                    }
                })
                .error(function (data) {

                });
        }
    };

    $scope.resetPassword = function() {
        var password = $scope.pwd;
        var password_repeat = $scope.pwdrepeat;
        var hash = $state.params.hash;
        $scope.error = false;
        $scope.reset_error = '';
        if(password == null || password_repeat == null){
            $scope.error = true;
            $scope.reset_error = 'Bitte beide Felder ausfüllen.\n';
        }
        if(password != password_repeat) {
            $scope.error = true;
            $scope.reset_error = 'Passwörter stimmen nicht überein\n';
        }
        password = CryptoJS.SHA256(password)
        password_repeat = CryptoJS.SHA256(password_repeat)
        if(!$scope.error) {
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
                    if (data['reset_error'] != null) {
                        $scope.error = true;
                        $scope.reset_error = data['reset_error'];
                    }
                    if(data['reset_error'] == true){
                        $state.go('mainpage.login')
                    }
                })
                .error(function (data) {

                });
        }
    };

}]);
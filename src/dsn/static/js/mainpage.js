var mainApp = angular.module('mainApp');

mainApp.controller('mainpageCtrl', function(){

});

mainApp.controller('contentCtrl', function($scope, $http, $cookies){
    $scope.error = false;

    $scope.submitRegister = function(){
        var email = $scope.email;
        var password = $scope.password;
        var password_repeat = $scope.password_repeat;
        var first_name = $scope.firstname;
        var last_name = $scope.lastname;
        var accept = $scope.accept;
        $scope.error = false;
        $scope.registration_error = '';
        if(email == null || password == null || password_repeat == null || first_name == null || last_name == null) {
            $scope.error = true;
            $scope.registration_error = 'Bitte füll alle Felder aus!\n';
        }
        if(!accept){
            $scope.error = true;
            $scope.registration_error += 'Bitte akzeptiere unsere Nutzungsbedingungen!\n';
        }
        if(password != password_repeat){
            $scope.error = true;
            $scope.registration_error += 'Passwörter stimmen nicht überein!\n';
        }

        if(!$scope.error) {
            $http({
                method: 'POST',
                url: '/api/register',
                headers: {'Content-Type': 'application/json'},
                data: {
                    email: email,
                    password: CryptoJS.SHA256(password),
                    password_repeat: CryptoJS.SHA256(password_repeat),
                    firstname: first_name,
                    lastname: last_name,
                    accept: accept
                }
            })
                .success(function (data) {
                    if (data['registration_error'] != null) {
                        $scope.error = true;
                        $scope.registration_error = data['registration_error'];
                    }else{
                        alert('Vielen Dank für deine Registrierung!\n' +
                            'Sobald du deine E-Mail Adresse bestätigt hast kannst du dich einloggen und sofort starten!');
                    }
                })
                .error(function (data) {

                });
        }
    }
});

mainApp.controller('loginCtrl', function($scope, $http, $state){
    $scope.submitLogin = function(){
        var email = $scope.email;
        var password = $scope.password;
        $http({
            method  : 'POST',
            url     : '/api/login',
            headers : {'Content-Type': 'application/json'},
            data    : {email: email, password: CryptoJS.SHA256(password)}
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

mainApp.controller('resetPwdCtrl', function($scope, $http){
    $scope.resetPasswordReq = function() {
        var email = $scope.email;
        $http({
            method  : 'POST',
            url     : '/api/resetpasswordrequest',
            headers : {'Content-Type': 'application/json'},
            data    : {email: email}
        })
            .success(function(data){
                if (data['reset_error'] != null) {
                    $scope.error = true;
                    $scope.reset_error = data['reset_error'];
                }
            })
            .error(function(data){

            });
    };

    $scope.resetPassword = function(hash) {
        $http({
            method  : 'POST',
            url     : '/api/resetpassword',
            headers : {'Content-Type': 'application/json'},
            data    : {hash: hash}
        })
            .success(function(data){
                if (data['reset_error'] != null) {
                    $scope.error = true;
                    $scope.reset_error = data['reset_error'];
                }
            })
            .error(function(data){

            });
    };

});
var mainApp = angular.module('mainApp');

mainApp.controller('notebookEditCtrl', function($scope, $http, $stateParams, loggedIn){
    $scope.publicViewed = true;
    $http({
        method: 'POST',
        url: '/api/get_notebook',
        data: {id: $stateParams.id}
    }).success(function(data){
            $scope.notebook = JSON.parse(data['notebook']);
            loggedIn.getUser().then(function(data){
                var user = data['user'];
                if($scope.notebook['email'] == user['email']){
                    $scope.publicViewed = false;
                }else{
                    $scope.publicViewed = true;
                }

                $('#book').booklet({
                    startingPage: $scope.notebook['numpages']-1,
                    next: '#goto-next',
                    prev: '#goto-prev',
                    easing:  null,
	                easeIn:  null,
	                easeOut: null,
                    shadows: false,
                    width: "",
                    height: "",
                    pagePadding: 0
                });
            }, function(data){
                $scope.notebook = JSON.parse(data['notebook']);
                $scope.publicViewed = true;

                $('#book').booklet({
                    width: "",
                    height: "",
                    startingPage: $scope.notebook['numpages']-1,
                    next: '#goto-next',
                    prev: '#goto-prev'
                });
            });
        });
    $('#goto-start').click(function(e){
        e.preventDefault();
        $('#book').booklet("gotopage", "start");
    });
    $('#goto-end').click(function(e){
        e.preventDefault();
        $('#book').booklet("gotopage", "end");
    });
});



var mainApp = angular.module('mainApp');

mainApp.controller('notebookEditCtrl', function($scope, $http, $stateParams){
    $http({
        method: 'POST',
        url: '/api/get_notebook',
        data: {id: $stateParams.id}
    }).success(function(data){
            $scope.notebook = JSON.parse(data['notebook']);
            $('#book').booklet({
                width: "",
                height: "",
                startingPage: $scope.notebook['numpages']-1,
                next: '#goto-next',
                prev: '#goto-prev'
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



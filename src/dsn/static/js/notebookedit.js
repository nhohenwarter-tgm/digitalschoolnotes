var mainApp = angular.module('mainApp');

mainApp.controller('notebookEditCtrl', function($scope, $http, $stateParams){
    $http({
        method: 'POST',
        url: '/api/get_notebook',
        data: {id: $stateParams.id}
    }).success(function(data){
            $scope.notebook = JSON.parse(data['notebook']);
        });

    $('#book').booklet({width: "", height: ""});
});
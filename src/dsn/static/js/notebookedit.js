var mainApp = angular.module('mainApp');

mainApp.controller('notebookEditCtrl', function($scope, $http, $stateParams, loggedIn){
    $scope.publicViewed = true;
    $scope.xPos = {};
    $scope.yPos = {};
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

            angular.element('#book').booklet({
                startingPage: $scope.notebook['numpages']-1,
                next: '#goto-next',
                prev: '#goto-prev',
                easing:  null,
                easeIn:  null,
                easeOut: null,
                shadows: false,
                width: "1100",
                height: "700",
                pagePadding: 0
            });

            angular.element('#goto-start').click(function(e){
                e.preventDefault();
                angular.element('#book').booklet("gotopage", "start");
            });
            angular.element('#goto-end').click(function(e){
                e.preventDefault();
                angular.element('#book').booklet("gotopage", "end");
            });

            $scope.makeDraggable('testy',1);
            $scope.makeDraggable('testy2',1);

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

    angular.element('.zoomTarget').zoomTarget();

    $scope.makeDraggable = function(id, page){
        angular.element("#"+id).draggable({
            containment: '.b-page-'+(page-1),
            stop: function(){
                // Aktuelle Position speichern
                var finalPos = $(this).position();
                sessionStorage.setItem('xPos_'+id, finalPos.left);
                sessionStorage.setItem('yPos_'+id, finalPos.top);
            },
            create: function(){
                // Position schon im Storage?
                if(sessionStorage.getItem('xPos_'+id) === null){
                    sessionStorage.setItem('xPos_'+id, 0);
                    sessionStorage.setItem('yPos_'+id, 0);
                }
            }
        });

        // Initiale Position von Div setzen
        $scope.xPos[id] = sessionStorage.getItem('xPos_'+id);
        $scope.yPos[id] = sessionStorage.getItem('yPos_'+id);
    };

    angular.element('app').app();
    $scope.ckEditor = function() {
        return {
            require: '?ngModel',
            link: function ($scope, elm, attr, ngModel) {

                var ck = CKEDITOR.replace(elm[0]);

                ck.on('pasteState', function () {
                    $scope.$apply(function () {
                        ngModel.$setViewValue(ck.getData());
                    });
                });

                ngModel.$render = function (value) {
                    ck.setData(ngModel.$modelValue);
                };
            }
        }
    };

    $scope.myCtrl = function ($scope) {
        $scope.ckEditors = [];
        var rand = "" + (Math.random() * 10000);
        $scope.ckEditors.push({value: rand});
    }
});


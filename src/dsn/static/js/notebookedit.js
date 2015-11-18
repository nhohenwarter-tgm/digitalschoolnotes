var mainApp = angular.module('mainApp');

mainApp.controller('notebookEditCtrl', function($scope, $http, $stateParams, $sce, $window, loggedIn){
    $scope.publicViewed = true;
    $scope.xPos = {};
    $scope.yPos = {};
    $scope.pages = {};
    $scope.count = {'reference': 0};
    $scope.currentPage = 1;
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
                $scope.currentPage = $scope.notebook['numpages']-1;

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
                /**
                var finalPos = $(this).position();
                sessionStorage.setItem('xPos_'+id, finalPos.left);
                sessionStorage.setItem('yPos_'+id, finalPos.top);
                 */
            },
            create: function(){
                // Position schon im Storage?
                /**
                if(sessionStorage.getItem('xPos_'+id) === null){
                    sessionStorage.setItem('xPos_'+id, 0);
                    sessionStorage.setItem('yPos_'+id, 0);
                }
                 */
            }
        });

        // Initiale Position von Div setzen
        $scope.xPos[id] = sessionStorage.getItem('xPos_'+id);
        $scope.yPos[id] = sessionStorage.getItem('yPos_'+id);
    };

    $scope.toPage = function(page){
        angular.element('#book').booklet("gotopage", page-1);
        $scope.currentPage = page;
    };

    $scope.createElementReference = function(){
        var input = $window.prompt("Auf welche Seite möchtest du referenzieren?","");
        if(input != null) {
            $scope.pages[1] = $scope.pages[1] + '<div id="reference_' + $scope.count['reference'] + '" ' +
                'style="position: absolute;"><em>' +
                '<a ng-click="toPage('+input+')">Siehe Seite '+input+'</a></em></div>';
            $scope.makeDraggable('reference_' + $scope.count['reference'], 1);
            $scope.count['reference'] = $scope.count['reference'] + 1;
        }
    };

});

mainApp.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile);
        },
        function(value) {
          // when the 'compile' expression changes
          // assign it into the current DOM
          element.html(value);

          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
    );
  };
}]);    angular.element('app').app();
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


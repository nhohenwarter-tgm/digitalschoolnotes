var mainApp = angular.module('mainApp');

mainApp.controller('notebookEditCtrl', function($scope, $http, $stateParams, loggedIn){
    $scope.publicViewed = true;
    $scope.code=function(){
        //$scope.thisCanBeusedInsideNgBindHtml += "<html>hhhhh</html>";
        var ni = document.getElementById('myDiv');

  var numi = document.getElementById('theValue');

  var num = (document.getElementById('theValue').value -1)+ 2;

  numi.value = num;

  var newdiv = document.createElement('div');

  var divIdName = 'my'+num+'Div';

  newdiv.setAttribute('id',divIdName);

  newdiv.innerHTML = '<section > <textarea rows="6" cols="70" ui-codemirror="cmOption"></textarea> Mode : <select ng-model="mode" ng-options="m for m in modes" ng-change="modeChanged()"></select> </section>';

  ni.appendChild(newdiv);
    };
    $scope.xPos = {};
    $scope.yPos = {};
    // The modes
  $scope.modes = ['Scheme', 'XML', 'Javascript'];
  $scope.mode = $scope.modes[0];


  // The ui-codemirror option
  $scope.cmOption = {
      lineNumbers: true,
      indentWithTabs: true,
      onLoad: function (_cm) {

          // HACK to have the codemirror instance in the scope...
          $scope.modeChanged = function () {
              _cm.setOption("mode", $scope.mode.toLowerCase());
          };
      }
  };

       /**Initial code content...
  $scope.cmModel = ';; Scheme code in here.\n' +
    '(define (double x)\n\t(* x x))\n\n\n' +
    '<!-- XML code in here. -->\n' +
    '<root>\n\t<foo>\n\t</foo>\n\t<bar/>\n</root>\n\n\n' +
    '// Javascript code in here.\n' +
    'function foo(msg) {\n\tvar r = Math.random();\n\treturn "" + r + " : " + msg;\n}'; **/
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

});
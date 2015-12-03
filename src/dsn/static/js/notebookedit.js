var mainApp = angular.module('mainApp');

mainApp.controller('notebookEditCtrl', function ($scope, $http, $stateParams, $sce, $window, loggedIn) {
    $scope.editMode = false;
    $scope.editModeindex = -1;
    $scope.code = function () {
        //$scope.thisCanBeusedInsideNgBindHtml += "<html>hhhhh</html>";
        //Methode1
        /**
         var myEl = angular.element( document.querySelector( '#test' ) );
         myEl.append('<section > <textarea rows="6" cols="70" ui-codemirror="cmOption"></textarea> Mode : <select ng-model="mode" ng-options="m for m in modes" ng-change="modeChanged()"></select> </section>');


         //Methode2
         var ni = document.getElementById('myDiv');

         var numi = document.getElementById('theValue');

         var num = (document.getElementById('theValue').value -1)+ 2;

         numi.value = num;

         var newdiv = document.createElement('div');

         var divIdName = 'my'+num+'Div';

         newdiv.setAttribute('id',divIdName);

         newdiv.innerHTML = '<section > <textarea rows="6" cols="70" ui-codemirror="cmOption"></textarea> Mode : <select ng-model="mode" ng-options="m for m in modes" ng-change="modeChanged()"></select> </section>';

         ni.appendChild(newdiv); **/

            //Methode3 --> funktioniert
        $scope.divHtmlVar = $scope.divHtmlVar + '<section> <textarea class="codestyle" rows="6" cols="70" ui-codemirror="cmOption"></textarea> Mode : <select ng-model="mode" ng-options="m for m in modes" ng-change="modeChanged()"></select> </section>';

        //change event fuer textarea
    };
    // The modes
    $scope.modes = ['Scheme', 'XML', 'Javascript', 'clike', 'python'];
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
        //wie oben ng-change??? fuer speichern wenn etwas geaendert wurde
    };

    // The ui-codemirror option
    $scope.cmOptionreadonly = {
        lineNumbers: true,
        indentWithTabs: true,
        readOnly: 'nocursor',
        onLoad: function (_cm) {

            // HACK to have the codemirror instance in the scope...
            $scope.modeChanged = function () {
                _cm.setOption("mode", $scope.mode.toLowerCase());
            };
        }
        //wie oben ng-change??? fuer speichern wenn etwas geaendert wurde
    };

    /**Initial code content...
     $scope.cmModel = ';; Scheme code in here.\n' +
     '(define (double x)\n\t(* x x))\n\n\n' +
     '<!-- XML code in here. -->\n' +
     '<root>\n\t<foo>\n\t</foo>\n\t<bar/>\n</root>\n\n\n' +
     '// Javascript code in here.\n' +
     'function foo(msg) {\n\tvar r = Math.random();\n\treturn "" + r + " : " + msg;\n}'; **/

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
    }).success(function (data) {
        $scope.notebook = JSON.parse(data['notebook']);
        $scope.sites = $scope.notebook['content'];
        //alert($scope.sites.length);
        $scope.updatedata();
        loggedIn.getUser().then(function (data) {
            var user = data['user'];
            if ($scope.notebook['email'] == user['email']) {
                $scope.publicViewed = false;
            } else {
                $scope.publicViewed = true;
            }

            angular.element('#book').booklet({
                startingPage: $scope.notebook['numpages'] - 1,
                next: '#goto-next',
                prev: '#goto-prev',
                easing: null,
                easeIn: null,
                easeOut: null,
                shadows: false,
                width: "1100",
                height: "700",
                pagePadding: 0
            });
            $scope.currentPage = $scope.notebook['numpages'] - 1;

            angular.element('#goto-start').click(function (e) {
                $scope.currentPage = 1;
                e.preventDefault();
                angular.element('#book').booklet("gotopage", "start");
            });
            angular.element('#goto-next').click(function (e) {
                $scope.currentPage += 2;
            });
            angular.element('#goto-prev').click(function (e) {
                $scope.currentPage -= 2;
            });
            angular.element('#goto-end').click(function (e) {
                $scope.currentPage = $scope.notebook['numpages'] - 1;
                e.preventDefault();
                angular.element('#book').booklet("gotopage", "end");
            });

            $scope.makeDraggable('testy', 1);
            $scope.makeDraggable('testy2', 1);

        }, function (data) {
            $scope.notebook = JSON.parse(data['notebook']);
            $scope.publicViewed = true;

            $('#book').booklet({
                width: "",
                height: "",
                startingPage: $scope.notebook['numpages'] - 1,
                next: '#goto-next',
                prev: '#goto-prev'
            });
        });
    });

    angular.element('.zoomTarget').zoomTarget();

    $scope.makeDraggable = function (id, page) {
        angular.element("#" + id).draggable({
            containment: '.b-page-' + (page - 1),
            stop: function () {
                // Aktuelle Position speichern
                /**
                 var finalPos = $(this).position();
                 sessionStorage.setItem('xPos_'+id, finalPos.left);
                 sessionStorage.setItem('yPos_'+id, finalPos.top);
                 */
            },
            create: function () {
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
        $scope.xPos[id] = sessionStorage.getItem('xPos_' + id);
        $scope.yPos[id] = sessionStorage.getItem('yPos_' + id);
    };

    $scope.toPage = function (page) {
        alert(page);
        angular.element('#book').booklet("gotopage", page - 1);
        $scope.currentPage = page;
    };

    $scope.createElementReference = function () {
        var input = $window.prompt("Auf welche Seite möchtest du referenzieren?", "");
        if (input != null) {
            $scope.pages[1] = $scope.pages[1] + '<div class="draggable ui-draggable-handle ui-draggable" id="reference_' +
                $scope.count['reference'] + '" ' +
                'style="position: absolute; border: 1px solid black; height: 30px;"><em>' +
                '<a ng-click="toPage(' + input + ')">Siehe Seite ' + input + '</a></em></div>';
            $scope.makeDraggable('reference_' + $scope.count['reference'], 1);
            $scope.count['reference'] = $scope.count['reference'] + 1;
        }
    };

    $scope.deleteelement = function (id, art) {
        deleteUser = true;
        deleteUser = $window.confirm('Wollen Sie dieses Element wirklich löschen?');
        if (deleteUser) {
        $http({
            method: 'POST',
            url: '/api/delete_notebook_content',
            data: {id: $stateParams.id, content_id: id, content_art: art}
        }).success(function (data) {
            $scope.notebook = JSON.parse(data['notebook']);
            $scope.sites = $scope.notebook['content'];
            $scope.updatedata();
        });
        }
    };

    $scope.addelement = function (art) {
        var input = $window.prompt("Auf welche Seite möchtest du das Element einfügen,"+$scope.currentPage+", "+($scope.currentPage+1)+"?", "");
        if (input == $scope.currentPage || input == $scope.currentPage+1) {
            $http({
                method: 'POST',
                url: '/api/add_notebook_content',
                data: {id: $stateParams.id, content_art: art, content_site: input}
            }).success(function (data) {
                $scope.notebook = JSON.parse(data['notebook']);
                $scope.sites = $scope.notebook['content'];
                $scope.updatedata();

            });
        }else{
            alert("Diese Seite ist nicht aktuell!");
        }
    };

    $scope.editelement = function (id, art, data) {
        $http({
            method: 'POST',
            url: '/api/edit_notebook_content',
            data: {id: $stateParams.id, content_id: id, content_art: art, content_data: data}
        }).success(function (data) {
            $scope.notebook = JSON.parse(data['notebook']);
            $scope.sites = $scope.notebook['content'];
            $scope.updatedata();
        });
    };

    $scope.setEditMode = function (edit, index, id, art, input) {
        if ($scope.editModeindex == -1) {
            $scope.editMode = edit;
            $scope.editModeindex = index;
        }
        if (!edit) {
            $scope.editModeindex = -1;
            $scope.editelement(id, art, input);
        }
    };

    $scope.updatedata = function () {
        $scope.elementinput = [];
        for (i = 0; i < $scope.sites.length; i++) {
            $scope.elementinput.push($scope.sites[i].data);
        }
    }

    $scope.hoverIn = function () {
        this.hoverEdit = true;
    };

    $scope.hoverOut = function () {
        this.hoverEdit = false;
    };


    $scope.open = function () {
        ngDialog.open({
            template: 'firstDialog',
            controller: 'notebookEditCtrl',
            className: 'ngdialog-theme-default'
        });
    };

    $scope.uploadFile = function(){
               var file = $scope.myFile;

               console.log('file is ' );
               console.dir(file);

               var uploadUrl = "/api/notebook/upload";
               fileUpload.uploadFileToUrl(file, uploadUrl);
            };

});

mainApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

mainApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'enctype':'multipart/form-data'}
        })

            .success(function(){
            })

            .error(function(){
            });
    }
}]);

mainApp.directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function (value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        )
    }
}]);
/*
 if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
 CKEDITOR.tools.enableHtml5Elements( document );

 // The trick to keep the editor in the sample quite small
 // unless user specified own height.
 CKEDITOR.config.height = 150;
 CKEDITOR.config.width = 'auto';
 var initSample = ( function() {
 var wysiwygareaAvailable = isWysiwygareaAvailable(),
 isBBCodeBuiltIn = !!CKEDITOR.plugins.get( 'bbcode' );

 return function() {
 var editorElement = CKEDITOR.document.getById( 'editor' );

 // :(((
 if ( isBBCodeBuiltIn ) {
 editorElement.setHtml(
 'Hello world!\n\n' +
 'I\'m an instance of [url=http://ckeditor.com]CKEditor[/url].'
 );
 }

 // Depending on the wysiwygare plugin availability initialize classic or inline editor.
 if ( wysiwygareaAvailable ) {
 CKEDITOR.replace( 'editor' );
 } else {
 editorElement.setAttribute( 'contenteditable', 'true' );
 CKEDITOR.inline( 'editor' );

 // we can consider displaying some info box that
 // without wysiwygarea the classic editor may not work.
 }

 };

 function isWysiwygareaAvailable() {
 // If in development mode, then the wysiwygarea must be available.
 // Split REV into two strings so builder does not replace it :D.
 if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
 return true;
 }

 return !!CKEDITOR.plugins.get( 'wysiwygarea' );
 }
 } )();
 */
mainApp.directive('textareaelementinit', function () {
    return {
        template: "",
        link: function () {
            initSample();
        }
    };
});
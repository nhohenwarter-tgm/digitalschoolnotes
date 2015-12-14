var mainApp = angular.module('mainApp');

mainApp.controller('notebookEditCtrl', function ($scope, $http, $stateParams, $sce, $window, loggedIn, ngDialog) {

    $scope.publicViewed = true;
    $scope.currentPage = 1;
    $scope.editMode = false;
    $scope.models = {'code':{},'textarea':{}};
    $scope.additem = false;

    // Modes for Code Element
    $scope.modes = ['Scheme', 'XML', 'Javascript', 'clike', 'python','text/x-mysql'];

    // Set height of notebook
    setHeight("#notebook", 1.41);
    setPos("#turn_left");
    setPos("#turn_right");
    setPos("#turn_left_fast");
    setPos("#turn_right_fast");
    setPos("#turn_next_page");


    $http({
        method: 'POST',
        url: '/api/get_notebook',
        data: {id: $stateParams.id}
    }).success(function (data) {
        $scope.notebook = JSON.parse(data['notebook']);
        $scope.content = $scope.notebook['content'];
        $scope.currentPage = $scope.notebook['numpages'];
        $scope.update();
        loggedIn.getUser().then(function (data) {
            var user = data['user'];
            if ($scope.notebook['email'] == user['email']) {
                $scope.publicViewed = false;
            } else {
                $scope.publicViewed = true;
            }
        });
    });

    $scope.initElemModels = function () {
        for (var j = 0; j < $scope.content.length; j++) {
            if($scope.content[j]['art'] == 'code'){
                $scope.models['code'][$scope.content[j]['id']] = {};
                $scope.models['code'][$scope.content[j]['id']][0] = $scope.content[j]['data']['data'];
                $scope.models['code'][$scope.content[j]['id']][1] = $scope.content[j]['data']['mode'];
            }else {
                $scope.models[$scope.content[j]['art']][$scope.content[j]['id']] = $scope.content[j]['data']['data'];
            }
        }
    };

    $scope.initSites = function () {
        $scope.sites = {};
        for (var i = 0; i < $scope.notebook['numpages']; i++) {
            $scope.sites[i + 1] = [];
        }
        for (var j = 0; j < $scope.content.length; j++) {
            $scope.sites[parseInt($scope.content[j]['position_site'])].push($scope.content[j]);
        }
    };

    $scope.initDraggables = function () {
        for (var i = 0; i < $scope.content.length; i++) {
            $scope.makeDraggable($scope.content[i]['art']+"_"+$scope.content[i]['id']);
            $scope.makeDraggable($scope.content[i]['art']+"_"+$scope.content[i]['id']);
        }
    };

    $scope.update = function () {
        $scope.initSites();
        $scope.initElemModels();
        $scope.initDraggables();
    };

    $scope.toPage = function (page) {
        if(page > 0 && page <= $scope.notebook['numpages']){
            $scope.currentPage = page;
            if($scope.currentPage == $scope.notebook['numpages']){
                $scope.additem = false;
            }else{
                $scope.additem = true;
            }
        }else{
            if(page > 0){
                $http({
                    method: 'POST',
                    url: '/api/notebook_length_edit',
                    data: {id: $stateParams.id}
                }).success(function (data) {
                    $scope.currentPage = page;
                    $scope.notebook = JSON.parse(data['notebook']);
                });
            }
        }
    };


    // GENERAL ELEMENT FUNCTIONS

    $scope.addelement = function (art) {
        $http({
            method: 'POST',
            url: '/api/add_notebook_content',
            data: {id: $stateParams.id, content_art: art, content_site: $scope.currentPage}
        }).success(function (data) {
            $scope.notebook = JSON.parse(data['notebook']);
            $scope.content = $scope.notebook['content'];
            $scope.update();
        });
    };

    $scope.deleteelement = function (id, art) {
        $http({
            method: 'POST',
            url: '/api/delete_notebook_content',
            data: {id: $stateParams.id, content_id: id, content_art: art}
        }).success(function (data) {
            $scope.notebook = JSON.parse(data['notebook']);
            $scope.content = $scope.notebook['content'];
            $scope.update();
            $scope.deleteid = 0;
            $scope.deleteart = "";
        });
    };

    $scope.ElementDelete = function (id, art) {
        ngDialog.open({
            template: 'deleteElementSettings',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        $scope.deleteid = id;
        $scope.deleteart = art;
    };

    $scope.editelement = function (id, art, data, mode) {
        $http({
            method: 'POST',
            url: '/api/edit_notebook_content',
            data: {id: $stateParams.id, content_id: id, content_art: art, content_data: data, content_mode: mode}
        }).success(function (data) {
            $scope.notebook = JSON.parse(data['notebook']);
            $scope.content = $scope.notebook['content'];
            $scope.update();
        });
    };

    $scope.setEditMode = function (edit, id, art) {
        $scope.editMode = edit;
        if(art == 'code'){
            $scope.editelement(id, art, $scope.models[art][id][0],$scope.models['code'][id][1]);
        }else{
            $scope.editelement(id, art, $scope.models[art][id]);
        }
    };

    $scope.makeDraggable = function (id) {
        angular.element("#" + id).draggable({
            containment: '#notebook',
            stop: function () {
            },
            create: function () {
            }
        });
    };


    // CODE ELEMENT
    $scope.codeLanguage="";

    $scope.cmOption = {
        lineNumbers: true,
        indentWithTabs: true,
        onLoad: function (_cm) {
            $scope.modeChanged = function (id) {
                _cm.setOption("mode", $scope.models['code'][id][1].toLowerCase());
            };
        }
    };

    $scope.ROcmOption = {
        lineNumbers: true,
        indentWithTabs: true,
        readOnly: 'nocursor',
        onLoad: function (_cm) {
            $scope.modeChanged = function (id) {
                _cm.setOption("mode", $scope.models['code'][id][1].toLowerCase());
            };
        }
    };

    // NgDialog zum erstellen und bearbeiten von Code Elementen
    $scope.codeElementCreate = function () {
        ngDialog.open({
            template: 'codeElementSettings',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.codeElementEdit = function () {
        ngDialog.open({
            template: 'codeElementSettings2',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

});


// TEXT ELEMENT

mainApp.directive('ckeditor', function() {
    return {
        require: '?ngModel',
        link: function(scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0], {
                extraPlugins: 'autogrow',
                autoGrow_minHeight: 20,
                autoGrow_maxHeight: 800,
                removePlugins: 'resize'
            });

            if (!ngModel) return;

            ck.on('instanceReady', function() {
                ck.setData(ngModel.$viewValue);
            });

            function updateModel() {
                scope.$apply(function() {
                    ngModel.$setViewValue(ck.getData());
                });
            }

            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);

            ngModel.$render = function(value) {
                ck.setData(ngModel.$viewValue);
            };
        }
    };
});

// HEIGHT OF NOTEBOOK

function setHeight (element, ratio, minLimit)
{
    // First of all, let's square the element
    setH(ratio, minLimit);

    // Now we'll add an event listener so it happens automatically
    window.addEventListener('resize', function(event) {
        setH(ratio, minLimit);
    });

    // This is just an inner function to help us keep DRY
    function setH(ratio, minLimit)
    {
        if(typeof(ratio) === "undefined")
        {
            ratio = 1;
        }
        if(typeof(minLimit) === "undefined")
        {
            minLimit = 0;
        }
        var viewportWidth = window.innerWidth;

        if(viewportWidth >= minLimit)
        {
            var newElementHeight = $(element).width() * ratio;
            $(element).height(newElementHeight);
        }
        else
        {
            $(element).height('auto');
        }
    }
}

// SET POSITION OF ARROWS

function setPos (element)
{
    // First of all, let's square the element
    setP();

    // Now we'll add an event listener so it happens automatically
    window.addEventListener('resize', function(event) {
        setP();
    });

    // This is just an inner function to help us keep DRY
    function setP()
    {
        var viewportHeight = window.innerHeight;

        var newElementPos = viewportHeight/2-40;
        $(element).css("padding-top", newElementPos);
    }
}


    /**
    $scope.editMode = false;
    $scope.editModeindex = -1;
    $scope.code = function () {
        $scope.divHtmlVar = $scope.divHtmlVar + '<section> <textarea class="codestyle" rows="6" cols="70" ui-codemirror="cmOption"></textarea> Mode : <select ng-model="mode" ng-options="m for m in modes" ng-change="modeChanged()"></select> </section>';
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

            $scope.modeChanged = function () {
                _cm.setOption("mode", $scope.mode.toLowerCase());
            };
        }
    };

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

    ACHTUNG http://interactjs.io/
     Bereits importiert

    $scope.makeDraggable = function (id, page) {
        angular.element("#" + id).draggable({
            containment: '.b-page-' + (page - 1),
            stop: function () {
                // Aktuelle Position speichern
                 var finalPos = $(this).position();
                 sessionStorage.setItem('xPos_'+id, finalPos.left);
                 sessionStorage.setItem('yPos_'+id, finalPos.top);
            },
            create: function () {
                // Position schon im Storage?
                 if(sessionStorage.getItem('xPos_'+id) === null){
                    sessionStorage.setItem('xPos_'+id, 0);
                    sessionStorage.setItem('yPos_'+id, 0);
                }
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
*/

/**
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
mainApp.directive('textareaelementinit', function () {
    return {
        template: "",
        link: function () {
            initSample();
        }
    };
});
 */

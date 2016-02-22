var mainApp = angular.module('mainApp');

mainApp.controller('notebookEditCtrl', function ($scope, $http, $stateParams, $sce, $window, loggedIn, ngDialog, $timeout, $state, $filter, fileUpload, Active) {

    $scope.publicViewed = true;
    $scope.currentPage = 1;
    $scope.editMode = false;
    $scope.models = {'code': {}, 'textarea': {}, 'image' : {}};
    $scope.additem = false;
    $scope.wf = false;
    $scope.active = true;

    // ADDITIONAL FUNCTIONS

    // Height of Notebook
    $scope.setHeight = function(element, ratio, minLimit) {
        setH(ratio, minLimit);

        window.addEventListener('resize', function (event) {
            setH(ratio, minLimit);
        });

        function setH(ratio, minLimit) {
            if (typeof(ratio) === "undefined") {
                ratio = 1;
            }
            if (typeof(minLimit) === "undefined") {
                minLimit = 0;
            }
            var viewportWidth = window.innerWidth;

            if (viewportWidth >= minLimit) {
                var newElementHeight = $(element).width() * ratio;
                $(element).height(newElementHeight);
            }
            else {
                $(element).height('auto');
            }
            $scope.notebookHeight = $(element).height();
            $scope.notebookWidth = $(element).width();
        }
    };

    // Get how many pixels are left to reach the border of notebook
    $scope.getLeftPixels = function(posx, posy){
        return {"x": $scope.notebookWidth-posx,"y": $scope.notebookHeight-posy};
    };


    // Set height of notebook
    $scope.setHeight("#notebook", 1.41);
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
        $scope.currentPage = $scope.notebook['current_page'];
        if($scope.currentPage != $scope.notebook['numpages']) {
            $scope.additem = true;
        }
        $scope.update();

        loggedIn.getUser().then(function (data) {
            var user = data['user'];
            if ($scope.notebook['email'] == user['email'] || $.inArray(user['email'], $scope.notebook['collaborator']) > -1) {
                $scope.publicViewed = false;
                $scope.update();
            } else {
                $scope.publicViewed = true;
            }

            $scope.checkEditActive(user['email']);
        });
    });

    $scope.checkEditModeActive = function(id, art, user) {
        $http({
            method: 'POST',
            url: '/api/notebook_activeby',
            data: {
                id: $stateParams.id,
                content_id: id,
                content_art: art
            }
        }).success(function (data) {
            if(data['active']){
                if(user == data['active_by']){
                    $scope.setEditMode(id, id, art);
                }
            }
        });
    };

    $scope.checkEditActive = function(user){
        for (var j = 0; j < $scope.content.length; j++) {
            if ($scope.content[j]['art'] == 'code' || $scope.content[j]['art'] == 'textarea') {
                $scope.checkEditModeActive($scope.content[j]['id'],$scope.content[j]['art'], user);
            }
        }
    };


    $scope.getColor = function(id, art){
        var url = "/api/notebook_isactive";
        var message = Active.isactive($stateParams.id, id, art, url);
        message.then(function (data) {
            if(data['active']){
                $scope.models[art][id][2] = 'red';
            }else{
                $scope.models[art][id][2] = 'white';
            }
        });
    };

    $scope.initElemModels = function () {
        for (var j = 0; j < $scope.content.length; j++) {
            if ($scope.content[j]['art'] == 'code') {
                $scope.models['code'][$scope.content[j]['id']] = {};
                $scope.models['code'][$scope.content[j]['id']][0] = $scope.content[j]['data']['data'];
                $scope.models['code'][$scope.content[j]['id']][1] = $scope.content[j]['data']['language'];
                $scope.models['code'][$scope.content[j]['id']][2] = $scope.getColor($scope.content[j]['id'],$scope.content[j]['art']);
            }
            else if($scope.content[j]['art'] == 'image'){
                $scope.models['image'][$scope.content[j]['id']] = {};
                $scope.models['image'][$scope.content[j]['id']][0] = $scope.content[j]['data']['data'];
                $scope.models['image'][$scope.content[j]['id']][1] = $scope.content[j]['data']['width'];
                $scope.models['image'][$scope.content[j]['id']][2] = $scope.content[j]['data']['height'];
            }else {
                $scope.models[$scope.content[j]['art']][$scope.content[j]['id']] = {};
                $scope.models[$scope.content[j]['art']][$scope.content[j]['id']][0] = $scope.content[j]['data']['data'];
                $scope.models[$scope.content[j]['art']][$scope.content[j]['id']][1] = $scope.getColor($scope.content[j]['id'],$scope.content[j]['art']);
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
            $scope.makeDraggable($scope.content[i]['id'], $scope.content[i]['art']);
        }
    };

    $scope.removeDraggables = function () {
        for (var i = 0; i < $scope.content.length; i++) {
            $scope.makeUndraggable($scope.content[i]['id'], $scope.content[i]['art']);
        }
    };

    $scope.update = function () {
        $scope.initSites();
        $scope.initElemModels();
        $scope.initDraggables();
    };

    $scope.toPage = function (page) {
        if (page > 0 && page <= $scope.notebook['numpages']) {
            $scope.currentPage = page;
            if (!$scope.publicViewed){
                $http({
                    method: 'POST',
                    url: '/api/notebook_currentsite_edit',
                    data: {id: $stateParams.id, current_site: $scope.currentPage}
                }).success(function (data) {
                    $scope.currentPage = page;
                    $scope.notebook = JSON.parse(data['notebook']);
                    $scope.update();
                });
            }
            if ($scope.currentPage == $scope.notebook['numpages']) {
                $scope.additem = false;
            } else {
                $scope.additem = true;
            }
        } else {
            if (page > 0) {
                $http({
                    method: 'POST',
                    url: '/api/notebook_length_edit',
                    data: {id: $stateParams.id}
                }).success(function (data) {
                    $scope.currentPage = page;
                    $scope.notebook = JSON.parse(data['notebook']);
                    $scope.update();
                });
            }
        }
    };


    // GENERAL ELEMENT FUNCTIONS

    $scope.addelement = function (art, data) {
        $http({
            method: 'POST',
            url: '/api/add_notebook_content',
            data: {id: $stateParams.id, content_art: art, content_site: $scope.currentPage, content_data: data}
        }).success(function (data) {
            $scope.notebook = JSON.parse(data['notebook']);
            $scope.content = $scope.notebook['content'];
            $scope.update();
        });
    };

    $scope.deleteelement = function (id, art) {
        if(art == 'image'){
            $scope.imageElementDelete(id);
            $window.location.reload();
        }
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

    $scope.imageElementDelete = function (id){
        $http({
            method: 'POST',
            url: '/api/notebook/deletefile',
            data: {file: $scope.models['image'][id][0]}
        }).success(function (data) {

        });
    };

    $scope.codeElementDelete = function (id, art) {
        if($scope.wf){
            $scope.codeLanguage = "";
        }
        ngDialog.open({
            template: 'deleteElementSettings',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        $scope.deleteid = id;
        $scope.deleteart = art;
    };

    $scope.editelement = function (id, art, data, active) {
            $http({
                method: 'POST',
                url: '/api/edit_notebook_content',
                data: {id: $stateParams.id, content_id: id, content_art: art, content_data: data, is_active: active}
            }).success(function (data) {
                $scope.notebook = JSON.parse(data['notebook']);
                $scope.content = $scope.notebook['content'];
                if(!active) {
                    $scope.update();
                }
            });
    };

    $scope.codeModeEdit = function (id, art){
        langu = $filter('filter')($scope.content, function (d) {return d.id === id;})[0];
        $scope.codeLanguage=langu['data']['language'];
        $scope.wf = true;
        ngDialog.open({
            template: 'codeElementSettings',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        $scope.cid = id;
    };

    $scope.importsite = function () {
        $http({
            method: 'POST',
            url: '/api/import_site',
            data: {id: JSON.parse($scope.notebook.import)['$oid'], data: $scope.sites[$scope.currentPage]}
        }).success(function (data) {
            $scope.notebook = JSON.parse(data['notebook']);
            $scope.content = $scope.notebook['content'];
            $scope.update();
        });
    };

    $scope.editPositionElement = function (id, art, posx, posy){
        $http({
            method: 'POST',
            url: '/api/edit_content_position',
            data: {id: $stateParams.id, content_id: id, content_art: art, pos_x: posx, pos_y: posy}
        }).success(function (data) {
            $scope.notebook = JSON.parse(data['notebook']);
            $scope.content = $scope.notebook['content'];
        });
    };

    $scope.editPictureElement = function(){
        data_data = "{\"data\":\""+$scope.models['image'][$scope.idimage][0]+"\", \"width\":\""+$scope.width+"\", \"height\":\""+$scope.height+"\"}";
        $scope.editelement($scope.idimage, 'image', data_data);
        $window.location.reload();
    };

    $scope.setEditMode = function (edit, id, art) {
        $scope.editMode = edit;
        var url = "/api/notebook_isactive";
        var message = Active.isactive($stateParams.id, id, art, url);
        message.then(function (data) {
            if(data['active']){
                $scope.editMode = null;
                $scope.models[art][id][2] = 'red';
            }
        });
        if(edit == null) {
            if (art == 'code') {
                $scope.editelement(id, art, {
                    "data": $scope.models[art][id][0],
                    "language": $scope.models[art][id][1]
                },false);
            }else if(art == 'textarea') {
                $scope.editelement(id, art, {"data": $scope.models[art][id][0]},false);
            }
            $scope.update();
        }else if(art == 'image') {
            $scope.editMode = false;
            $scope.idimage = id;
            $scope.width = $scope.models[art][id][1];
            $scope.height = $scope.models[art][id][2];
            $scope.editPicture();
        } else if (art == 'code') {
            $scope.editelement(id, art, {
                "data": $scope.models[art][id][0],
                "language": $scope.models[art][id][1]
            },true);
            $scope.removeDraggables();
        }else if(art == 'textarea') {
            $scope.editelement(id, art, {
                "data": $scope.models[art][id][0]
            }, true);
            $scope.removeDraggables();
        }
    };

    $scope.makeDraggable = function (id, art) {
        if(!$scope.publicViewed) {
            $timeout(function () {
                angular.element("#" + art + "_" + id).draggable({
                    containment: '#notebook',
                    stop: function () {
                        var finalPos = $(this).position();
                        $scope.editPositionElement(id, art, finalPos.left, finalPos.top);
                        $(this).css('width','auto');
                        $(this).css('max-width','85%');
                        $(this).css('max-height','85%');
                    },
                    create: function () {
                    }
                });
            });
        }
    };

    $scope.makeUndraggable = function (id, art) {
        if(!$scope.publicViewed) {
            angular.element("#" + art + "_" + id).draggable("destroy");
        }
    };


    // CODE ELEMENT
    $scope.codeLanguage="";

    $scope.setCodeElementLanguage = function(lang){
        $scope.codeLanguage = lang;
    };

    $scope.addCodeElement = function(){
        if(!$scope.wf) {
            data = "{\"data\":\"\", \"language\":\"" + $scope.codeLanguage + "\"}";
            console.log(data);
            $scope.addelement('code', data);
        }else{
            $scope.wf = false;
            single_object = $filter('filter')($scope.content, function (d) {return d.id === $scope.cid;})[0];
            // If you want to see the result, just check the log
            // console.log(single_object['data']['data']);
            data = "{\"data\":\""+single_object['data']['data']+"\", \"language\":\"" + $scope.codeLanguage + "\"}";
            $scope.editelement($scope.cid, 'code',data);
        }
    }

    // NgDialog zum erstellen, bearbeiten und exportieren von Code Elementen
    $scope.codeElementCreate = function () {
        $scope.codeLanguage="";
        ngDialog.open({
            template: 'codeElementSettings',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.addPicture = function () {
        $scope.width = null;
        $scope.height = null;
        ngDialog.open({
            template: 'addPicture',
            controller: 'notebookEditCtrl',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.editPicture = function () {
        $scope.showError = false;
        ngDialog.open({
            template: 'editPicture',
            controller: 'notebookEditCtrl',
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

    $scope.exportSite = function () {
        $http({
            method: 'POST',
            url: '/api/get_notebooks'
        })
            .success(function (data) {
                $scope.notebooks = JSON.parse(data['notebooks']);
                $http({
                    method: 'POST',
                    url: '/api/get_collnotebooks'
                })
                    .success(function (data) {
                        $scope.notebooks=$scope.notebooks.concat(JSON.parse(data['notebooks']));
                        ngDialog.open({
                            template: 'exportCode',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                    })
                    .error(function (data) {
                    });
            })
            .error(function (data) {
            });
    };

    $scope.uploadOCRFile = function(){
        var file = $scope.ocrFile;
        if((file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") && file.size < 5242880) {//5MByte
            $scope.errormessage = "";
            var uploadUrl = "/api/analyseOCR";
            var message = fileUpload.uploadFileToUrl(file, uploadUrl);
            message.then(function(data) {
                data_data = "{\"data\":\""+data['ocrt']+"\"}";
                $scope.addelement('textarea', data_data);
                $window.location.reload();
                $window.location.reload();
            });
            ngDialog.close({
                template: 'ocrFileDialog',
                controller: 'notebookEditCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        }else{
            if(file.size < 5242880) {
                $scope.errormessage = "file size is more than 5MB";
            }else{
                $scope.errormessage = "filetyp is not supported";
            }
        }
    };


    $scope.addOCRPic = function(){
        ngDialog.open({
            template: 'ocrFileDialog',
            controller: 'notebookEditCtrl',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        if((file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") && file.size < 5242880) {//5MByte
            $scope.errormessage = "";
            var uploadUrl = "/api/notebook/upload";
            var message = fileUpload.uploadFileToUrl(file, uploadUrl);
            message.then(function (data) {
                var width = 0;
                var height = 0;
                if ($scope.width){width = $scope.width;}
                if ($scope.height){height = $scope.height;}
                data_data = "{\"data\":\"" + data['message'] + "\", \"width\":\"" + width + "\", \"height\":\"" + height + "\"}";
                $scope.addelement('image', data_data);
                $window.location.reload();
                $window.location.reload();

            });
            ngDialog.close({
                template: 'addPicture',
                controller: 'notebookEditCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        }else{
            if(file.size < 5242880) {
                $scope.errormessage = "file size is more than 5MB";
            }else{
                $scope.errormessage = "filetyp is not supported";
            }
            //alert("file size is more than 5MB");
        }
    };

    //Picture Element Validatation
    $scope.onlyNumbers = function(){
        if($scope.width == '' ||  $scope.height == ''){
            $scope.showError = true;
        }else{
            var flagw = true;
            var flagh = true;
            if($scope.width != null) {
                var arr = $scope.width.split("");
                for (var i = 0; i < arr.length; i++) {
                    if (isNaN(arr[i])) {
                        $scope.showError = true;
                        flagw = false;
                        break;
                    }
                }
            }
            if($scope.height != null) {
                var arr = $scope.height.split("");
                for (var i = 0; i < arr.length; i++) {
                    if (isNaN(arr[i])) {
                        $scope.showError = true;
                        flagh = false;
                        break;
                    }
                }
            }
            if(flagw && flagh)$scope.showError = false;
        }
    }

    $scope.onlyNumbers1 = function(){
        var flagw = true;
        var flagh = true;
        if($scope.width != null) {
            var arr = $scope.width.split("");
            for (var i = 0; i < arr.length; i++) {
                if (isNaN(arr[i])) {
                    $scope.showError = true;
                    flagw = false;
                    break;
                }
            }
        }
        if($scope.height != null) {
            var arr = $scope.height.split("");
            for (var i = 0; i < arr.length; i++) {
                if (isNaN(arr[i])) {
                    $scope.showError = true;
                    flagh = false;
                    break;
                }
            }
        }
        if(flagw && flagh)$scope.showError = false;

    };

    $scope.redirectNotebook_2 = function (id) {
        $http({
            method: 'POST',
            url: '/api/notebook_logout',
            headers: {'Content-Type': 'application/json'},
            data: {
                notebook_id: id
            }
        })
            .success(function (data) {
                $state.go('management.notebooks');
            })
            .error(function (data) {
            });
    };

    $scope.poll = function(){
        $timeout(function() {
            var content = $scope.notebook['content'];
            $http({
                method: 'POST',
                url: '/api/get_notebook',
                data: {id: $stateParams.id}
            }).success(function (data) {
                $scope.notebook = JSON.parse(data['notebook']);
                $scope.content = $scope.notebook['content'];
                if(JSON.stringify($scope.content) != JSON.stringify(content)) {
                    $scope.update();
                }
                $scope.poll();
            });
        }, 10000);
    };

    $scope.poll();

    $scope.readLogNotebook = function (id) {
        $http({
            method: 'POST',
            url: '/api/read_log_notebook',
            headers: {'Content-Type': 'application/json'},
            data: {
                notebook_id: id
            }
        })
            .success(function (data) {
                $state.go('management.notebooks');
            })
            .error(function (data) {
            });
    };

});

// OCR

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

mainApp.service('fileUpload', ['$http', '$q', function ($http, $q) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        var link = $q.defer();
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'enctype':'multipart/form-data'}
        })
            .success(function(data) {
                link.resolve(data);
            })
            .error(function(data){
                link.reject(data);
            });
        return link.promise;
    };
}]);

mainApp.service('Active', ['$http', '$q', function ($http, $q) {
    this.isactive = function(id, content_id, content_art, url){
        var fd = new FormData();
        fd.append('notebook', id);
        fd.append('content_id', content_id);
        fd.append('content_art', content_art);
        var link = $q.defer();
        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'enctype':'multipart/form-data'}
        })
            .success(function(data) {
                link.resolve(data);
            })
            .error(function(data){
                link.reject(data);
            });
        return link.promise;
    };
}]);


// TEXT ELEMENT

mainApp.directive('ckeditor', function () {
    return {
        require: '?ngModel',
        //TODO Init wird beim ersten mal nicht richtig ausgeführt (TypeError: a.ui.space(...) is null)
        link: function(scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0], {
                extraPlugins: 'autogrow',
                autoGrow_minHeight: 20,
                autoGrow_maxHeight: 800,
                width: window.innerWidth * 0.58,
                removePlugins: 'resize',
                contentsCss : 'body {overflow:hidden;}',
                fullPage: true
            });

            if (!ngModel) return;

            ck.on('instanceReady', function () {
                ck.setData(ngModel.$viewValue);
            });

            function updateModel() {
                scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            }

            //ck.on('all', updateModel);
            //TODO Event zur Korrekten Speicherung finden
            ck.on( 'contentDom', function() {
                var editable = ck.editable();

                editable.attachListener( editable, 'keyup', updateModel);
                editable.attachListener( editable, 'change', updateModel);
            });

            ck.on('dataReady', updateModel);
            ck.on('key', updateModel);
            ck.on('paste', updateModel);
            ck.on('selectionChange', updateModel);


            ngModel.$render = function (value) {
                ck.setData(ngModel.$viewValue);
            };
        }
    };
});

// SET POSITION OF ARROWS

function setPos(element) {
    setP();
    window.addEventListener('resize', function (event) {
        setP();
    });
    function setP() {
        var viewportHeight = window.innerHeight;

        var newElementPos = viewportHeight / 2 - 40;
        $(element).css("padding-top", newElementPos);
    }
}

function setPosBottom(element) {
    setP();
    window.addEventListener('resize', function (event) {
        setP();
    });
    function setP() {
        var viewportHeight = window.innerHeight;

        var newElementPos = viewportHeight - 40;
        $(element).css("padding-top", newElementPos);
    }
}

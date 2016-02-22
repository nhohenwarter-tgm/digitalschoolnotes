var mainApp = angular.module('mainApp');

mainApp.controller('managementCtrl', function ($scope, $http, $state, $translate, loggedIn) {
    loggedIn.getUser().then(function (data) {
        if(data['user']['oauth']){
            $scope.is_oauth = true;
        }
    });
    $scope.search = function () {
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        $scope.l = 0;
        $scope.sort = {
            sortingOrder: 'email'
        };
        $http({
            method: 'POST',
            url: '/api/otherprofile',
            headers: {'Content-Type': 'application/json'},
            data: {searchtext: $scope.q, Page: $scope.currentPage, counter: $scope.itemsPerPage,}
        })
            .success(function (data) {
                sessionStorage.setItem('search', document.getElementById('search').value);
                $scope.profiles = data['profiles'];
                sessionStorage.setItem('profiles', data['profiles']);
                $scope.len = data['len'];
                sessionStorage.setItem('len', $scope.len);
                $scope.currentPage = 0;
                sessionStorage.setItem('currentPage', $scope.currentPage);
                $scope.l = Math.ceil($scope.len/$scope.itemsPerPage);
                sessionStorage.setItem('l', $scope.l);
                $state.go('management.search');
            })
            .error(function (data) {
            });
    }
    $scope.len = sessionStorage.getItem('len');
    $scope.q = sessionStorage.getItem('search');
    //$scope.profiles = localStorage.getItem('profiles');
    $scope.l = sessionStorage.getItem('l');
    $scope.currentPage = sessionStorage.getItem('currentPage');

    $scope.next = function (current) {
        $http({
            method: 'POST',
            url: '/api/otherprofile',
            headers: {'Content-Type': 'application/json'},
            data: {searchtext: $scope.q, Page: current, counter: $scope.itemsPerPage}
        })
            .success(function (data) {
                $scope.profiles = data['profiles'];
                sessionStorage.setItem('profiles', data['profiles']);
                sessionStorage.setItem('currentPage', $scope.currentPage);
            })
            .error(function (data) {
            });
    };


    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    $scope.range = function (size, start, end) {
        var ret = [];
        if (size < end) {
            end = size;
            start = size;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.firstPage = function () {
        $scope.currentPage = 0;
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.l- 1) {
            $scope.currentPage++;
        }
    };

    $scope.lastPage = function () {
        $scope.currentPage = $scope.l-1;
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };
});

mainApp.controller('accsettingsCtrl', function ($rootScope, $scope, $http, $window, $state, $translate, $controller, loggedIn, ngDialog) {
    $scope.getUserData = function () {
        $http({
            method: 'POST',
            url: '/api/get_userSettings',
            headers: {'Content-Type': 'application/json'}
        })
            .success(function (data) {
                if (data['error'] == true) {
                    $state.go('management.timetable');
                } else {
                    $scope.first_name = data['first_name'];
                    $scope.last_name = data['last_name'];
                    $scope.email = data['email'];
                    $scope.pwd = "";
                    $scope.new_pwd = "";
                    $scope.pwdrepeat = "";
                }
            })
            .error(function (data) {
            });
    };

    $scope.getUserData();

    $scope.openPasswordDialog = function(type, message) {
        $scope.editType = type;

        var data = {};
        if($scope.editType == 'data'){
            data = {
                'first_name': $scope.first_name,
                'last_name': $scope.last_name,
                'email': $scope.email
            };
        }else if($scope.editType == 'password'){
           data = {
               'password_new': $scope.new_pwd,
               'password_repeat': $scope.pwdrepeat
           };
        }
        if(message != null){
            $scope.message = message;
        }

        $rootScope.accsettdata = data;
        ngDialog.open({
            template: 'confirmPassword',
            scope: $scope
        });
    };

    $scope.confirmOldPassword = function(pwd) {
        $scope.pwd = pwd;
        ngDialog.close({
            template: 'confirmPassword'
        });

        if($scope.editType == 'data'){
            $scope.first_name = $rootScope.accsettdata.first_name;
            $scope.last_name = $rootScope.accsettdata.last_name;
            $scope.email = $rootScope.accsettdata.email;
            $rootScope.data = null;
            $scope.submitEditUserData();
        }else if($scope.editType == 'password'){
            $scope.password_new = $rootScope.accsettdata.password_new;
            $scope.password_repeat = $rootScope.accsettdata.password_repeat;
            $rootScope.data = null;
            $scope.submitEditUserPassword();
        }
    };

    $scope.openSuccessDialog = function() {
        ngDialog.open({
            template: 'changeSuccessful',
            scope: $scope,
            showClose: false,
            closeByEscape: false,
            closeByDocument: false
        });
    };

    $scope.closeSuccessDialog = function() {
        ngDialog.close({
            template: 'changeSuccessful'
        });
        if($rootScope.deletedAccount == true){
            $state.go('mainpage.content');
            $rootScope.deletedAccount = null;
        }
    };

    $scope.submitEditUserData = function() {
        $scope.submitted_data = true;
        var first_name = $scope.first_name;
        var last_name = $scope.last_name;
        var email = $scope.email;
        var password_old = $scope.pwd;

        if($scope.editUserData.$valid) {
            password_old = CryptoJS.SHA256(password_old);

            $http({
                method: 'POST',
                url: '/api/userdata_edit',
                headers: {'Content-Type': 'application/json'},
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password_old.toString()
                }
            })
                .success(function (data) {
                    if (data['message'] != null) {
                        $scope.openPasswordDialog("data", data['message']);
                    } else if(data['logout'] == true) {
                        $scope.openSuccessDialog();
                    } else {
                        $scope.getUserData();
                        $scope.openSuccessDialog();
                    }
                })
                .error(function (data) {
                });
        }
    };

    $scope.checkEditUserPassword = function() {
        $scope.error_password = "";
        $scope.error = false;
        var password_new = $scope.new_pwd;
        var password_repeat = $scope.pwdrepeat;
        if(password_new != password_repeat) {
            $scope.error = true;
            $translate("error_password_dontmatch").then(function(message){
                $scope.error_password = message+"\n";
            });
        }
        if(password_new == ""){
            $scope.error = true;
            $translate("error_password_tooshort").then(function(message){
                $scope.error_password = message+"\n";
            });
        }
        if(!$scope.error){
            $scope.openPasswordDialog('password', null);
        }
    };

    $scope.submitEditUserPassword = function() {
        $scope.submitted_pwd = true;
        $scope.error_password = "";
        $scope.error = false;
        var password_old = $scope.pwd;
        var password_new = $scope.new_pwd;
        var password_repeat = $scope.pwdrepeat;
        if(password_new == null){
            password_new="";
        }
        if(password_new != password_repeat) {
            $scope.error = true;
            $translate("error_password_dontmatch").then(function(message){
                $scope.error_password = message+"\n";
            });
        }
        if(password_new == ""){
            $scope.error = true;
            $translate("error_password_tooshort").then(function(message){
                $scope.error_password = message+"\n";
            });
        }

        if($scope.editUserPassword.$valid && !$scope.error) {
            if(password_new != "") {
                password_new = CryptoJS.SHA256(password_new);
            }
            password_old = CryptoJS.SHA256(password_old);

            $http({
                method: 'POST',
                url: '/api/password_edit',
                headers: {'Content-Type': 'application/json'},
                data: {
                    password: password_new.toString(),
                    password_old: password_old.toString()
                }
            })
                .success(function (data) {
                    if (data['message'] != null) {
                        $scope.openPasswordDialog("password", data['message']);
                    } else {
                        $scope.getUserData();
                        $scope.openSuccessDialog();
                    }
                })
                .error(function (data) {
                });
        }
    };

    $scope.resetEdit = function(type) {
        $http({
            method: 'POST',
            url: '/api/get_userSettings',
            headers: {'Content-Type': 'application/json'}
        })
            .success(function (data) {
                if (data['error'] == true) {
                    $state.go('management.timetable');
                } else {
                    if(type == 'data'){
                        $scope.first_name = data['first_name'];
                        $scope.last_name = data['last_name'];
                        $scope.email = data['email'];
                    }else if(type == 'password'){
                        $scope.pwd = "";
                        $scope.new_pwd = "";
                        $scope.pwdrepeat = "";
                    }
                }
            })
            .error(function (data) {
            });

    };

    $scope.deleteAccountDialog = function () {
        ngDialog.open({
            template: 'deleteAccount',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.deleteAccount = function(){
        $http({
            method: 'POST',
            url: '/api/delete_account'
        })
            .success(function (data) {
                $rootScope.deletedAccount = true;
                $scope.openSuccessDialog();
            })
            .error(function (data) {
            });
    };
});

mainApp.controller('notebooksCtrl', function ($scope, $http, $state, $window, $translate, loggedIn, ngDialog) {
    $scope.getNotebooks = function() {
        $http({
            method: 'POST',
            url: '/api/get_notebooks'
        })
            .success(function (data) {
                $scope.notebooks = JSON.parse(data['notebooks']);
            })
            .error(function (data) {
            });
    };

    $scope.getNotebooks();

    $scope.getCollNotebooks = function() {
        $http({
            method: 'POST',
            url: '/api/get_collnotebooks'
        })
            .success(function (data) {
                $scope.notebooks_coll = JSON.parse(data['notebooks']);
            })
            .error(function (data) {
            });
    };

    $scope.getCollNotebooks();

    $scope.deleteNotebookDialog = function (id) {
        ngDialog.open({
            template: 'deleteNotebook',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        $scope.notebookid = id;
    };

    $scope.deleteNotebook = function(){
        $http({
            method: 'POST',
            url: '/api/delete_notebooks',
            data: {
                id: $scope.notebookid
            }
        })
            .success(function (data) {
                $scope.getNotebooks();
            })
            .error(function (data) {
                $scope.getNotebooks();
            });
        $scope.notebookid = null;
    };

    $scope.removeCollNotebookDialog = function (coll) {
        ngDialog.open({
            template: 'removeCollNotebook',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        $scope.coll = coll;
    };

    $scope.removeCollNotebook = function () {
                loggedIn.getUser().then(function (data) {
                    var user = data['user'];
                    $http({
                        method: 'POST',
                        url: '/api/remove_notebook_collaborator',
                        headers: {'Content-Type': 'application/json'},
                        data: {
                            id: $scope.coll,
                            collaborator: user['email']
                        }
                    })
                        .success(function (data) {
                            $window.location.reload();
                        })
                        .error(function (data) {
                        });

                });
    };

    $scope.redirectNotebook = function (id) {
         loggedIn.getUser().then(function (data) {
                    var user = data['user'];
                    $http({
                        method: 'POST',
                        url: '/api/log_notebook',
                        headers: {'Content-Type': 'application/json'},
                        data: {
                            notebook_id: id,
                            user: user['email']
                        }
                    })
                        .success(function (data) {
                            $state.go('notebookedit', {'id': id});
                        })
                        .error(function (data) {
                        });

                });

    };


    $scope.redirectEdit = function (id) {
        $state.go('management.notebook_edit', {'id': id});
    };

    $scope.redirectCreate = function () {
        if($scope.notebooks.length >= 10){ //TODO Maximale Heftanzahl festlegen
            ngDialog.open({
            template: 'notebooklimit',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        }else {
            $state.go('management.notebooks_create');
        }
    };
});

mainApp.controller('timetableCtrl', function ($scope, $http, $state, ngDialog, $timeout, $rootScope, $translate) {
    $scope.activeRow = null;
    $scope.activeID = null;
    $scope.editMode = false;

    $scope.getFields=function(fieldlist){
        var fields={};
        for(var i = 0;i<fieldlist.length;i++){
            fields[fieldlist[i]["id"]]=[fieldlist[i]["subject"],fieldlist[i]["teacher"],fieldlist[i]["room"],fieldlist[i]["notebook"]];
        }
        return fields;
    };

    $scope.getTimes=function(timelist){
        $scope.timesNumber = timelist.length;
        var fields={};
        for(var i = 0;i<timelist.length;i++){
            fields[timelist[i]["row"]]=[timelist[i]["start"],timelist[i]["end"]];
        }
        return fields;
    };

    $scope.getTimesNumberArray=function(){
        var n = new Array();
        for(var i = 1; i < $scope.timesNumber+1; i++){
            n.push(i);
        }
        return n;
    };

    $scope.getNotebooks=function(){
        $http({
            method: 'POST',
            url: '/api/get_notebooks'
        })
            .success(function (data) {
                var nbs = JSON.parse(data['notebooks']);
                var nblist = [];
                for(var i = 0; i < nbs.length; i++) {
                    nblist.push({name: nbs[i]["name"], value: nbs[i]["name"]});
                }
                $scope.notebooksList = nblist;
            })
            .error(function (data) {
                $scope.notebooksList = [];
            });
    };

    $scope.getTimetable = function() {
        $http({
            method: 'POST',
            url: '/api/timetable',
            headers: {'Content-Type': 'application/json'}
        })
            .success(function (data) {
                var timetable = JSON.parse(data["timetable"]);
                $scope.field = $scope.getFields(timetable["fields"]);
                $scope.times = $scope.getTimes(timetable["times"]);
            })
            .error(function (data) {

            });
    };
    $scope.getNotebooks();
    $scope.getTimetable();

    $scope.submitTimeTable = function (subject, teacher, room, notebook) {
        $scope.subject = subject;
        $scope.teacher = teacher;
        $scope.room = room;
        $scope.notebook = notebook;
        ngDialog.close({
            template: 'edittimetable'
        });
        var subject = $scope.subject;
        var teacher = $scope.teacher;
        var room = $scope.room;
        var notebook = $scope.notebook;
        $scope.fieldId = $rootScope.fieldId;
        $http({
            method: 'POST',
            url: '/api/timetable/add',
            headers: {'Content-Type': 'application/json'},
            data: {subject: subject, teacher: teacher, room: room, notebook: notebook, fieldId: $scope.fieldId}
        })
            .success(function (data) {
                $scope.getTimetable();
            })
            .error(function (data) {
            });
        $scope.activeID = null;
    };

    $scope.show=function(feldId) {
        if($scope.editMode) {
            if (feldId == $scope.activeID) {
                $scope.activeID = null;
                return;
            }
            $scope.subject = $scope.field[feldId][0];
            $scope.teacher = $scope.field[feldId][1];
            $scope.room = $scope.field[feldId][2];
            $scope.notebook = $scope.field[feldId][3];
            $scope.notebook_selected = $scope.field[feldId][3];
            $scope.activeID = feldId;
            $scope.activeRow = null;
            $scope.edittimetableDialog();
        }else{
            if($scope.field[feldId][3] != "") {
                $http({
                    method: 'POST',
                    url: '/api/get_notebook',
                    headers: {'Content-Type': 'application/json'},
                    data: {
                        name: $scope.field[feldId][3]
                    }
                })
                    .success(function (data) {
                        if (data['error'] == true) {
                            $translate("error_timetable_notebooknotfound").then(function(message) {
                                $scope.timetableError = message;
                            });
                        } else if(data['notebook'] == null) {
                            $translate("error_timetable_notebooknotassigned").then(function(message) {
                                $scope.timetableError = message;
                            });
                        }else{
                            $state.go('notebookedit',{id: JSON.parse(data['notebook'])['_id']['$oid']});
                        }
                    })
                    .error(function (data) {
                        $translate("error_timetable_notebooknotfound").then(function(message) {
                            $scope.timetableError = message;
                        });
                    });
            }
        }
    };

    $scope.edittimetableDialog = function () {
        $rootScope.fieldId = $scope.activeID;
        ngDialog.open({
            template: 'edittimetable',
            scope: $scope
        });
    };

    $scope.edittimetabletimeDialog = function () {
        $rootScope.activeRow = $scope.activeRow;
        ngDialog.open({
            template: 'edittime',
            scope: $scope
        });
    };

    $scope.showZ=function(rowId){
        if($scope.editMode) {
            if (rowId == $scope.activeRow) {
                $scope.activeRow = null;
                return;
            }
            $scope.start = $scope.times[rowId][0];
            $scope.end = $scope.times[rowId][1];
            $scope.activeRow = rowId;
            $scope.activeID = null;
            $scope.edittimetabletimeDialog();
        }
    };

    $scope.submitTimes = function (start,end) {
        $scope.start = start;
        $scope.end = end;
        ngDialog.close({
            template: 'edittime'
        });
        var start = $scope.start;
        var end = $scope.end;
        $scope.rowId = $rootScope.activeRow;
        if($scope.timetableTimes.$valid) {
            $http({
                method: 'POST',
                url: '/api/timetabletimes',
                headers: {'Content-Type': 'application/json'},
                data: {start: start, end: end, rowId: $scope.rowId}
            })
                .success(function (data) {
                    $scope.getTimetable();

                })
                .error(function (data) {

                });
            $scope.activeRow = null;
        }
    };

    $scope.setEditMode = function(edit){
        $scope.editMode = edit;
        $scope.activeID = null;
        $scope.activeRow = null;
    };

});

mainApp.controller('notebooksCreateCtrl', function ($scope, $http, loggedIn, $state) {
    $scope.submitCreateNotebook = function () {
        $scope.submitted = true;
        var name = $scope.name;
        if($scope.is_public == true){
            var is_public = true;
        }
        else {
            var is_public = false;
        }
        if($scope.createNotebook.$valid) {
            $http({
                method: 'POST',
                url: '/api/notebooks_create',
                headers: {'Content-Type': 'application/json'},
                data: {
                    name: name,
                    is_public: is_public
                }
            })
                .success(function (data) {
                    if (data['message'] != null) {
                        $scope.message = data['message'];
                    } else {
                        $state.go('management.notebooks');
                    }
                })
                .error(function (data) {

                });
        }
    };

    $scope.cancelCreate = function() {
        $state.go('management.notebooks');
    }
});

mainApp.controller('editNotebookCtrl', function($scope, $http, $stateParams, $state, $translate, $window, loggedIn) {
    $scope.names = [];
    $http({
        method: 'POST',
        url: '/api/get_notebook',
        headers: {'Content-Type': 'application/json'},
        data: {
            id: $stateParams.id
        }
    })
        .success(function (data) {
            if (data['error'] == true) {
                $state.go('management.notebooks');
            } else {
                $scope.name = JSON.parse(data['notebook'])['name'];
                $scope.is_public = JSON.parse(data['notebook'])['is_public'];
                $scope.collaborator = JSON.parse(data['notebook'])['collaborator'];
            }
        })
        .error(function (data) {
            $state.go('management.notebooks');
        });


    $scope.submitEditNotebook = function () {
        var name = $scope.name;
        var is_public = $scope.is_public;
        if ($scope.editNotebook.$valid) {
            $http({
                method: 'POST',
                url: '/api/notebook_edit',
                headers: {'Content-Type': 'application/json'},
                data: {
                    id: $stateParams.id,
                    name: name,
                    is_public: is_public,
                    collaborator: $scope.collaborator
                }
            })
                .success(function (data) {
                    if (data['message'] != null) {
                        $scope.message = data['message'];
                    } else {
                        $state.go('management.notebooks');
                    }
                })
                .error(function (data) {
                });
        }
    };

    $scope.cancelEdit = function () {
        $state.go('management.notebooks');
    };

    $scope.addCollaborator = function () {
        var collaborator = $scope.add_collaborator;
        $http({
            method: 'POST',
            url: '/api/edit_notebook_collaborator',
            headers: {'Content-Type': 'application/json'},
            data: {
                id: $stateParams.id,
                collaborators: $scope.collaborator,
                newcoll: collaborator
            }
        })
            .success(function (data) {
                if (data['message1'] != null) {
                    $scope.message1 = data['message1'];
                } else {
                    $scope.message1 = null;
                    $scope.collaborator.push(collaborator);
                }
            })
            .error(function (data) {
            });
    };

    $scope.searchCollaborator = function () {
        $http({
            method: 'POST',
            url: '/api/getothercollaborators',
            headers: {'Content-Type': 'application/json'},
            data: {searchtext: $scope.add_collaborator}
        })
            .success(function (data) {
                $scope.findcollaborator = data['profiles'];
                //$scope.names = [];
                var result = JSON.stringify($scope.findcollaborator);
                result = result.substring(1, result.length - 1);
                var find = '"';
                var reg = new RegExp(find, 'g');
                result = result.replace(reg, '');
                result = result.split(',');
                for (index = 0; index < result.length; ++index) {
                    if ($scope.names.indexOf(result[index]) == -1)$scope.names.push(result[index]);
                }
            })
    };

    $scope.removeCollaborator = function (coll) {
        for (var i = $scope.collaborator.length - 1; i >= 0; i--) {
            if ($scope.collaborator[i] === coll) {
                $scope.collaborator.splice(i, 1);
                break;
            }
        }
    };
});

mainApp.controller('logoutCtrl', function ($scope, $http, $state) {
    $scope.logout = function () {
        $http({
            method: 'GET',
            url: '/api/logout',
            data: {}
        })
            .success(function (data) {
                $state.go('mainpage.content');
            })
            .error(function (data) {

            });
    }
});

mainApp.controller('profileCtrl', function ($scope, $http, $stateParams) {
    $http({
        method: 'POST',
        url: '/api/profile',
        data: {id: $stateParams.id}
    }).success(function (data) {
            $scope.first_name = data['first_name'];
            $scope.first_name = data['first_name'];
            $scope.last_name = data['last_name'];
            $scope.email = data['email'];
            $scope.date_joined = data['date_joined'].substring(0, 10);
            $scope.is_prouser = data['is_prouser'];
            $scope.is_admin = data['is_superuser'];
            $scope.notebooks = JSON.parse(data['notebooks']);
        }
    )
});

mainApp.controller('searchCtrl', function ($scope, $http) {
    $scope.search();
});

mainApp.directive("randombackground", function () {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {

            //generate random color
            var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

            //Add random background class to selected element
            element.css('background-color', color);

        }
    }
});

mainApp.directive('autoComplete', function ($timeout) {
    return function (scope, iElement, iAttrs) {
        iElement.autocomplete({
            source: scope[iAttrs.uiItems],
            select: function () {
                $timeout(function () {
                    iElement.trigger('input');
                }, 0);
            }
        });
    };
});
var mainApp = angular.module('mainApp');
mainApp.controller('managementCtrl', function ($scope, $http, $state, $translate) {
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

mainApp.controller('accsettingsCtrl', function ($scope, $http, $window, $state, loggedIn) {
    $http({
            method: 'POST',
            url: '/api/get_userSettings',
            headers: {'Content-Type': 'application/json'}
        })
            .success(function (data) {
                if(data['error'] == true){
                    $state.go('management.timetable');
                }else {
                    $scope.first_name = data['first_name'];
                    $scope.last_name = data['last_name'];
                    $scope.email = data['email'];
                    $scope.old_pwd="";
                    $scope.pwd="";
                    $scope.pwdrepeat="";
                }
            })
            .error(function (data) {
            });


    $scope.submitEditUser = function() {
        $scope.submitted = true;
        $scope.error = false;
        var first_name = $scope.first_name;
        var last_name = $scope.last_name;
        var email = $scope.email;
        var password_old = $scope.old_pwd;
        var password_new = $scope.pwd;
        var password_repeat = $scope.pwdrepeat;
        if(password_new == null){
            password_new="";
        }else{
            if(password_new != password_repeat) {
                $scope.error = true;
                $translate("error_password_dontmatch").then(function(message){
                    $scope.reset_error = message+"\n";
                });
            }
        }

        if(password_new != "") {
            password_new = CryptoJS.SHA256(password_new);
        }
        password_old = CryptoJS.SHA256(password_old);
        if($scope.editUser.$valid && $scope.error ==false) {
            $http({
                method: 'POST',
                url: '/api/user_edit',
                headers: {'Content-Type': 'application/json'},
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password_new.toString(),
                    password_old: password_old.toString()
                }
            })
                .success(function (data) {
                    if (data['message'] != null) {
                        $scope.message = data['message'];
                    } else {
                        $state.go('management.timetable');
                    }
                })
                .error(function (data) {
                });
        }
    };

    $scope.cancelEdit = function() {
        $state.go('management.timetable');
    };

    $scope.deleteAccount = function(){
        $translate("account_delete_warnmessage").then(function(message){
            var confirm = $window.confirm(message);
            if(confirm){
                $http({
                    method: 'POST',
                    url: '/api/delete_account'
                })
                    .success(function (data) {
                        $state.go('mainpage.content');
                    })
                    .error(function (data) {
                        $state.go('mainpage.content');
                    });
            }
        });


    };
});

mainApp.controller('notebooksCtrl', function ($scope, $http, $state, $window, $translate) {
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
    }

    $scope.getNotebooks();

    $scope.deleteNotebook = function(id){
        $translate("notebook_delete_warnmessage").then(function(message) {
            var confirm = $window.confirm(message);
            if (confirm) {
                $http({
                    method: 'POST',
                    url: '/api/delete_notebooks',
                    data: {
                        id: id
                    }
                })
                    .success(function (data) {
                        $scope.getNotebooks();
                    })
                    .error(function (data) {
                        $scope.getNotebooks();
                    });
            }
        });
    };

    $scope.redirectNotebook = function (id) {
        $state.go('notebookedit', {'id': id});
    };

    $scope.redirectEdit = function (id) {
        $state.go('management.notebook_edit', {'id': id});
    };

    $scope.redirectCreate = function () {
        if($scope.notebooks.length >= 10){ //TODO Maximale Heftanzahl festlegen
            $translate("notebook_max_warnmessage").then(function(message) {
                alert(message);
            });
        }else {
            $state.go('management.notebooks_create');
        }
    };
});

mainApp.controller('timetableCtrl', function ($scope, $http, $state) {
    $scope.activeRow = null;
    $scope.activeID = null;
    $scope.editMode = false;

    $scope.getFields=function($fieldlist){
        var fields={};
        for(var i = 0;i<$fieldlist.length;i++){
            fields[$fieldlist[i]["id"]]=[$fieldlist[i]["subject"],$fieldlist[i]["teacher"],$fieldlist[i]["room"],$fieldlist[i]["notebook"]];
        }

        return fields;
    };

    $scope.getTimes=function($timelist){
        $scope.timesNumber = $timelist.length;
        var fields={};
        for(var i = 0;i<$timelist.length;i++){
            fields[$timelist[i]["row"]]=[$timelist[i]["start"],$timelist[i]["end"]];
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
    }

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

    $scope.submitTimeTable = function () {
        var subject = $scope.subject;
        var teacher = $scope.teacher;
        var room = $scope.room;
        var notebook = $scope.notebook;
        if($scope.timetable.$valid) {
            $http({
                method: 'POST',
                url: '/api/timetable_add',
                headers: {'Content-Type': 'application/json'},
                data: {subject: subject, teacher: teacher, room: room, notebook: notebook, fieldId: $scope.activeID}
            })
                .success(function (data) {
                    $scope.getTimetable();
                })
                .error(function (data) {

                });
            $scope.activeID = null;
        }
    };
    $scope.show=function($feldId) {
        if($scope.editMode) {
            if ($feldId == $scope.activeID) {
                $scope.activeID = null;
                return;
            }
            $scope.subject = $scope.field[$feldId][0];
            $scope.teacher = $scope.field[$feldId][1];
            $scope.room = $scope.field[$feldId][2];
            $scope.notebook = $scope.field[$feldId][3];
            $scope.activeID = $feldId;
            $scope.activeRow = null;
        }else{
            if($scope.field[$feldId][3] != "") {
                $http({
                    method: 'POST',
                    url: '/api/get_notebook',
                    headers: {'Content-Type': 'application/json'},
                    data: {
                        name: $scope.field[$feldId][3]
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

    $scope.showZ=function($rowId){
        if($scope.editMode) {
            if ($rowId == $scope.activeRow) {
                $scope.activeRow = null;
                return;
            }
            $scope.start = $scope.times[$rowId][0];
            $scope.end = $scope.times[$rowId][1];
            $scope.activeRow = $rowId;
            $scope.activeID = null;
        }
    };

    $scope.submitTimes = function () {
        var start = $scope.start;
        var end = $scope.end;
        if($scope.timetableTimes.$valid) {
            $http({
                method: 'POST',
                url: '/api/timetabletimes',
                headers: {'Content-Type': 'application/json'},
                data: {start: start, end: end, rowId: $scope.activeRow}
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

mainApp.controller('editNotebookCtrl', function($scope, $http, $stateParams, $state, loggedIn){

    $http({
            method: 'POST',
            url: '/api/get_notebook',
            headers: {'Content-Type': 'application/json'},
            data: {
                id: $stateParams.id
            }
        })
            .success(function (data) {
                if(data['error'] == true){
                    $state.go('management.notebooks');
                }else {
                    $scope.name = JSON.parse(data['notebook'])['name'];
                    $scope.is_public = JSON.parse(data['notebook'])['is_public'];
                }
            })
            .error(function (data) {
                $state.go('management.notebooks');
            });


    $scope.submitEditNotebook = function() {
        var name = $scope.name;
        var is_public = $scope.is_public;
        if($scope.editNotebook.$valid) {
            $http({
                method: 'POST',
                url: '/api/notebook_edit',
                headers: {'Content-Type': 'application/json'},
                data: {
                    id: $stateParams.id,
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
    }

    $scope.cancelEdit = function() {
        $state.go('management.notebooks');
    }
});

mainApp.controller('logoutCtrl', function($scope, $http, $state){
    $scope.logout = function(){
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

mainApp.controller('profileCtrl', function($scope, $http, $stateParams){
    $http({
        method: 'POST',
        url: '/api/profile',
        data: {id: $stateParams.id}
    }).success(function(data){
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

mainApp.controller('searchCtrl', function ($scope,$http) {
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
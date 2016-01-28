"""dsn URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    #url(r'^admin/', include(admin.site.urls)),

    #Mainpage
    url(r'^api/csrf', 'dsn.views.mainpage_views.view_csrf_get', name="csrf"),
    url(r'^api/loggedInUser', 'dsn.views.mainpage_views.view_getLoggedInUser', name="loggedInUser"),
    url(r'^api/login', 'dsn.views.mainpage_views.view_login', name="login"),
    url(r'^api/logout', 'dsn.views.mainpage_views.view_logout', name="logout"),
    url(r'^api/register', 'dsn.views.mainpage_views.view_registration', name="register"),
    url(r'^api/validate_email', 'dsn.views.mainpage_views.view_validate_account', name="validateEmail"),
    url(r'^api/resetpasswordrequest', 'dsn.views.mainpage_views.view_resetpasswordrequest', name="resetpasswordrequest"),
    url(r'^api/resetpassword', 'dsn.views.mainpage_views.view_resetpassword', name="resetpassword"),
    url(r'^api/timetabletimes', 'dsn.views.management_views.view_add_times', name="add_times"),
    url(r'^api/timetable_add', 'dsn.views.management_views.view_add_timetable', name="add_timetable"),
    url(r'^api/timetable', 'dsn.views.management_views.view_get_timetable', name="get_timetable"),
    url(r'^api/admin_user_update', 'dsn.views.administration_views.view_saveUserchange', name="admin_user_update"),
    url(r'^api/admin_user', 'dsn.views.administration_views.view_users', name="admin_user"),
    url(r'^api/profile', 'dsn.views.management_views.view_getProfile', name="profile"),
    url(r'^api/otherprofile', 'dsn.views.management_views.view_getOtherProfile', name="otherprofile"),
    url(r'^api/notebooks_create', 'dsn.views.management_views.view_createNotebook', name="createNotebook"),
    url(r'^api/notebook_edit', 'dsn.views.management_views.view_editNotebook', name="editNotebook"),
    url(r'^api/notebooks_show', 'dsn.views.management_views.view_showNotebook', name="showNotebook"),
    url(r'^api/get_notebooks', 'dsn.views.management_views.view_get_notebooks', name="getNotebooks"),
    url(r'^api/get_collnotebooks', 'dsn.views.management_views.view_get_notebooks_coll', name="getCollNotebooks"),
    url(r'^api/import_site', 'dsn.views.management_views.view_import_notebook_content', name="importSite"),
    url(r'^api/get_notebook', 'dsn.views.management_views.view_get_notebook', name="getNotebook"),
    url(r'^api/add_notebook_content', 'dsn.views.management_views.view_add_notebook_content', name="addNotebookContent"),
    url(r'^api/delete_notebook_content', 'dsn.views.management_views.view_delete_notebook_content', name="delteNotebookContent"),
    url(r'^api/edit_notebook_content', 'dsn.views.management_views.view_edit_notebook_content', name="edit1NotebookContent"),
    url(r'^api/edit_notebook_collaborator', 'dsn.views.management_views.view_checkCollaborator', name="checkCollaborator"),
    url(r'^api/edit_content_position', 'dsn.views.management_views.view_edit_content_position', name="editContentPosition"),
    url(r'^api/notebook_length_edit', 'dsn.views.management_views.view_edit_notebooklength', name="editNotebookLength"),
    url(r'^api/notebook_currentsite_edit', 'dsn.views.management_views.view_edit_currentpage', name="editCurrentSite"),
    url(r'^api/delete_notebook', 'dsn.views.management_views.view_delete_notebook', name="deleteNotebook"),
    url(r'^api/delete_account', 'dsn.views.management_views.view_delete_account', name="deleteAccount"),
    url(r'^api/get_userSettings', 'dsn.views.management_views.view_getUserSettings', name="getUserSettings"),
    url(r'^api/user_edit', 'dsn.views.management_views.view_editUser', name="setUser"),
    url(r'^api/oauth/google/request', 'dsn.views.mainpage_views.view_google_oauth_request', name="googleOauthRequest"),
    url(r'^api/oauth/google/response', 'dsn.views.mainpage_views.view_google_oauth_response', name="googleOauthResponse"),
    url(r'^api/oauth/fb/request', 'dsn.views.mainpage_views.view_fb_oauth_request', name="fbOauthRequest"),
    url(r'^api/oauth/fb/response', 'dsn.views.mainpage_views.view_fb_oauth_response', name="fbOauthResponse"),
    url(r'^api/notebook/savefile', 'dsn.views.notebook_views.view_savefile', name="savefile"),
    url(r'^api/notebook/deletefile', 'dsn.views.notebook_views.view_deletefile', name="deletefile"),
    url(r'^api/notebook/getfileurl', 'dsn.views.notebook_views.view_getfileurl', name="getfileurl"),
    url(r'^api/notebook/upload', 'dsn.views.notebook_views.view_upload', name="upload"),
    url(r'^api/change_lang', 'dsn.views.mainpage_views.change_language', name="language"),
    url(r'^api/analyseOCR', 'dsn.views.notebook_views.view_analyseOCR', name="analyseOCR"),
]

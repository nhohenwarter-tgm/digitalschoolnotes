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
    url(r'^mainpage/content', 'dsn.views.mainpage_views.view_mainpage_content', name="mainpage_content"),
    url(r'^login', 'dsn.views.mainpage_views.view_login', name="login"),
    url(r'^register', 'dsn.views.mainpage_views.view_registration', name="register"),
    url(r'^resetPassword', 'dsn.views.mainpage_views.view_resetPassword', name="resetPassword"),
    url(r'^test', 'dsn.views.mainpage_views.view_test', name="test"),

    #Management
    url(r'^management/timetable', 'dsn.views.management_views.view_timetable', name="management_timetable"),
    url(r'^management/notebooks', 'dsn.views.management_views.view_notebooks', name="management_notebooks"),
    url(r'^management/settings', 'dsn.views.management_views.view_accsettings', name="management_accsettings"),

    #Administration
    url(r'^admin/usermanagement', 'dsn.views.administration_views.view_usermanagement', name="admin_usermanagement"),
    url(r'^admin/bills', 'dsn.views.administration_views.view_bills', name="admin_bills"),
    url(r'^admin/ldap', 'dsn.views.administration_views.view_ldap_configuration', name="admin_ldap"),
    url(r'^admin/quotas', 'dsn.views.administration_views.view_userquotas', name="admin_userquotas"),
    url(r'^admin/statistics', 'dsn.views.administration_views.view_statistics', name="admin_statistics"),

    #Basic
    url(r'^$', 'dsn.views.mainpage_views.view_mainpage', name="mainpage"),
    url(r'^management', 'dsn.views.management_views.view_management', name="management"),
    url(r'^notebook', 'dsn.views.notebook_views.view_notebook', name="notebook"),
    url(r'^administration', 'dsn.views.administration_views.view_administration', name="administration"),
]

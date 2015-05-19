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
    url(r'^api/login', 'dsn.views.mainpage_views.view_login', name="login"),
    url(r'^api/logout', 'dsn.views.mainpage_views.view_logout', name="logout"),
    url(r'^api/register', 'dsn.views.mainpage_views.view_registration', name="register"),
    url(r'^api/admin_user', 'dsn.views.administration_views.view_users', name="admin_user"),
    url(r'^api/profile', 'dsn.views.management_views.view_getProfile', name="profile"),
]

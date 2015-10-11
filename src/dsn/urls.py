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

    url(r'^management/timetable', 'dsn.views.management_views.timetable', name="management_timetable"),
    url(r'^management/notebooks', 'dsn.views.management_views.notebooks', name="management_notebooks"),
    url(r'^management/settings', 'dsn.views.management_views.accsettings', name="management_accsettings"),

    url(r'^$', 'dsn.views.mainpage_views.mainpage', name="mainpage"),
    url(r'^management', 'dsn.views.management_views.management', name="management"),
    url(r'^notebook', 'dsn.views.notebook_views.notebook', name="notebook"),
    url(r'^administration', 'dsn.views.administration_views.administration', name="administration"),
]

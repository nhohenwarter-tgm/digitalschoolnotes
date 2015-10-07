from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'prototype.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'prototype.views.show_food', name='show_food'),
    url(r'^insert/', 'prototype.views.insert_food', name='insert_food'),
    url(r'^(?P<foodname>[A-Za-z]+)/vote/(?P<votetype>[+-])/', 'prototype.views.vote', name='vote'),
    url(r'^(?P<foodname>[A-Za-z]+)/delete/', 'prototype.views.delete_food', name='delete_food'),
)

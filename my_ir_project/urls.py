from django.conf.urls import patterns, include, url
from django.views.decorators.csrf import csrf_exempt
from django.contrib import admin

from my_ir_project import views

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', views.home, name='home'),
    url(r'^get_cluster$', csrf_exempt(views.get_cluster), name='get_cluster'),
    url(r'^get_cluster_div$', csrf_exempt(views.get_cluster_div), name='get_cluster_div'),

    url(r'^get_result$', csrf_exempt(views.get_result), name='get_result'),
    url(r'^get_result_div$', csrf_exempt(views.get_result_div), name='get_result_div'),

    url(r'^get_title$', csrf_exempt(views.get_title), name='get_title'),
    url(r'^get_json_random$', csrf_exempt(views.get_json_random), name='get_json_random'),
    url(r'^get_json_div$', csrf_exempt(views.get_json_div), name='get_json_div'),
    
    url(r'^get_search$', views.autocompleteModel, name='get_search'),
    
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

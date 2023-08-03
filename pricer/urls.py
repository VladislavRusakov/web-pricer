from django.contrib import admin
from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.mainview, name='main'),
    path('ajax', views.ajax),
]

urlpatterns += staticfiles_urlpatterns()

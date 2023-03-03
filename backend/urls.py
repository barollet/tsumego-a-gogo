"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.shortcuts import redirect


urlpatterns = [
    # TODO set API landing page with version for example
    path('', lambda request: redirect('core/', permanent=False)),

    path('admin/', admin.site.urls), # TODO better admin interface
    path('api-auth/', include('rest_framework.urls')),

    path('core/', include('tsumego_core.urls')),
    path('user/', include('user_core.urls')),
]

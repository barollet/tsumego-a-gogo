from django.urls import include, path

from rest_framework import routers

from user_core import views


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename="user")
router.register(r'groups', views.GroupViewSet, basename="group")

urlpatterns = [
    path('', include(router.urls)),
]

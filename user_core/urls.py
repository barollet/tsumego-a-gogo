from django.urls import include, path

from rest_framework import routers

from knox import views as knox_views
from user_core import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename="user")
router.register(r'groups', views.GroupViewSet, basename="group")

urlpatterns = [
    path('', include(router.urls)),
    path(r'login/', views.LoginView.as_view(), name='knox_login'),
    path(r'logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path(r'logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]

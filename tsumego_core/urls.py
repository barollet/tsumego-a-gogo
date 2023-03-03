from django.urls import path, include

from rest_framework.routers import DefaultRouter

from tsumego_core import views

router = DefaultRouter()
router.register(r'collections', views.CollectionViewSet,basename="collection")
router.register(r'tags', views.TagViewSet,basename="tag")
router.register(r'tsumegos', views.TsumegoViewSet,basename="tsumego")


urlpatterns = [
        path('', include(router.urls)),
]

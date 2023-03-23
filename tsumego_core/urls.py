from django.urls import path, include

from rest_framework.routers import DefaultRouter

from tsumego_core import views
from tsumego_core.variation_view import VariationViewSet

router = DefaultRouter()
router.register(r'collection', views.CollectionViewSet,basename="collection")
router.register(r'tag', views.TagViewSet,basename="tag")
router.register(r'tsumego', views.TsumegoViewSet,basename="tsumego")
router.register(r'variation', VariationViewSet,basename="variation")

urlpatterns = [
        path('', include(router.urls)),
]

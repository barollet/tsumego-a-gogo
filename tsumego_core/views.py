"""This module defines the basic views for:
adding, modifying and getting a list of collection, tsumego and list

The ListCreate API View returns a list with GET and creates an element with POST.
The Detail API View is used for updating a single element.

Reference documentation: https://www.django-rest-framework.org/api-guide/generic-views/
"""
#pylint: disable=C0115
from rest_framework import viewsets
from rest_framework.decorators import action
from dynamic_rest.viewsets import DynamicModelViewSet

from django.db.models import Count

from tsumego_core.models import Collection, Tag, Tsumego
from tsumego_core.serializers import CollectionSerializer, TagSerializer, TsumegoSerializer

from tsumego_core.upload_tsumego import upload_action

class CollectionViewSet(viewsets.ModelViewSet):
    # we add the number of tsumego in each collection
    queryset = Collection.objects.all().annotate(number=Count('tsumego')).order_by('id')
    serializer_class = CollectionSerializer

    @action(detail=True, methods=['post'])
    def upload(self, request, pk=None):
        """Upload one or several tsumegos to be added to a collection"""
        return upload_action(request, pk)


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

# Maybe Tsumego will have a different behavior at some point
# TODO get list by collections
class TsumegoViewSet(DynamicModelViewSet):
    queryset = Tsumego.objects.all()
    serializer_class = TsumegoSerializer

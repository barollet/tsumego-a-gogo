"""This module defines the basic views for:
adding, modifying and getting a list of collection, tsumego and list

The ListCreate API View returns a list with GET and creates an element with POST.
The Detail API View is used for updating a single element.

Reference documentation: https://www.django-rest-framework.org/api-guide/generic-views/
"""
#pylint: disable=C0115
from rest_framework import viewsets


from tsumego_core.models import Collection, Tag, Tsumego
from tsumego_core.serializers import CollectionSerializer, TagSerializer, TsumegoSerializer


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

# Maybe Tsumego will have a different behavior at some point
# TODO get list by collections
class TsumegoViewSet(viewsets.ModelViewSet):
    queryset = Tsumego.objects.all()
    serializer_class = TsumegoSerializer

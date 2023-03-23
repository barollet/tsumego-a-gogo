"""File to handle the complex management of variation nodes"""

from rest_framework import viewsets
from rest_framework.response import Response

from tsumego_core.models import VariationNode
from tsumego_core.serializers import VariationSerializer

class VariationViewSet(viewsets.GenericViewSet):
    """
    Viewset to handle variation logic
    """
    queryset = VariationNode.objects.all()
    serializer_class = VariationSerializer
    def list(self, request):
        return Response({})


    def create(self, request):
        """Creates can also update if the variation is already present in the tree.
        This is actually the way to update."""
        print(request.data)
        a = VariationSerializer(data=request.data)
        if a.is_valid():
            print(a.validated_data)
            a.save()
        else:
            print(a.errors)
        return Response({})


    def retrieve(self, request, pk=None):
        pass

    def destroy(self, request, pk=None):
        pass

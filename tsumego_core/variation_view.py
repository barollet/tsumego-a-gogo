"""File to handle the complex management of variation nodes"""

from rest_framework import viewsets
from rest_framework.response import Response

from tsumego_core.models import VariationNode, Tsumego
from tsumego_core.serializers import VariationSerializer

class VariationViewSet(viewsets.GenericViewSet):
    """
    Viewset to handle variation logic
    """
    queryset = VariationNode.objects.all()
    serializer_class = VariationSerializer

    def create(self, request):
        """Creates can also update if the variation is already present in the tree.
        This is actually the way to update."""
        data = VariationSerializer(data=request.data)
        if not data.is_valid():
            return Response({"error": data.errors})

        data.save()
        return Response({"message": "successfully inserted variation"})


    def retrieve(self, request, pk=None):
        """Returns the variation representation for a given tsumego"""
        # TODO error management
        root_node = Tsumego.objects.get(id=pk).variations
        representation = VariationSerializer(root_node).data
        return Response(representation)


    def destroy(self, request, pk=None):
        """Deletes variation up the the first common ancestor with another branch"""
        # TODO what about validated ?

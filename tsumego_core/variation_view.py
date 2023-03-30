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
        tsumego = Tsumego.objects.get(id=pk)
        if not hasattr(tsumego, 'variations'):
            # create empty root node
            root_node = VariationNode(tsumego=tsumego)
            root_node.save()

        representation = VariationSerializer(tsumego.variations).data

        return Response(representation)


    def destroy(self, request, pk=None):
        """Deletes variation up the the first common ancestor with another branch"""
        # TODO what about validated ?
        # TODO error handling
        serializer = VariationSerializer(data={**request.data, 'tsumego': pk})
        if not serializer.is_valid():
            return Response({"error": serializer.errors})

        # find the node that we want to delete
        # get the root node
        tsumego = Tsumego.objects.get(id=pk)
        if not hasattr(tsumego, 'variations'):
            return Response({"error": "The tsumego has no variations"})
        root_node = tsumego.variations
        # we explore the variation in the tree
        descendants = root_node.get_descendants().all() # like in the serializer classe, it makes a copy
        for level, node in enumerate(serializer.validated_data['nodes'], start=1):
            tree_node = descendants.filter(level=level, move=node['move'])
            # if we cannot find the move in the tree we return an error
            if not tree_node:
                return Response({"error": "Invalid variation, cannot be found in the tree"})
        # we assign the last value of tree_node
        delete_node = tree_node[0]

        # now we delete the node and all descendants
        delete_tree = delete_node.get_descendants(include_self=True)
        with VariationNode.objects.delay_mptt_updates():
            delete_tree.delete()

        return Response({"message": "successfully delete variation"})

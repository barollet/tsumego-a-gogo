#!pylint: disable=missing-class-docstring, missing-module-docstring, too-few-public-methods
from rest_framework import serializers
from dynamic_rest.serializers import DynamicModelSerializer

from tsumego_core.models import Collection, Tag, Tsumego, VariationNode

from tsumego_core.sgf import clean_sgf_headers

# Simple Collection and Tag serializers
class CollectionSerializer(serializers.ModelSerializer):
    number = serializers.IntegerField(required=False)

    class Meta:
        model = Collection
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

# Tsumego serializer that makes some sgf verification
class TsumegoSerializer(DynamicModelSerializer):
    problem_sgf = serializers.CharField(max_length=400, required=True)
    # overide requirements for view_x and view_y as it is computed by the model
    view_x = serializers.IntegerField(required=False)
    view_y = serializers.IntegerField(required=False)

    class Meta:
        model = Tsumego
        fields = '__all__'
        # fields = ['problem_sgf', 'collection', 'number', 'tags']
        #depth = 1 # unwide collection and tag values

    def validate_problem_sgf(self, value):
        """ Clean the sgf value. """
        try:
            value = clean_sgf_headers(value)
        except Exception as exp:
            raise serializers.ValidationError(f"Error while parsing SGF file: {str(exp)}")
        return value

def deserialize_coord(num):
    """Converts an integer value n to a coordinate letter"""
    return chr(ord('a') + num)

class VariationSerializer(serializers.BaseSerializer):
    def to_internal_value(self, data):
        # (i, j) moves are (column, row)
        variation = data.get('variation')
        tsumego_id = data.get('tsumego')
        validated = data.get('validated')

        # checks on validated and tsumego
        if not isinstance(validated, bool):
            raise serializers.ValidationError({
                'validated': 'This field must be True or False.'
            })
        
        # TODO check for exception when tsumego does not exists
        tsumego = Tsumego.objects.get(id=tsumego_id)

        # Transform moves to internal representation
        transformed_variation = [
            f"{deserialize_coord(move['i'])}{deserialize_coord(move['j'])}"
            for move in variation
        ]

        internal_variation = [{
            'move': move,
            'validated': validated,
        } for move in transformed_variation]

        return {
            'tsumego': tsumego,
            'nodes': internal_variation,
        }

    def to_representation(self, instance):
        return {
            'score': instance.score,
            'player_name': instance.player_name
        }

    def create(self, validated_data):
        with VariationNode.objects.delay_mptt_updates():
            # create the root node
            root_node = VariationNode(tsumego=validated_data['tsumego'])
            root_node.save()
            # create nodes
            parent = root_node
            for node in validated_data['nodes']:
                current_node = VariationNode(
                    move=node['move'],
                    validated=node['validated'],
                    parent=parent
                )
                current_node.save()
                parent = current_node

        # return the root node
        return root_node

    def update(self, instance, validated_data):
        pass

    def save(self, **kwargs):
        # we need to find the tsumego root node
        # and sets the instance to know if we should create or update
        tsumego = self.validated_data['tsumego']
        # if the tsumego already has variations, we update the root node
        if hasattr(tsumego, 'variations'):
            self.instance = tsumego
        super().save(tsumego=tsumego, **kwargs)
    
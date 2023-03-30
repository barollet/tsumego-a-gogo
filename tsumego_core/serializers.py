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
        correct = data.get('correct')

        # checks on validated and tsumego
        if not isinstance(validated, bool):
            raise serializers.ValidationError({
                'validated': 'This field must be True or False.'
            })
        if not isinstance(correct, bool):
            raise serializers.ValidationError({
                'correct': 'This field must be True or False.'
            })

        if not variation:
            raise serializers.ValidationError({
                'variation': 'This field should not be an empty list.'
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
            'correct': correct,
        } for move in transformed_variation]

        return {
            'tsumego': tsumego,
            'nodes': internal_variation,
        }

    def to_representation(self, instance):
        descendants = instance.get_descendants().all()

        # the representation is only the root in the begining
        representation_tree = {
            'children': []
        }

        # this map allows to find parents in the representation from the node id
        id_map = dict([(instance.id, representation_tree)])

        # this is in tree order so parents will be traversed first
        for descendant in descendants:
            parent_id = descendant.parent.id
            parent_node = id_map[parent_id]

            node = {
                'move': descendant.move,
                'validated': descendant.validated,
                'correct': descendant.correct,
                'children': []
            }
            parent_node['children'].append(node)
            id_map[descendant.id] = node

        return representation_tree

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
                    correct=node['correct'],
                    parent=parent
                )
                current_node.save()
                parent = current_node

        # return the root node
        return root_node

    def update(self, instance, validated_data):
        new_branch = validated_data['nodes']
        # instance is the root node
        current_node_in_tree = instance
        still_inside_tree = True
        # we get the whole tree in one database call
        # this is a copy TODO be careful when concurrent updates ? maybe in model manager ?
        descendants = instance.get_descendants().all()

        with VariationNode.objects.delay_mptt_updates():
            # level (depth) starts at 1 because the root is already 0
            for level, new_node in enumerate(new_branch, start=1):
                # check if the move is already in the tree
                if still_inside_tree:
                    tree_node = descendants.filter(level=level, move=new_node['move'])
                    if tree_node:
                        tree_node = tree_node[0]
                        # we found the node in the tree
                        # check if we need to update the validation and correct state
                        # validated has priority over non validated
                        tree_node.validated |= new_node['validated']
                        # same goes for correct
                        tree_node.correct |= new_node['correct']

                        tree_node.save()
                        current_node_in_tree = tree_node
                        continue

                # we didn't found the node in the tree
                # add the current node as a children
                new_node_instance = VariationNode(
                    move=new_node['move'],
                    validated=new_node['validated'],
                    correct=new_node['correct'],
                    parent=current_node_in_tree
                )

                new_node_instance.save()
                current_node_in_tree = new_node_instance
                # repeat for the end of the branch
                still_inside_tree = False

            # all the variation is processed now

        # return the root node
        return instance

    def save(self, **kwargs):
        # we need to find the tsumego root node
        # and sets the instance to know if we should create or update
        tsumego = self.validated_data['tsumego']
        # if the tsumego already has variations, we update the root node
        if hasattr(tsumego, 'variations'):
            self.instance = tsumego.variations
        super().save(tsumego=tsumego, **kwargs)
    
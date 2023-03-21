#!pylint: disable=missing-class-docstring, missing-module-docstring, too-few-public-methods
from rest_framework import serializers
from dynamic_rest.serializers import DynamicModelSerializer

from tsumego_core.models import Collection, Tag, Tsumego

from tsumego_core.sgf import clean_sgf_headers

# Simple Collection and Tag serializers
class CollectionSerializer(serializers.ModelSerializer):
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

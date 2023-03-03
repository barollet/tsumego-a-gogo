#!pylint: disable=missing-class-docstring, missing-module-docstring, too-few-public-methods
from rest_framework import serializers

from tsumego_core.models import Collection, Tag, Tsumego

from tsumego_core.sgf import clean_sgf_string

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
class TsumegoSerializer(serializers.ModelSerializer):
    problem_sgf = serializers.CharField(max_length=400, required=True)
    solutions_sgf = serializers.CharField(required=True)

    class Meta:
        model = Tsumego
        fields = ['id', 'name', 'enabled']
        depth = 1 # unwide collection and tag values

    def validate_problem_sgf(self, value):
        """ Check that the blog post is about Django."""
        try:
            value = clean_sgf_string(value)
        except Exception as exp:
            raise serializers.ValidationError(f"Error while parsing SGF file: {str(exp)}")
        return value

    def validate_solutions_sgf(self, value):
        """ Same as previous function.
        # TODO do specific validation """
        self.validate_problem_sgf(value)

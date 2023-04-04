from django.contrib.auth.models import User, Group
from rest_framework import serializers
from dynamic_rest.serializers import DynamicModelSerializer

from .models import ProgressEntry

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class ProgressEntrySerializer(DynamicModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    class Meta:
        model = ProgressEntry
        #fields = '__all__'
        exclude = ('id', )
        read_only_fields = ('collection','time')
from django.contrib.auth.models import User, Group
from django.contrib.auth import login

from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer

from dynamic_rest.viewsets import DynamicModelViewSet

from knox.views import LoginView as KnoxLoginView

from .serializers import UserSerializer, GroupSerializer, ProgressEntrySerializer
from .models import ProgressEntry

# Documentation link for login
# https://james1345.github.io/django-rest-knox/auth/#global-usage-on-all-views


class LoginView(KnoxLoginView):
    """Class to override login view to allow POST login without authentification"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginView, self).post(request, format=None)



class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProgressEntryViewSet(DynamicModelViewSet):
    """API endpoint to access user progress in different collections"""
    def get_queryset(self, *args, **kwargs):
        # TODO special case for admin users to get all progress
        return ProgressEntry.objects.filter(user=self.request.user)
    serializer_class = ProgressEntrySerializer
    
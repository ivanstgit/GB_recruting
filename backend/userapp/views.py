from rest_framework import status
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from userapp.serializers import SignUpSerializer, EmailConfirmSerializer, UserSerializer
from userapp.models import CustomUser


class SignUpViewSet(
    CreateModelMixin,
    GenericViewSet,
):
    permission_classes = [AllowAny]
    serializer_class = SignUpSerializer


class EmailConfirmViewSet(
    CreateModelMixin,
    GenericViewSet,
):
    permission_classes = [AllowAny]
    serializer_class = EmailConfirmSerializer

    # def perform_create(self, serializer):
    #     pass


class SignInViewSet(
    ListModelMixin,
    GenericViewSet,
):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    pagination_class = None

    def get_queryset(self):
        return CustomUser.objects.filter(username=self.request.user.username)

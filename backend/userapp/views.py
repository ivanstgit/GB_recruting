"""
All views for registration process (/account branch)
"""

from rest_framework import status, mixins, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action

from drf_spectacular.utils import extend_schema

from userapp.serializers import SignUpSerializer, EmailConfirmSerializer, UserSerializer
from userapp.models import CustomUser
from userapp.utils import send_confirmation_mail


class SignUpViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """
    User registration.
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = SignUpSerializer


class EmailConfirmViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """
    User e-mail confirmation.
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = EmailConfirmSerializer
    queryset = CustomUser.objects.none()

    @extend_schema(
        description="Method for resending of confirmation code ",
        request=None,
        responses={
            201: None,
            400: None,
        },
    )
    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        # serializer_class=None,
    )
    def resend(self, request, version=None, pk=None):
        user = request.user
        if user.is_validated:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            send_confirmation_mail(user)
            return Response(status=status.HTTP_201_CREATED)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SignInViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    User data request
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    pagination_class = None

    def get_queryset(self):
        return CustomUser.objects.filter(username=self.request.user.username)

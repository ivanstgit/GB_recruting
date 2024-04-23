import random
from rest_framework import status
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action


from userapp.serializers import SignUpSerializer, EmailConfirmSerializer, UserSerializer
from userapp.models import CustomUser
from userapp.utils import send_confirmation_mail


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

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated],
        serializer_class=None,
    )
    def resend(self, request, version=None, pk=None):
        user = request.user
        if user.is_validated:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            send_confirmation_mail(user)
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class SignInViewSet(
    ListModelMixin,
    GenericViewSet,
):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    pagination_class = None

    def get_queryset(self):
        return CustomUser.objects.filter(username=self.request.user.username)

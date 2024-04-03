from rest_framework.permissions import (
    DjangoModelPermissionsOrAnonReadOnly,
    DjangoModelPermissions,
    IsAuthenticated,
)

from rest_framework.pagination import LimitOffsetPagination
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin


from recrutingapp.models import NewsTag, NewsPost
from recrutingapp.serializers import (
    NewsPublicListSerializer,
    NewsPublicDetailSerializer,
    NewsTagStaffSerializer,
    NewsStaffSerializer,
)
from recrutingapp.filters import NewsFilter


class NewsPagination(LimitOffsetPagination):
    default_limit = 10


class NewsPublicViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    """View for end or anonimous users"""

    queryset = NewsPost.objects.order_by("-created_at").prefetch_related("tags")
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    serializer_class = NewsPublicListSerializer
    pagination_class = NewsPagination
    filterset_class = NewsFilter

    def get_serializer_class(self):
        if self.detail:
            return NewsPublicDetailSerializer
        return NewsPublicListSerializer


class NewsTagsStaffViewSet(ModelViewSet):
    """View for staff"""

    queryset = NewsTag.objects.all()
    permission_classes = [DjangoModelPermissions]
    serializer_class = NewsTagStaffSerializer


class NewsPostStaffViewSet(ModelViewSet):
    """View for staff"""

    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    serializer_class = NewsStaffSerializer
    pagination_class = NewsPagination
    filterset_class = NewsFilter

    def get_queryset(self):
        if self.action == "list":
            return NewsPost.objects.order_by("-created_at").prefetch_related("tags")
        return NewsPost.objects.all()

    # On create reads user from context
    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(updated_by=request.user)

    def perform_update(self, serializer):
        request = serializer.context["request"]
        serializer.save(updated_by=request.user)

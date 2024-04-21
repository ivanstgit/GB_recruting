from rest_framework.permissions import (
    DjangoModelPermissionsOrAnonReadOnly,
    DjangoModelPermissions,
    IsAuthenticated,
)

from rest_framework.pagination import LimitOffsetPagination
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin


from recrutingapp.models import (
    NewsTag,
    NewsPost,
    Employee,
    EmployeeEducation,
    EmployeeExperience,
)
from recrutingapp.permissions import IsOwner
from recrutingapp.serializers import (
    EmployeeSerializerExt,
    EmployeeSerializerInt,
    EmployeeEducationSerializer,
    EmployeeExperienceSerializerExt,
    EmployeeExperienceSerializerInt,
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


class EmployeeViewSet(ModelViewSet):
    """View for employee"""

    permission_classes = [IsAuthenticated, DjangoModelPermissions, IsOwner]
    serializer_class = EmployeeSerializerExt
    pagination_class = None

    def get_queryset(self):
        return Employee.objects.filter(user=self.request.user).prefetch_related(
            "skills", "city"
        )

    def get_serializer_class(self):
        if self.detail:
            return EmployeeSerializerInt
        return EmployeeSerializerExt

    # On create reads user from context
    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(owner=request.user)


class EmployeeExperienceViewSet(ModelViewSet):
    """View for employee experience"""

    permission_classes = [IsAuthenticated, DjangoModelPermissions, IsOwner]
    serializer_class = EmployeeExperienceSerializerExt
    pagination_class = None

    def get_queryset(self):
        return EmployeeExperience.objects.filter(
            owner=self.request.user
        ).prefetch_related("city")

    def get_serializer_class(self):
        if self.detail:
            return EmployeeExperienceSerializerInt
        return EmployeeExperienceSerializerExt

    # On create reads user from context
    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(owner=request.user)


class EmployeeEducationViewSet(ModelViewSet):
    """View for employee education"""

    permission_classes = [IsAuthenticated, DjangoModelPermissions, IsOwner]
    serializer_class = EmployeeEducationSerializer
    pagination_class = None

    def get_queryset(self):
        return EmployeeEducation.objects.filter(
            owner=self.request.user
        ).prefetch_related("city")

    def get_serializer_class(self):
        return EmployeeEducationSerializer

    # On create reads user from context
    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(owner=request.user)

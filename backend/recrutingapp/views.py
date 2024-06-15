from rest_framework import permissions
from rest_framework import pagination
from rest_framework import viewsets
from rest_framework import mixins
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from django.db.models import Exists, OuterRef, Q
from django.contrib.contenttypes.models import ContentType
from recrutingapp.models import (
    CVResponse,
    City,
    ConstDocumentStatus,
    DocumentStatus,
    Employer,
    Favorite,
    Gender,
    NewsTag,
    NewsPost,
    Employee,
    CV,
    Vacancy,
    VacancyResponse,
)
from recrutingapp.permissions import (
    CVPermission,
    CVResponsePermission,
    EmployerPermission,
    IsOwner,
    VacancyPermission,
    VacancyResponsePermission,
)
from recrutingapp.serializers import (
    CVResponseSerializerExt,
    CVResponseSerializerInt,
    CitySerializer,
    DocumentStatusMixinSerializer,
    EmployeeSerializerExt,
    EmployeeSerializerInt,
    CVSerializerInt,
    CVSerializerExt,
    EmployerSerializerExt,
    EmployerSerializerInt,
    GenderSerializer,
    NewsPublicListSerializer,
    NewsPublicDetailSerializer,
    NewsTagStaffSerializer,
    NewsStaffSerializer,
    VacancyResponseSerializerExt,
    VacancyResponseSerializerInt,
    VacancySerializerExt,
    VacancySerializerInt,
)
from recrutingapp.filters import NewsFilter, CVFilter, VacancyFilter
from userapp.models import UserRoles

REQUEST_METHODS_CHANGE = ("POST", "PUT", "PATCH")


class LoggedModelMixin:
    """
    Mixin for logging object changes.
    Sets updated_by field from request user
    """

    def perform_update(self, serializer):
        request = serializer.context["request"]
        serializer.save(updated_by=request.user)


class OwnedModelMixin:
    """
    Mixin for owned objects.
    Sets creator as owner from request user
    """

    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(owner=request.user, updated_by=request.user)


class DocStatusModelMixin:
    """
    Mixin for objects with status.
    Provide method for status handling
    """

    @action(detail=True, methods=["patch"])
    def status(self, request, version=None, pk=None):
        obj = self.get_object()
        serializer = DocumentStatusMixinSerializer(data=request.data)
        if serializer.is_valid():
            new_status = serializer.validated_data["status"]
            new_status_info = serializer.validated_data["info"]
            if obj and (
                new_status == ConstDocumentStatus.draft
                or (
                    obj.status.id
                    in (ConstDocumentStatus.draft, ConstDocumentStatus.rejected)
                    and new_status == ConstDocumentStatus.pending
                )
                or (
                    obj.status.id == ConstDocumentStatus.pending
                    and obj.owner != request.user
                    and new_status
                    in (ConstDocumentStatus.approved, ConstDocumentStatus.rejected)
                )
            ):
                status_obj = DocumentStatus.objects.get(id=new_status)
                obj.status = status_obj
                obj.status_info = new_status_info
                obj.save()
                return Response({"status": new_status})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class FavoriteMixin:
    """
    Mixin for objects could be added to/removed from favorites.
    Provide methods for favorites handling
    """

    @action(
        detail=True,
        methods=["post", "delete"],
        url_path="favorite",
        permission_classes=[
            permissions.IsAuthenticated,
        ],
    )
    def favorite(self, request, version=None, pk=None):
        """
        Add to/ remove from favorites
        """
        instance = self.get_object()
        content_type = ContentType.objects.get_for_model(instance)

        if request.method == "POST":
            favorite_obj, created = Favorite.objects.get_or_create(
                user=request.user, content_type=content_type, object_id=instance.id
            )
            return Response(status=status.HTTP_201_CREATED)
        elif request.method == "DELETE":
            favorite_obj = Favorite.objects.get(
                user=request.user, content_type=content_type, object_id=instance.id
            )
            if favorite_obj:
                favorite_obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    def annotate_qs_is_favorite_field(self, queryset):
        """
        Internal method providing is_favorite attribute to queryset
        """
        if self.request.user.is_authenticated:
            is_favorite_subquery = Favorite.objects.filter(
                object_id=OuterRef("pk"),
                user=self.request.user,
                content_type=ContentType.objects.get_for_model(queryset.model),
            )
            queryset = queryset.annotate(is_favorite=Exists(is_favorite_subquery))
        return queryset

    @action(
        detail=False,
        methods=["get"],
        url_path="favorites",
        permission_classes=[
            permissions.IsAuthenticated,
        ],
    )
    def favorites(self, request, version=None):
        """
        List of objects in favorites
        """
        queryset = self.get_queryset().filter(is_favorite=True)
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NewsPagination(pagination.LimitOffsetPagination):
    default_limit = 10


class NewsPublicViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """View for end or anonimous users"""

    queryset = NewsPost.objects.order_by("-created_at").prefetch_related("tags")
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
    serializer_class = NewsPublicListSerializer
    pagination_class = NewsPagination
    filterset_class = NewsFilter

    def get_serializer_class(self):
        if self.detail:
            return NewsPublicDetailSerializer
        return NewsPublicListSerializer


class NewsTagsStaffViewSet(viewsets.ModelViewSet):
    """View for staff"""

    queryset = NewsTag.objects.all()
    permission_classes = [permissions.DjangoModelPermissions]
    serializer_class = NewsTagStaffSerializer


class NewsPostStaffViewSet(viewsets.ModelViewSet):
    """View for staff"""

    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissions,
    ]
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


class GenderViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = GenderSerializer
    pagination_class = None

    queryset = Gender.objects.all()


class CityViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = CitySerializer
    pagination_class = None

    queryset = City.objects.all()


class EmployeeProtectedViewSet(
    OwnedModelMixin, LoggedModelMixin, viewsets.ModelViewSet
):
    """View for employee"""

    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissions,
        IsOwner,
    ]
    serializer_class = EmployeeSerializerExt
    pagination_class = None

    def get_queryset(self):
        return Employee.objects.filter(owner=self.request.user).prefetch_related(
            "skills", "city"
        )

    def get_serializer_class(self):
        if self.request.method in REQUEST_METHODS_CHANGE:
            return EmployeeSerializerInt
        return EmployeeSerializerExt


class EmployerPagination(pagination.LimitOffsetPagination):
    default_limit = 10


class EmployerPublicViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """View for end or anonimous users"""

    queryset = (
        Employer.objects.filter(status=ConstDocumentStatus.approved)
        .order_by("updated_at")
        .prefetch_related("city")
    )
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
    serializer_class = EmployerSerializerExt
    pagination_class = EmployerPagination


class EmployerProtectedViewSet(
    OwnedModelMixin,
    LoggedModelMixin,
    DocStatusModelMixin,
    FavoriteMixin,
    viewsets.ModelViewSet,
):
    """View for employer (Company card)"""

    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissions,
        EmployerPermission,
    ]
    serializer_class = EmployerSerializerExt
    pagination_class = EmployerPagination

    def get_queryset(self):
        role = self.request.user.role

        if self.request.user.is_superuser:
            qs = Employer.objects.all()

        # employer -> owned or published
        elif role == UserRoles.employer.value:
            qs = Employer.objects.filter(owner=self.request.user)

        # moderator -> on moderation
        elif role == UserRoles.moderator.value:
            qs = Employer.objects.filter(status=ConstDocumentStatus.pending)

        else:
            qs = Employer.objects.filter(status=ConstDocumentStatus.approved)

        return (
            self.annotate_qs_is_favorite_field(qs)
            .order_by("updated_at")
            .prefetch_related("city")
        )

    def get_serializer_class(self):
        if self.request.method in REQUEST_METHODS_CHANGE:
            return EmployerSerializerInt
        return EmployerSerializerExt


class CVPagination(pagination.LimitOffsetPagination):
    default_limit = 10


class CVViewSet(
    OwnedModelMixin,
    LoggedModelMixin,
    DocStatusModelMixin,
    FavoriteMixin,
    viewsets.ModelViewSet,
):
    """View for CV"""

    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissions,
        CVPermission,
    ]
    serializer_class = CVSerializerExt
    pagination_class = CVPagination

    filterset_class = CVFilter

    def get_queryset(self):
        role = self.request.user.role

        if self.request.user.is_superuser:
            qs = CV.objects.all()

        # employee -> own
        elif role == UserRoles.employee.value:
            qs = CV.objects.filter(owner=self.request.user)

        # moderator -> on moderation
        elif role == UserRoles.moderator.value:
            qs = CV.objects.filter(status=ConstDocumentStatus.pending)

        else:
            qs = CV.objects.filter(status=ConstDocumentStatus.approved)

        return (
            self.annotate_qs_is_favorite_field(qs)
            .order_by("updated_at")
            .prefetch_related("employee", "experience", "education")
        )

    def get_serializer_class(self):
        if self.request.method in REQUEST_METHODS_CHANGE:
            return CVSerializerInt
        return CVSerializerExt

    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(
            owner=request.user, updated_by=request.user, employee=request.user.employee
        )


class VacancyPagination(pagination.LimitOffsetPagination):
    default_limit = 10


class VacancyViewSet(
    OwnedModelMixin,
    LoggedModelMixin,
    DocStatusModelMixin,
    FavoriteMixin,
    viewsets.ModelViewSet,
):
    """View for Vacancies"""

    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissions,
        VacancyPermission,
    ]
    serializer_class = VacancySerializerExt
    pagination_class = VacancyPagination

    filterset_class = VacancyFilter

    def get_queryset(self):
        role = self.request.user.role

        if self.request.user.is_superuser:
            qs = Vacancy.objects.all().prefetch_related

        # employer -> own
        elif role == UserRoles.employer.value:
            qs = Vacancy.objects.filter(owner=self.request.user)

        # moderator -> on moderation
        elif role == UserRoles.moderator.value:
            qs = Vacancy.objects.filter(status=ConstDocumentStatus.pending)

        else:
            qs = Vacancy.objects.filter(status=ConstDocumentStatus.approved)

        return (
            self.annotate_qs_is_favorite_field(qs)
            .prefetch_related("employer", "city")
            .order_by("updated_at")
        )

    def get_serializer_class(self):
        if self.request.method in REQUEST_METHODS_CHANGE:
            return VacancySerializerInt
        return VacancySerializerExt

    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(
            owner=request.user, updated_by=request.user, employer=request.user.employer
        )


class CVResponseViewSet(
    OwnedModelMixin, LoggedModelMixin, DocStatusModelMixin, viewsets.ModelViewSet
):
    """View for CV response"""

    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissions,
        CVResponsePermission,
    ]
    serializer_class = CVResponseSerializerExt
    pagination_class = None

    def get_queryset(self):
        role = self.request.user.role

        if self.request.user.is_superuser:
            qs = CVResponse.objects.all()

        # employer -> own vacancy
        elif role == UserRoles.employer.value:
            qs = CVResponse.objects.filter(owner=self.request.user)

        # employee -> own CV
        elif role == UserRoles.employee.value:
            qs = CVResponse.objects.filter(cv__owner=self.request.user)

        else:
            qs = CVResponse.objects.none()

        return qs.prefetch_related("cv", "vacancy").order_by("updated_at")

    def get_serializer_class(self):
        if self.request.method in REQUEST_METHODS_CHANGE:
            return CVResponseSerializerInt
        return CVResponseSerializerExt


class VacancyResponseViewSet(
    OwnedModelMixin, LoggedModelMixin, DocStatusModelMixin, viewsets.ModelViewSet
):
    """View for Vacancy response"""

    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissions,
        VacancyResponsePermission,
    ]
    serializer_class = VacancyResponseSerializerExt
    pagination_class = None

    def get_queryset(self):
        role = self.request.user.role

        if self.request.user.is_superuser:
            qs = VacancyResponse.objects.all()

        # employer -> own vacancy
        elif role == UserRoles.employer.value:
            qs = VacancyResponse.objects.filter(vacancy_owner=self.request.user)

        # employee -> own CV
        elif role == UserRoles.employee.value:
            qs = VacancyResponse.objects.filter(owner=self.request.user)

        else:
            qs = VacancyResponse.objects.none()

        return qs.prefetch_related("cv", "vacancy").order_by("updated_at")

    def get_serializer_class(self):
        if self.request.method in REQUEST_METHODS_CHANGE:
            return VacancyResponseSerializerInt
        return VacancyResponseSerializerExt

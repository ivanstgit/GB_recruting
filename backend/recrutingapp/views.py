from rest_framework import permissions
from rest_framework import pagination
from rest_framework import viewsets
from rest_framework import mixins
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response


from recrutingapp.models import (
    City,
    ConstDocumentStatus,
    DocumentStatus,
    Gender,
    NewsTag,
    NewsPost,
    Employee,
    CV,
)
from recrutingapp.permissions import CVPermission, IsOwner
from recrutingapp.serializers import (
    CitySerializer,
    DocumentStatusMixinSerializer,
    EmployeeSerializerExt,
    EmployeeSerializerInt,
    CVSerializerInt,
    CVSerializerExt,
    GenderSerializer,
    NewsPublicListSerializer,
    NewsPublicDetailSerializer,
    NewsTagStaffSerializer,
    NewsStaffSerializer,
)
from recrutingapp.filters import NewsFilter, CVFilter
from userapp.models import UserRoles

REQUEST_METHODS_CHANGE = ("POST", "PUT", "PATCH")


class LoggedModelMixin:
    def perform_update(self, serializer):
        request = serializer.context["request"]
        serializer.save(updated_by=request.user)


class OwnedModelMixin:
    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(owner=request.user, updated_by=request.user)


class DocStatusModelMixin:
    @action(detail=True, methods=["patch"])
    def status(self, request, version=None, pk=None):
        cv = self.get_object()
        serializer = DocumentStatusMixinSerializer(data=request.data)
        if serializer.is_valid():
            new_status = serializer.validated_data["status"]
            new_status_info = serializer.validated_data["info"]
            if cv and (
                (
                    cv.status.id
                    in (ConstDocumentStatus.draft, ConstDocumentStatus.rejected)
                    and new_status == ConstDocumentStatus.pending
                )
                or (
                    cv.status.id == ConstDocumentStatus.pending
                    and new_status
                    in (ConstDocumentStatus.approved, ConstDocumentStatus.rejected)
                )
            ):
                status_obj = DocumentStatus.objects.get(id=new_status)
                cv.status = status_obj
                cv.status_info = new_status_info
                cv.save()
                return Response({"status": new_status})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


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


class EmployeeProfileViewSet(OwnedModelMixin, LoggedModelMixin, viewsets.ModelViewSet):
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


class CVPagination(pagination.LimitOffsetPagination):
    default_limit = 10


class CVViewSet(
    OwnedModelMixin, LoggedModelMixin, DocStatusModelMixin, viewsets.ModelViewSet
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

        if self.request.user.is_superuser:
            return CV.objects.all().prefetch_related(
                "employee", "experience", "education"
            )

        role = self.request.user.role

        # employee -> own
        if role == UserRoles.employee.value:
            return CV.objects.filter(owner=self.request.user).prefetch_related(
                "experience", "education"
            )

        # moderator -> on moderation
        elif role == UserRoles.moderator.value:
            return (
                CV.objects.filter(status=ConstDocumentStatus.pending)
                .order_by("updated_at")
                .prefetch_related("experience", "education")
            )

        return CV.objects.filter(status=ConstDocumentStatus.approved).prefetch_related(
            "experience", "education"
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

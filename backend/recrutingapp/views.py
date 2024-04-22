from rest_framework import permissions
from rest_framework import pagination
from rest_framework import viewsets
from rest_framework import mixins


from recrutingapp.models import (
    NewsTag,
    NewsPost,
    Employee,
    CV,
)
from recrutingapp.permissions import CVPermission, IsOwner
from recrutingapp.serializers import (
    EmployeeSerializerExt,
    EmployeeSerializerInt,
    CVSerializerInt,
    CVSerializerExt,
    NewsPublicListSerializer,
    NewsPublicDetailSerializer,
    NewsTagStaffSerializer,
    NewsStaffSerializer,
)
from recrutingapp.filters import NewsFilter

REQUEST_METHODS_CHANGE = ("POST", "PUT", "PATCH")


class LoggedModelMixin:
    def perform_update(self, serializer):
        request = serializer.context["request"]
        serializer.save(updated_by=request.user)


class OwnedModelMixin:
    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(owner=request.user, updated_by=request.user)


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


class EmployeeCVViewSet(OwnedModelMixin, LoggedModelMixin, viewsets.ModelViewSet):
    """View for employee experience"""

    permission_classes = [
        permissions.IsAuthenticated,
        permissions.DjangoModelPermissions,
        CVPermission,
    ]
    serializer_class = CVSerializerExt
    pagination_class = None

    def get_queryset(self):
        return CV.objects.filter(owner=self.request.user).prefetch_related(
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


# from rest_framework import status, viewsets
# from rest_framework.decorators import action
# from rest_framework.response import Response
#     @action(detail=True, methods=['patch'])
#     def to_moderation(self, request, pk=None):
#         cv = self.get_object()
#         if cv.status in (ConstDocumentStatus.draft, ConstDocumentStatus.rejected):
#             cv.status = ConstDocumentStatus.pending
#             cv.save()
#             return Response({'status': 'password set'})
#         else:
#             return Response(serializer.errors,
#                             status=status.HTTP_400_BAD_REQUEST)

from rest_framework import permissions

from recrutingapp.models import CV, ConstDocumentStatus
from userapp.models import UserRoles


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `user`.
        return obj.owner == request.user


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        return obj.owner == request.user


class CVPermission(permissions.BasePermission):
    """
    Grants permission based on role, status
    """

    def has_object_permission(self, request, view, obj: CV):
        role = request.user.role

        if request.user.is_superuser:
            return True

        # employee has full permissions except changing data in pending status
        if role == UserRoles.employee.value and obj.owner == request.user:
            if request.method in permissions.SAFE_METHODS or obj.status.id in (
                ConstDocumentStatus.draft,
                ConstDocumentStatus.rejected,
            ):
                return True

        # moderator has read permissions on all documents, and write permissions on moderated documents
        elif role == UserRoles.moderator.value:
            if request.method in permissions.SAFE_METHODS or (
                obj and obj.status == ConstDocumentStatus.pending
            ):
                return True

        # employers can view all approved resume
        elif role == UserRoles.employer.value:
            if request.method in permissions.SAFE_METHODS and (
                obj and obj.status == ConstDocumentStatus.approved
            ):
                return True

        return False

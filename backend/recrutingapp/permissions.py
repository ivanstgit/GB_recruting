from rest_framework import permissions

from recrutingapp.models import (
    CV,
    CVResponse,
    ConstDocumentStatus,
    Employer,
    Vacancy,
    VacancyResponse,
)
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

        # moderator has read permissions on all documents, and write status permissions on moderated documents
        elif role == UserRoles.moderator.value:
            if request.method in permissions.SAFE_METHODS or (
                obj
                and obj.status.id == ConstDocumentStatus.pending
                and view.action == "status"
            ):
                return True

        # employers can view all approved resume
        elif role == UserRoles.employer.value:
            if request.method in permissions.SAFE_METHODS and (
                obj and obj.status.id == ConstDocumentStatus.approved
            ):
                return True

        return False


class EmployerPermission(permissions.BasePermission):
    """
    Grants permission based on role, status
    """

    def has_object_permission(self, request, view, obj: Employer):
        role = request.user.role

        if request.user.is_superuser:
            return True

        # employer has full permissions on status change and restricted permissions on data change
        if role == UserRoles.employer.value and obj.owner == request.user:
            if (
                request.method in permissions.SAFE_METHODS
                or obj.status.id
                in (
                    ConstDocumentStatus.draft,
                    ConstDocumentStatus.rejected,
                )
                or (view.action == "status")
            ):
                return True

        # moderator has read permissions on all documents, and write status permissions on moderated documents
        elif role == UserRoles.moderator.value:
            if request.method in permissions.SAFE_METHODS or (
                obj
                and obj.status.id == ConstDocumentStatus.pending
                and view.action == "status"
            ):
                return True

        # all users can view all approved companies
        else:
            if request.method in permissions.SAFE_METHODS and (
                obj and obj.status.id == ConstDocumentStatus.approved
            ):
                return True

        return False


class VacancyPermission(permissions.BasePermission):
    """
    Grants permission based on role, status
    """

    def has_object_permission(self, request, view, obj: Vacancy):
        role = request.user.role

        if request.user.is_superuser:
            return True

        # employer has full permissions except changing data in pending status
        if role == UserRoles.employer.value and obj.owner == request.user:
            if request.method in permissions.SAFE_METHODS or obj.status.id in (
                ConstDocumentStatus.draft,
                ConstDocumentStatus.rejected,
            ):
                return True

        # moderator has read permissions on all documents, and write status permissions on moderated documents
        elif role == UserRoles.moderator.value:
            if request.method in permissions.SAFE_METHODS or (
                obj
                and obj.status.id == ConstDocumentStatus.pending
                and view.action == "status"
            ):
                return True

        # employees can view all approved vacancies
        elif role == UserRoles.employee.value:
            if request.method in permissions.SAFE_METHODS and (
                obj and obj.status.id == ConstDocumentStatus.approved
            ):
                return True

        return False


class CVResponsePermission(permissions.BasePermission):
    """
    Grants permission based on role, status
    """

    def has_object_permission(self, request, view, obj: CVResponse):
        role = request.user.role

        if request.user.is_superuser:
            return True

        # employer has full permissions on own job offers
        if role == UserRoles.employer.value and obj.owner == request.user:
            return True

        # employees can view only response on their CV, not draft and change status while pending
        elif role == UserRoles.employee.value:
            if (
                obj
                and obj.cv.owner == request.user
                and obj.status.id != ConstDocumentStatus.draft
            ) and (
                request.method in permissions.SAFE_METHODS
                or (
                    obj
                    and obj.status.id == ConstDocumentStatus.pending
                    and view.action == "status"
                )
                or (
                    obj
                    and obj.status.id == ConstDocumentStatus.approved
                    and view.action == "messages"
                )
            ):
                return True

        return False


class VacancyResponsePermission(permissions.BasePermission):
    """
    Grants permission based on role, status
    """

    def has_object_permission(self, request, view, obj: VacancyResponse):
        role = request.user.role

        if request.user.is_superuser:
            return True

        # employee has full permissions on own job requests
        if role == UserRoles.employee.value and obj.owner == request.user:
            return True

        # employers can view only not draft response on their Vacancies and change status while pending
        elif role == UserRoles.employer.value:
            if (
                obj
                and obj.vacancy.owner == request.user
                and obj.status.id != ConstDocumentStatus.draft
            ) and (
                request.method in permissions.SAFE_METHODS
                or (
                    obj
                    and obj.status.id == ConstDocumentStatus.pending
                    and view.action == "status"
                )
                or (
                    obj
                    and obj.status.id == ConstDocumentStatus.approved
                    and view.action == "messages"
                )
            ):
                return True

        return False

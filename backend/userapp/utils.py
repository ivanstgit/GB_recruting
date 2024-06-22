from enum import Enum

from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.contrib.auth.models import Group, Permission

from userapp.models import CustomUser, UserRoles


def send_confirmation_mail(user):
    try:
        send_mail(
            "E-mail confirmation",
            "Your confirmation code is " + user.validation_code,
            "noreply@example.com",
            [user.email],
            fail_silently=True,
        )
    finally:
        pass


class UserGroups(Enum):
    employers = "employers"
    employees = "employees"
    moderators = "moderators"


class UserGroupUtils:

    ROLE_GROUPS = {
        UserRoles.employer.value: [UserGroups.employers.value],
        UserRoles.employee.value: [UserGroups.employees.value],
        UserRoles.moderator.value: [UserGroups.moderators.value],
    }

    GROUP_PERMISSIONS = {
        UserGroups.employers.value: [
            "view_employer",
            "add_employer",
            "change_employer",
            "view_vacancy",
            "add_vacancy",
            "change_vacancy",
            "delete_vacancy",
            "view_vacancyresponse",
            "change_vacancyresponse",
            "view_cv",
            "view_cvresponse",
            "add_cvresponse",
            "change_cvresponse",
            "delete_cvresponse",
        ],
        UserGroups.employees.value: [
            "view_employee",
            "add_employee",
            "change_employee",
            "delete_employee",
            "view_cv",
            "add_cv",
            "change_cv",
            "delete_cv",
            "view_cvresponse",
            "change_cvresponse",
            "view_vacancy",
            "view_vacancyresponse",
            "add_vacancyresponse",
            "change_vacancyresponse",
            "delete_vacancyresponse",
        ],
        UserGroups.moderators.value: [
            "view_customuser",
            "view_newspost",
            "add_newspost",
            "change_newspost",
            "delete_newspost",
            "view_newstag",
            "add_newstag",
            "change_newstag",
            "delete_newstag",
            "view_cv",
            "change_cv",
            "view_employer",
            "change_employer",
            "view_vacancy",
            "change_vacancy",
        ],
    }

    @staticmethod
    def get_groups_for_role(role) -> list:

        res = []
        groups = UserGroupUtils.ROLE_GROUPS.get(role)
        for group_name in groups:
            try:
                group = Group.objects.get(name=group_name)
                if group:
                    res.append(group)
            except Group.DoesNotExist:
                pass
        return res

    @staticmethod
    def create_user_groups():
        res = []
        for group, permissions in UserGroupUtils.GROUP_PERMISSIONS.items():
            g, _ = Group.objects.get_or_create(name=group)

            for perm in permissions:
                p = Permission.objects.get(codename=perm)
                if p:
                    g.permissions.add(p)
                else:
                    raise ValueError(f"for group {group} permission {perm} not found")
            g.save()
            res.append(g)
        return res

    @staticmethod
    def delete_user_groups():
        res = []
        for group in UserGroupUtils.GROUP_PERMISSIONS.keys():
            g = Group.objects.get(name=group)
            if g:
                g.delete()
                res.append(group)
        return res


class UserUtils:
    test_employer = {
        "username": "testEmployer",
        "password": "password",
        "first_name": "test",
        "last_name": "Employer",
        "email": "testEmployer@ru.ru",
        "is_superuser": False,
        "is_staff": False,
        "is_validated": True,
        "role": UserRoles.employer.value,
    }
    test_employer2 = {
        "username": "testEmployer2",
        "password": "password",
        "first_name": "test",
        "last_name": "Employer",
        "email": "testEmployer2@ru.ru",
        "is_superuser": False,
        "is_staff": False,
        "is_validated": True,
        "role": UserRoles.employer.value,
    }
    test_employer3 = {
        "username": "testEmployer3",
        "password": "password",
        "first_name": "test",
        "last_name": "Employer",
        "email": "testEmployer3@ru.ru",
        "is_superuser": False,
        "is_staff": False,
        "is_validated": True,
        "role": UserRoles.employer.value,
    }
    test_employer4 = {
        "username": "testEmployer4",
        "password": "password",
        "first_name": "test",
        "last_name": "Employer",
        "email": "testEmployer4@ru.ru",
        "is_superuser": False,
        "is_staff": False,
        "is_validated": True,
        "role": UserRoles.employer.value,
    }
    test_employee = {
        "username": "testEmployee",
        "password": "password",
        "first_name": "test",
        "last_name": "Employee",
        "email": "testEmployee@ru.ru",
        "is_superuser": False,
        "is_staff": False,
        "is_validated": True,
        "role": UserRoles.employee.value,
    }

    test_moderator = {
        "username": "testModerator",
        "password": "password",
        "first_name": "test",
        "last_name": "Moderator",
        "email": "testModerator@ru.ru",
        "is_superuser": False,
        "is_staff": True,
        "is_validated": True,
        "role": UserRoles.moderator.value,
    }

    @staticmethod
    def create_test_user(user_dict: dict, raise_if_exists=True) -> CustomUser:
        uname = user_dict.get("username")

        is_exists = False
        is_created = False
        try:
            user = CustomUser.objects.get_by_natural_key(uname)
            if user:
                is_exists = True
                user.set_password(user_dict.get("password"))
        except ObjectDoesNotExist:
            user = CustomUser.objects.create_user(
                username=uname,
                email=user_dict.get("email"),
                password=user_dict.get("password"),
            )
            is_created = True
        if is_exists and raise_if_exists:
            raise ValueError("already exists")

        user.first_name = user_dict.get("first_name")
        user.last_name = user_dict.get("last_name")
        user.is_superuser = user_dict.get("is_superuser", False)
        user.is_staff = user_dict.get("is_staff", False)
        user.is_validated = user_dict.get("is_validated", False)
        user.role = user_dict.get("role")
        user.save()

        groups = UserGroupUtils.get_groups_for_role(user.role)
        for group in groups:
            user.groups.add(group)
        user.save()
        return user, is_created

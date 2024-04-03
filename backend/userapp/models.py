from enum import Enum
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserGroups(Enum):
    employers = "employers"
    employees = "employees"
    moderators = "moderators"


class UserRoles(Enum):
    employer = "employer"
    employee = "employee"
    moderator = "moderator"


ROLE_GROUPS = {
    UserRoles.employer.value: [UserGroups.employers.value],
    UserRoles.employee.value: [UserGroups.employees.value],
    UserRoles.moderator.value: [UserGroups.moderators.value],
}


GROUP_PERMISSIONS = {
    UserGroups.employers.value: [],
    UserGroups.employees.value: [],
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
    ],
}


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username_validator = ASCIIUsernameValidator()

    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    email = models.CharField(
        _("email address"),
        max_length=256,
        unique=True,
        error_messages={
            "unique": _("A user with that email address already exists."),
        },
    )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    role = models.CharField(
        _("end user role"),
        max_length=50,
        default="",
        help_text=_("End user role"),
        choices=[(r.value, r.name) for r in UserRoles],
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. \
            Unselect this instead of deleting accounts."
        ),
    )
    is_validated = models.BooleanField(
        _("validated"),
        default=False,
        help_text=_("Designates whether this user has validated his account"),
    )
    validation_code = models.CharField(
        _("validation code"),
        max_length=100,
        default="",
        help_text=_("Code for validation"),
    )
    date_created = models.DateTimeField(_("date of user creation"), auto_now_add=True)

    objects = UserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = "%s %s" % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

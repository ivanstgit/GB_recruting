# create or delete must be set
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

from userapp.models import UserRoles, GROUP_PERMISSIONS

MODES = ["create", "delete"]

TEST_USERS = [
    {
        "username": "testEmployer",
        "password": "password",
        "first_name": "test",
        "last_name": "Employer",
        "email": "testEmployer@ru.ru",
        "is_superuser": False,
        "is_staff": False,
        "is_validated": True,
        "role": UserRoles.employer.value,
        "groups": GROUP_PERMISSIONS.get(UserRoles.employer.value),
    },
    {
        "username": "testEmployee",
        "password": "password",
        "first_name": "test",
        "last_name": "Employee",
        "email": "testEmployee@ru.ru",
        "is_superuser": False,
        "is_staff": False,
        "is_validated": True,
        "role": UserRoles.employee.value,
        "groups": GROUP_PERMISSIONS.get(UserRoles.employee.value),
    },
    {
        "username": "testModerator",
        "password": "password",
        "first_name": "test",
        "last_name": "Moderator",
        "email": "testModerator@ru.ru",
        "is_superuser": False,
        "is_staff": False,
        "is_validated": True,
        "role": UserRoles.moderator.value,
        "groups": GROUP_PERMISSIONS.get(UserRoles.moderator.value),
    },
]


class Command(BaseCommand):
    help = (
        "This command using for creating (default) and deleting (-m delete) test_users"
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--password",
            dest="pwd",
            help="Delete poll instead of closing it",
        )
        parser.add_argument(
            "-m",
            "--mode",
            choices=MODES,
            default=MODES[0],
            dest="mode",
            help="Delete poll instead of closing it",
        )

    def handle(self, *args, **options):
        user_model = get_user_model()

        # create
        if options.get("mode") == MODES[0]:
            for tuser in TEST_USERS:
                uname = tuser.get("username")
                try:
                    user = user_model.objects.get_by_natural_key(uname)
                    self.stdout.write(
                        self.style.WARNING(f"User {uname} already exists, skipped")
                    )
                except user_model.DoesNotExist:
                    # user_model.objects.create_superuser #наверно, тут есть специфика, не стал делать

                    password = options.get("pwd")
                    if not password:
                        password = tuser.get("password")
                    user = user_model.objects.create_user(
                        username=uname,
                        email=tuser.get("email"),
                        password=tuser.get("password"),
                    )
                    user.first_name = tuser.get("first_name")
                    user.last_name = tuser.get("last_name")
                    user.is_superuser = tuser.get("is_superuser")
                    user.is_staff = tuser.get("is_staff")
                    user.save()

                    self.stdout.write(
                        self.style.SUCCESS(f"User {uname} created succsessfully")
                    )

                groups = tuser.get("groups")
                if groups and user:
                    for group_name in groups:
                        group = Group.objects.get(name=group_name)
                        user.groups.add(group)
                        user.save()
                        self.stdout.write(
                            self.style.SUCCESS(f"Group {group_name} added for {uname}")
                        )

        elif options.get("mode") == MODES[1]:
            for tuser in TEST_USERS:
                uname = tuser.get("username")
                try:
                    user = user_model.objects.get_by_natural_key(
                        uname,
                    )
                    user.delete()
                    self.stdout.write(
                        self.style.SUCCESS(f"User {uname} deleted succsessfully")
                    )
                except user_model.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(f"User {uname} doesn't exists, skipped")
                    )

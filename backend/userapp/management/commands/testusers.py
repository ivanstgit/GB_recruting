"""
testusers are used for sample data
"""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from userapp.utils import UserUtils

MODES = ["create", "delete"]

TEST_USERS = [
    UserUtils.test_employee,
    UserUtils.test_employer,
    UserUtils.test_moderator,
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
                user, is_created = UserUtils.create_test_user(
                    tuser, raise_if_exists=False
                )
                if is_created:
                    self.style.SUCCESS(f"User {user} added")
                else:
                    self.style.WARNING(f"User {user} already exists")

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

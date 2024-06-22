"""
User groups automatic creation.
"""

from django.core.management.base import BaseCommand

from userapp.utils import UserGroupUtils

MODES = ["create", "delete"]


class Command(BaseCommand):
    help = (
        "This command using for creating (default) and deleting (-m delete) user groups"
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "-m",
            "--mode",
            choices=MODES,
            default=MODES[0],
            dest="mode",
            help="Delete poll instead of closing it",
        )

    def handle(self, *args, **options):
        # create
        if options.get("mode") == MODES[0]:
            try:
                groups = UserGroupUtils.create_user_groups()
                for group in groups:
                    self.stdout.write(self.style.SUCCESS(f"Group {group} added"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"{e}"))

        elif options.get("mode") == MODES[1]:
            groups = UserGroupUtils.delete_user_groups()
            for group in groups:
                self.stdout.write(self.style.SUCCESS(f"Group {group} deleted"))

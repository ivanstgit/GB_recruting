# create or delete must be set
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand

from recrutingapp.models import NewsPost
from userapp.models import GROUP_PERMISSIONS

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
            for group, permissions in GROUP_PERMISSIONS.items():
                g, _ = Group.objects.get_or_create(name=group)
                # p1, __ = Permission.objects.get_or_create(name=row['permissions'])
                # g1.permissions.add(p1)
                self.stdout.write(self.style.SUCCESS(f"Group {group} added"))

                content_type = ContentType.objects.get_for_model(NewsPost)
                print(content_type)
                all_permissions = Permission.objects.filter(content_type=content_type)
                print(all_permissions)

                for perm in permissions:
                    p = Permission.objects.get(codename=perm)
                    if p:
                        g.permissions.add(p)
                        self.stdout.write(
                            self.style.SUCCESS(f"{group} permission added: {p.name}")
                        )
                    else:
                        self.style.WARNING(
                            f"{group} permission not added: {perm} not found"
                        )

        elif options.get("mode") == MODES[1]:
            for group, perm in GROUP_PERMISSIONS.items():
                g = Group.objects.get(name=group)
                if g:
                    g.delete()
                    self.stdout.write(self.style.SUCCESS(f"Group {group} added"))

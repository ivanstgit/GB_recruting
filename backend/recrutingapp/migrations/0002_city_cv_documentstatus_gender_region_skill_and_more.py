# Generated by Django 4.1 on 2024-04-22 11:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import recrutingapp.models


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("recrutingapp", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="City",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        error_messages={"unique": "Region already exists!"},
                        help_text="City name",
                        max_length=100,
                        unique=True,
                    ),
                ),
            ],
            options={
                "verbose_name": "city",
                "verbose_name_plural": "cities",
            },
        ),
        migrations.CreateModel(
            name="CV",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "title",
                    models.CharField(
                        error_messages={}, help_text="Title", max_length=60
                    ),
                ),
                ("description", models.TextField()),
            ],
            options={
                "verbose_name": "cv",
                "verbose_name_plural": "cvs",
            },
            bases=(recrutingapp.models.DocStatusMixin, models.Model),
        ),
        migrations.CreateModel(
            name="DocumentStatus",
            fields=[
                (
                    "id",
                    models.CharField(
                        choices=[
                            ("d", "Draft"),
                            ("p", "Pending"),
                            ("a", "Approved"),
                            ("r", "Rejected"),
                        ],
                        help_text="Status code",
                        max_length=1,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(help_text="Status name", max_length=25)),
            ],
            options={
                "verbose_name": "status",
                "verbose_name_plural": "statuses",
            },
        ),
        migrations.CreateModel(
            name="Gender",
            fields=[
                (
                    "id",
                    models.CharField(
                        help_text="Gender id",
                        max_length=1,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(help_text="Gender name", max_length=25)),
            ],
            options={
                "verbose_name": "gender",
                "verbose_name_plural": "genders",
            },
        ),
        migrations.CreateModel(
            name="Region",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        error_messages={"unique": "Region already exists!"},
                        help_text="Region name",
                        max_length=100,
                        unique=True,
                    ),
                ),
            ],
            options={
                "verbose_name": "region",
                "verbose_name_plural": "regions",
            },
        ),
        migrations.CreateModel(
            name="Skill",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        error_messages={"unique": "Skill already exists!"},
                        help_text="Skill name",
                        max_length=100,
                        unique=True,
                    ),
                ),
            ],
            options={
                "verbose_name": "skill",
                "verbose_name_plural": "skills",
            },
        ),
        migrations.AlterField(
            model_name="newspost",
            name="updated_by",
            field=models.ForeignKey(
                help_text="Updated by",
                on_delete=django.db.models.deletion.PROTECT,
                related_name="+",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.CreateModel(
            name="Employee",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "email",
                    models.CharField(
                        error_messages={
                            "unique": "An employee with that email address already exists."
                        },
                        max_length=256,
                        unique=True,
                        verbose_name="email address",
                    ),
                ),
                (
                    "city",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="recrutingapp.city",
                    ),
                ),
                (
                    "gender",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="recrutingapp.gender",
                    ),
                ),
                (
                    "owner",
                    models.OneToOneField(
                        help_text="Owner",
                        on_delete=django.db.models.deletion.PROTECT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "skills",
                    models.ManyToManyField(
                        help_text="Skills",
                        related_name="skills",
                        to="recrutingapp.skill",
                    ),
                ),
                (
                    "updated_by",
                    models.ForeignKey(
                        help_text="Updated by",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "employee",
                "verbose_name_plural": "employees",
            },
        ),
        migrations.CreateModel(
            name="CVExperience",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("datefrom", models.DateField()),
                ("dateto", models.DateField(blank=True)),
                ("is_current", models.BooleanField(default=False)),
                ("company", models.CharField(max_length=100, verbose_name="Company")),
                ("content", models.TextField(help_text="Content")),
                (
                    "city",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="recrutingapp.city",
                    ),
                ),
                (
                    "cv",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="recrutingapp.cv",
                    ),
                ),
            ],
            options={
                "verbose_name": "experience",
                "verbose_name_plural": "experience",
            },
        ),
        migrations.CreateModel(
            name="CVEducation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateField()),
                (
                    "institution",
                    models.CharField(max_length=100, verbose_name="Institution"),
                ),
                ("content", models.TextField(help_text="Content", max_length=1024)),
                (
                    "cv",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="recrutingapp.cv",
                    ),
                ),
            ],
            options={
                "verbose_name": "education",
                "verbose_name_plural": "education",
            },
        ),
        migrations.AddField(
            model_name="cv",
            name="employee",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, to="recrutingapp.employee"
            ),
        ),
        migrations.AddField(
            model_name="cv",
            name="owner",
            field=models.ForeignKey(
                help_text="Owner",
                on_delete=django.db.models.deletion.PROTECT,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="cv",
            name="updated_by",
            field=models.ForeignKey(
                help_text="Updated by",
                on_delete=django.db.models.deletion.PROTECT,
                related_name="+",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="city",
            name="region",
            field=models.ForeignKey(
                help_text="Region",
                on_delete=django.db.models.deletion.PROTECT,
                to="recrutingapp.region",
            ),
        ),
    ]

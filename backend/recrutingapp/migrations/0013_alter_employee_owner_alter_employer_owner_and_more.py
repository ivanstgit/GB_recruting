# Generated by Django 4.1 on 2024-06-15 13:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("recrutingapp", "0012_employer_status_employer_status_info_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="employee",
            name="owner",
            field=models.OneToOneField(
                help_text="Owner",
                on_delete=django.db.models.deletion.PROTECT,
                related_name="employee",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="employer",
            name="owner",
            field=models.OneToOneField(
                help_text="Owner",
                on_delete=django.db.models.deletion.PROTECT,
                related_name="employer",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.CreateModel(
            name="VacancyResponse",
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
                    "status_info",
                    models.CharField(
                        default="", help_text="Status info", max_length=150
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "cv",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="recrutingapp.cv",
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        help_text="Owner",
                        on_delete=django.db.models.deletion.PROTECT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "status",
                    models.ForeignKey(
                        choices=[
                            ("d", "Draft"),
                            ("p", "Pending"),
                            ("a", "Approved"),
                            ("r", "Rejected"),
                        ],
                        default="d",
                        help_text="Status",
                        on_delete=django.db.models.deletion.PROTECT,
                        to="recrutingapp.documentstatus",
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
                (
                    "vacancy",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="recrutingapp.vacancy",
                    ),
                ),
            ],
            options={
                "verbose_name": "vacancy_response",
                "verbose_name_plural": "vacancy_responses",
            },
        ),
        migrations.CreateModel(
            name="DocumentMessage",
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
                ("object_id", models.PositiveIntegerField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("content", models.TextField(help_text="Content", max_length=1024)),
                (
                    "content_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="contenttypes.contenttype",
                    ),
                ),
                (
                    "sender",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "message",
                "verbose_name_plural": "messages",
            },
        ),
        migrations.CreateModel(
            name="CVResponse",
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
                    "status_info",
                    models.CharField(
                        default="", help_text="Status info", max_length=150
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "cv",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="recrutingapp.cv",
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        help_text="Owner",
                        on_delete=django.db.models.deletion.PROTECT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "status",
                    models.ForeignKey(
                        choices=[
                            ("d", "Draft"),
                            ("p", "Pending"),
                            ("a", "Approved"),
                            ("r", "Rejected"),
                        ],
                        default="d",
                        help_text="Status",
                        on_delete=django.db.models.deletion.PROTECT,
                        to="recrutingapp.documentstatus",
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
                (
                    "vacancy",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="recrutingapp.vacancy",
                    ),
                ),
            ],
            options={
                "verbose_name": "cv_response",
                "verbose_name_plural": "cv_responses",
            },
        ),
        migrations.AddConstraint(
            model_name="vacancyresponse",
            constraint=models.UniqueConstraint(
                fields=("vacancy", "cv"), name="unique_vacancy_cv"
            ),
        ),
        migrations.AddConstraint(
            model_name="cvresponse",
            constraint=models.UniqueConstraint(
                fields=("cv", "vacancy"), name="unique_cv_vacancy"
            ),
        ),
    ]
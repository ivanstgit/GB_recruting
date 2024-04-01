# Generated by Django 4.1 on 2024-03-18 17:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("userapp", "0002_customuser_is_validated_customuser_validation_code"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="role",
            field=models.CharField(
                choices=[
                    ("employers", "employers"),
                    ("employees", "employees"),
                    ("moderators", "moderators"),
                ],
                default="",
                help_text="End user role",
                max_length=50,
                verbose_name="end user role",
            ),
        ),
    ]
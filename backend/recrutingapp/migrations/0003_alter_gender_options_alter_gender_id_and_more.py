# Generated by Django 4.1 on 2024-04-03 10:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "recrutingapp",
            "0002_city_employeeeducation_employeeexperience_gender_and_more",
        ),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="gender",
            options={"verbose_name": "gender", "verbose_name_plural": "genders"},
        ),
        migrations.AlterField(
            model_name="gender",
            name="id",
            field=models.CharField(
                help_text="Gender id", max_length=1, primary_key=True, serialize=False
            ),
        ),
        migrations.AlterField(
            model_name="gender",
            name="name",
            field=models.CharField(help_text="Gender name", max_length=25),
        ),
        migrations.AlterField(
            model_name="skill",
            name="name",
            field=models.CharField(
                error_messages={"unique": "Skill already exists!"},
                help_text="Skill name",
                max_length=100,
                unique=True,
            ),
        ),
    ]

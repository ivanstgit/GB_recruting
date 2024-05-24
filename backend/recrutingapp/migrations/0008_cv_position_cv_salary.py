# Generated by Django 4.1 on 2024-05-14 19:50

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("recrutingapp", "0007_cveducation_specialty_cvexperience_position"),
    ]

    operations = [
        migrations.AddField(
            model_name="cv",
            name="position",
            field=models.CharField(default="", max_length=100, verbose_name="Position"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="cv",
            name="salary",
            field=models.DecimalField(decimal_places=0, default=0, max_digits=10),
            preserve_default=False,
        ),
    ]
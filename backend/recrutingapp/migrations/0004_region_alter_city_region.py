# Generated by Django 4.1 on 2024-04-03 10:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("recrutingapp", "0003_alter_gender_options_alter_gender_id_and_more"),
    ]

    operations = [
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
                ("name", models.CharField(help_text="Region name", max_length=100)),
            ],
            options={
                "verbose_name": "region",
                "verbose_name_plural": "regions",
            },
        ),
        migrations.AlterField(
            model_name="city",
            name="region",
            field=models.ForeignKey(
                help_text="Region",
                on_delete=django.db.models.deletion.PROTECT,
                to="recrutingapp.region",
            ),
        ),
    ]

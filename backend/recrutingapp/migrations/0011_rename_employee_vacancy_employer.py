# Generated by Django 4.1 on 2024-05-23 19:26

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("recrutingapp", "0010_employer_alter_employee_owner_vacancy"),
    ]

    operations = [
        migrations.RenameField(
            model_name="vacancy",
            old_name="employee",
            new_name="employer",
        ),
    ]
# Generated by Django 4.0.4 on 2022-10-04 18:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0089_plant_nickname'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='plant',
            name='nickname',
        ),
    ]
# Generated by Django 4.0.4 on 2022-10-03 22:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0084_plant_genus_plant_nickname_plant_species'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='plant',
            name='nickname',
        ),
    ]
# Generated by Django 4.0.1 on 2022-04-01 22:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_experiment_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='experiment',
            name='user',
        ),
    ]
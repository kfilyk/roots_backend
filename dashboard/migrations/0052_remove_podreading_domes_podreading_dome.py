# Generated by Django 4.0.4 on 2022-07-07 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0051_alter_podreading_harvest_count'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='podreading',
            name='domes',
        ),
        migrations.AddField(
            model_name='podreading',
            name='dome',
            field=models.BooleanField(db_column='pr_dome', default=0, null=True),
        ),
    ]
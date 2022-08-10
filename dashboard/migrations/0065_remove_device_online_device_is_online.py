# Generated by Django 4.0.4 on 2022-08-10 18:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0064_remove_device_is_online_device_online'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='device',
            name='online',
        ),
        migrations.AddField(
            model_name='device',
            name='is_online',
            field=models.BooleanField(db_column='d_is_online', default=False),
        ),
    ]

# Generated by Django 4.0.4 on 2022-06-09 20:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0040_remove_device_device_capacity_device_capacity_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='podreading',
            name='pod',
            field=models.ForeignKey(blank=True, db_column='pr_pod_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='dashboard.pod'),
        ),
    ]

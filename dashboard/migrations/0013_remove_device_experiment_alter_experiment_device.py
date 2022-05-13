# Generated by Django 4.0.4 on 2022-05-03 00:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0012_remove_experiment_recipe_stage_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='device',
            name='experiment',
        ),
        migrations.AlterField(
            model_name='experiment',
            name='device',
            field=models.ForeignKey(db_column='e_device_id', default=-1, on_delete=django.db.models.deletion.DO_NOTHING, to='dashboard.device'),
        ),
    ]
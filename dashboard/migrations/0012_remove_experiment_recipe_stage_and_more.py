# Generated by Django 4.0.4 on 2022-04-21 22:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0011_reading_stage_rename_stage_pod_state_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='experiment',
            name='recipe_stage',
        ),
        migrations.AddField(
            model_name='experiment',
            name='current_stage',
            field=models.ForeignKey(blank=True, db_column='e_current_stage', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='dashboard.stage'),
        ),
    ]

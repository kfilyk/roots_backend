# Generated by Django 4.0.4 on 2022-09-15 17:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0078_remove_phase_name_remove_phase_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='status',
            field=models.IntegerField(db_column='e_status', default=0),
        ),
    ]
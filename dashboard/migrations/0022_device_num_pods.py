# Generated by Django 4.0.4 on 2022-05-18 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0021_phase_name_alter_phase_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='num_pods',
            field=models.IntegerField(db_column='d_num_pods', default=5),
        ),
    ]

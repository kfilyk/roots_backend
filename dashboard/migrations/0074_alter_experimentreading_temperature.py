# Generated by Django 4.0.4 on 2022-08-30 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0073_alter_experimentreading_temperature'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experimentreading',
            name='temperature',
            field=models.IntegerField(blank=True, db_column='er_temperature', null=True),
        ),
    ]
# Generated by Django 4.0.4 on 2022-05-27 16:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0031_remove_phase_nutrient_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='phase',
            name='nutrient_cycles',
        ),
    ]

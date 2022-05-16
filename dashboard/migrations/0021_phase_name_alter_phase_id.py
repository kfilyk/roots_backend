# Generated by Django 4.0.4 on 2022-05-16 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0020_phase_type_alter_phase_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='phase',
            name='name',
            field=models.CharField(db_column='ph_name', default='Basil', max_length=45),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='phase',
            name='id',
            field=models.AutoField(db_column='ph_id', primary_key=True, serialize=False),
        ),
    ]

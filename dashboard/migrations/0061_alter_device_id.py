# Generated by Django 4.0.4 on 2022-08-05 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0060_recipe_author'),
    ]

    operations = [
        migrations.AlterField(
            model_name='device',
            name='id',
            field=models.CharField(db_column='d_id', max_length=255, primary_key=True, serialize=False),
        ),
    ]
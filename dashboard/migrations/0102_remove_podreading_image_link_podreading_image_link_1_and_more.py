# Generated by Django 4.0.4 on 2022-10-11 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0101_remove_plant_genus'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='podreading',
            name='image_link',
        ),
        migrations.AddField(
            model_name='podreading',
            name='image_link_1',
            field=models.URLField(blank=True, db_column='pr_image_link_1', null=True),
        ),
        migrations.AddField(
            model_name='podreading',
            name='image_link_2',
            field=models.URLField(blank=True, db_column='pr_image_link_2', null=True),
        ),
        migrations.AddField(
            model_name='podreading',
            name='image_link_3',
            field=models.URLField(blank=True, db_column='pr_image_link_3', null=True),
        ),
        migrations.AddField(
            model_name='podreading',
            name='image_link_4',
            field=models.URLField(blank=True, db_column='pr_image_link_4', null=True),
        ),
    ]
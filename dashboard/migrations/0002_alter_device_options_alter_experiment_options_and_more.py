# Generated by Django 4.0.1 on 2022-03-20 20:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='device',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='experiment',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='experimentreading',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='plant',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='pod',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='podpack',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='recipe',
            options={'managed': True},
        ),
    ]

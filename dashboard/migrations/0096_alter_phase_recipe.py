# Generated by Django 4.0.4 on 2022-10-07 20:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0095_alter_phase_recipe'),
    ]

    operations = [
        migrations.AlterField(
            model_name='phase',
            name='recipe',
            field=models.ForeignKey(db_column='ph_recipe_id', null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.recipe'),
        ),
    ]

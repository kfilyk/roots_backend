# Generated by Django 4.0.4 on 2022-06-03 16:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0034_experiment_recipe_json'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='experiment',
        ),
        migrations.RemoveField(
            model_name='recipe',
            name='phase',
        ),
        migrations.RemoveField(
            model_name='recipe',
            name='precidence',
        ),
        migrations.AddField(
            model_name='recipe',
            name='name',
            field=models.CharField(db_column='r_name', default='NO RECIPE NAME', max_length=45),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase1',
            field=models.ForeignKey(blank=True, db_column='r_phase1_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase1', to='dashboard.phase'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase10',
            field=models.ForeignKey(blank=True, db_column='r_phase10_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase10', to='dashboard.phase'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase2',
            field=models.ForeignKey(blank=True, db_column='r_phase2_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase2', to='dashboard.phase'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase3',
            field=models.ForeignKey(blank=True, db_column='r_phase3_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase3', to='dashboard.phase'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase4',
            field=models.ForeignKey(blank=True, db_column='r_phase4_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase4', to='dashboard.phase'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase5',
            field=models.ForeignKey(blank=True, db_column='r_phase5_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase5', to='dashboard.phase'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase6',
            field=models.ForeignKey(blank=True, db_column='r_phase6_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase6', to='dashboard.phase'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase7',
            field=models.ForeignKey(blank=True, db_column='r_phase7_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase7', to='dashboard.phase'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase8',
            field=models.ForeignKey(blank=True, db_column='r_phase8_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase8', to='dashboard.phase'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='phase9',
            field=models.ForeignKey(blank=True, db_column='r_phase9_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='phase9', to='dashboard.phase'),
        ),
        migrations.AlterField(
            model_name='pod',
            name='plant',
            field=models.ForeignKey(db_column='po_plant_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='dashboard.plant'),
        ),
    ]
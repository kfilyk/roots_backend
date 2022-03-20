# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.conf import settings

'''
set FOREIGN_KEY_CHECKS = 0;
-- drop table plant_science.device cascade;
-- drop table plant_science.experiment cascade;
-- drop table plant_science.plant cascade;
-- drop table plant_science.experimentReading cascade;
-- drop table plant_science.pod cascade;
-- drop table plant_science.podPack cascade;
-- drop table plant_science.recipe cascade;
'''

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react
# https://djangoadventures.com/how-to-integrate-django-with-existing-database/

class Device(models.Model):
    device = models.AutoField(db_column='d_device_id', primary_key=True)
    name = models.CharField(db_column='d_name', max_length=45, blank=True, null=True)  # Field name made lowercase.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='d_user_id', on_delete=models.CASCADE, blank=True, null=True)  # Field name made lowercase.
    token = models.CharField(max_length=45, blank=True, null=True)
    creation_date = models.DateTimeField(db_column='d_creation_date', blank=True, null=True)  # Field name made lowercase.
    last_update = models.DateTimeField(db_column='d_last_update', blank=True, null=True)  # Field name made lowercase.
    is_online = models.BooleanField(db_column='d_is_online', default=False)  # Field name made lowercase. This field type is a guess.
    mac_address = models.CharField(db_column='d_mac_address', max_length=45, blank=True, null=True)  # Field name made lowercase.
    experiment = models.ForeignKey("Experiment", models.DO_NOTHING, related_name='+', db_column='d_experiment_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'device'

class Experiment(models.Model):
    experiment = models.AutoField(db_column='e_experiment_id', primary_key=True)  # Field name made lowercase.
    #experiment_readings = models.OneToOneField("ExperimentReading", models.DO_NOTHING, db_column='e_experiment', primary_key=True)  # Field name made lowercase.
    pod_pack = models.ForeignKey("PodPack", models.DO_NOTHING, db_column='e_podpack_id', blank=True, null=True)  # Field name made lowercase.
    recipe = models.ForeignKey("Recipe", models.DO_NOTHING, db_column='e_recipe_id', blank=True, null=True)  # Field name made lowercase.
    device = models.ForeignKey("Device", models.DO_NOTHING, related_name='+', db_column='e_device_id', blank=True, null=True)  # Field name made lowercase.
    score = models.DecimalField(db_column='e_score', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    start_date = models.DateTimeField(db_column='e_start_date', blank=True, null=True)  # Field name made lowercase.
    end_date = models.DateTimeField(db_column='e_end_date', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'experiment'

# many experiment readings per one experiment
class ExperimentReading(models.Model):
    experiment_reading_id = models.AutoField(db_column='er_experiment_reading_id', primary_key=True)  # Field name made lowercase.
    experiment_id = models.IntegerField(db_column='er_experiment_id', blank=True, null=True)  # Field name made lowercase.
    water_level = models.IntegerField(db_column='er_water_level', blank=True, null=True)  # Field name made lowercase.
    timestamp = models.DateTimeField(blank=True, null=True)
    water_tds = models.IntegerField(db_column='er_water_tds', blank=True, null=True)  # Field name made lowercase.
    water_ph = models.IntegerField(db_column='er_water_ph', blank=True, null=True)  # Field name made lowercase.
    electrical_conductance = models.IntegerField(db_column='er_electrical_conductance', blank=True, null=True)  # Field name made lowercase.
    reservoirtds = models.IntegerField(db_column='er_reservoir_tds', blank=True, null=True)  # Field name made lowercase.
    reservoirph = models.IntegerField(db_column='reservoirPH', blank=True, null=True)  # Field name made lowercase.
    watertemp = models.DecimalField(db_column='waterTemp', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    fillresflag = models.TextField(db_column='fillResFlag', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    airtemp = models.DecimalField(db_column='airTemp', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    airhum = models.DecimalField(db_column='airHum', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    recipestage = models.IntegerField(db_column='recipeStage', blank=True, null=True)  # Field name made lowercase.
    roomtemp = models.DecimalField(db_column='roomTemp', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    roomhum = models.DecimalField(db_column='roomHum', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    refillreservoirflag = models.TextField(db_column='refillReservoirFlag', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    photo = models.CharField(max_length=100, blank=True, null=True)
    nutrientscore = models.DecimalField(db_column='nutrientScore', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'experiment_reading'


class Plant(models.Model):
    plantid = models.AutoField(db_column='plantID', primary_key=True)  # Field name made lowercase.
    plantname = models.CharField(db_column='plantName', max_length=45)  # Field name made lowercase.
    supplier = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'plant'


class Pod(models.Model):
    podid = models.AutoField(db_column='podID', primary_key=True)  
    experimentid = models.CharField(db_column='experimentID', max_length=45, blank=True, null=True)  # Field name made lowercase.
    podreading = models.CharField(db_column='podReading', max_length=45, blank=True, null=True)  # Field name made lowercase.
    plantid = models.ForeignKey(Plant, models.DO_NOTHING, db_column='plantID', blank=True, null=True)  # type of plant for this pod
    position = models.IntegerField(blank=True, null=True) # position of pod in byte

    class Meta:
        managed = True
        db_table = 'pod'


class PodPack(models.Model):
    podpackid = models.AutoField(db_column='podPackID', primary_key=True)  # More like a pod 'group': pods could be completely unique. identify the specific podpack
    experimentid = models.ForeignKey(Experiment, models.DO_NOTHING, db_column='experimentID', blank=True, null=True)  
    # should have up to 10 of these!! pod1id, pod2id, pod3id ....
    podid = models.ForeignKey(Pod, models.DO_NOTHING, db_column='podID', blank=True, null=True)  # each podpack has a number of pods in it

    class Meta:
        managed = True
        db_table = 'pod_pack'


class Recipe(models.Model):
    recipename = models.CharField(db_column='recipeName', primary_key=True, max_length=45)  # Field name made lowercase.
    recipedata = models.CharField(db_column='recipeData', max_length=45, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'recipe'
